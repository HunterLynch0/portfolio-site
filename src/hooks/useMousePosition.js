import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

function useMousePosition() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    visible: false,
    active: false,
  });
  const [pointerState, setPointerState] = useState({
    visible: false,
    active: false,
  });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");

    if (prefersReducedMotion || !pointerQuery.matches) return undefined;

    let frameId = null;

    const publishPointerState = () => {
      frameId = null;

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;

      const hoverTarget = pointer.visible
        ? document.elementFromPoint(pointer.targetX, pointer.targetY)?.closest("a, button, .tilt-surface, .dino-game")
        : null;
      pointer.active = Boolean(hoverTarget);

      document.documentElement.style.setProperty("--glow-x", `${pointer.x.toFixed(1)}px`);
      document.documentElement.style.setProperty("--glow-y", `${pointer.y.toFixed(1)}px`);
      document.documentElement.style.setProperty("--cursor-x", `${pointer.x.toFixed(1)}px`);
      document.documentElement.style.setProperty("--cursor-y", `${pointer.y.toFixed(1)}px`);

      setPointerState((current) => {
        if (current.visible === pointer.visible && current.active === pointer.active) {
          return current;
        }

        return {
          visible: pointer.visible,
          active: pointer.active,
        };
      });

      frameId = window.requestAnimationFrame(publishPointerState);
    };

    const handlePointerMove = (event) => {
      pointerRef.current.targetX = event.clientX;
      pointerRef.current.targetY = event.clientY;
      pointerRef.current.visible = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.visible = false;
      pointerRef.current.active = false;
      setPointerState((current) => ({
        ...current,
        visible: false,
        active: false,
      }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    frameId = window.requestAnimationFrame(publishPointerState);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [prefersReducedMotion]);

  return pointerState;
}

export default useMousePosition;
