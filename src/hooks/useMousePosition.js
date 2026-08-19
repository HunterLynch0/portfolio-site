import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const interactiveCursorSelector = "a, button, .tilt-surface, .dino-game";

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
      if (!pointer.visible) return;

      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;

      document.documentElement.style.setProperty("--glow-x", `${pointer.x.toFixed(1)}px`);
      document.documentElement.style.setProperty("--glow-y", `${pointer.y.toFixed(1)}px`);
      document.documentElement.style.setProperty("--cursor-x", `${pointer.x.toFixed(1)}px`);
      document.documentElement.style.setProperty("--cursor-y", `${pointer.y.toFixed(1)}px`);

      const isSettled =
        Math.abs(pointer.targetX - pointer.x) < 0.15 &&
        Math.abs(pointer.targetY - pointer.y) < 0.15;

      if (!isSettled) {
        frameId = window.requestAnimationFrame(publishPointerState);
      }
    };

    const requestPointerFrame = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(publishPointerState);
    };

    const syncPointerClassState = (visible, active) => {
      const pointer = pointerRef.current;
      if (pointer.visible === visible && pointer.active === active) return;

      pointer.visible = visible;
      pointer.active = active;

      setPointerState((current) => {
        if (current.visible === visible && current.active === active) {
          return current;
        }

        return {
          visible,
          active,
        };
      });
    };

    const handlePointerMove = (event) => {
      pointerRef.current.targetX = event.clientX;
      pointerRef.current.targetY = event.clientY;

      const active = event.target instanceof Element
        ? Boolean(event.target.closest(interactiveCursorSelector))
        : false;

      syncPointerClassState(true, active);
      requestPointerFrame();
    };

    const handlePointerLeave = () => {
      syncPointerClassState(false, false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

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
