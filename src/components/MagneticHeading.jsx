import { useEffect, useRef } from "react";

export default function MagneticHeading({ paused }) {
  const heading = useRef(null);
  useEffect(() => {
    const element = heading.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = matchMedia("(hover: hover) and (pointer: fine)");
    const overlay = document.createElement("div");
    overlay.className = "magnetic-letters";
    overlay.setAttribute("aria-hidden", "true");
    element.append(overlay);
    const letters = [];
    const range = document.createRange();
    for (const line of element.querySelectorAll(".magnetic-line")) {
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        for (let index = 0; index < node.length; index++) {
          const glyph = document.createElement("span");
          glyph.textContent = node.data[index];
          overlay.append(glyph);
          letters.push({
            node,
            index,
            line,
            glyph,
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            depth: 0,
            rx: 0,
            ry: 0,
          });
        }
      }
    }
    let rect,
      radius = 120,
      frame = 0,
      last = 0,
      inside = false;
    let pointerX = 0,
      pointerY = 0,
      disposed = false;
    const enabled = () =>
      !paused && !reduced.matches && mouse.matches && !document.hidden;
    function reset() {
      inside = false;
      cancelAnimationFrame(frame);
      frame = 0;
      element.classList.remove("is-magnetic");
      for (const letter of letters) {
        letter.dx = letter.dy = letter.depth = letter.rx = letter.ry = 0;
        letter.glyph.style.transform = "none";
      }
    }
    function measure() {
      // Keep the original shaped text in normal flow: its kerning, wrapping and
      // dimensions remain untouched. Measure only on entry or layout changes.
      rect = element.getBoundingClientRect();
      radius = parseFloat(getComputedStyle(element).fontSize) * 0.9;
      for (const letter of letters) {
        range.setStart(letter.node, letter.index);
        range.setEnd(letter.node, letter.index + 1);
        const box = range.getBoundingClientRect();
        letter.x = box.x - rect.x + box.width / 2;
        letter.y = box.y - rect.y + box.height / 2;
        letter.glyph.style.left = `${box.x - rect.x}px`;
        letter.glyph.style.top = `${letter.line.getBoundingClientRect().y - rect.y}px`;
        letter.glyph.style.color = getComputedStyle(
          letter.node.parentElement,
        ).color;
      }
    }
    function tick(now) {
      frame = 0;
      if (!enabled()) return reset();
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30);
      last = now;
      const ease = 1 - Math.exp(-14 * dt);
      let unsettled = false;
      for (const letter of letters) {
        const x = pointerX - letter.x,
          y = pointerY - letter.y;
        const distance = Math.hypot(x, y);
        const t = inside ? Math.max(0, 1 - distance / radius) : 0;
        const weight = (t * t * (3 - 2 * t)) ** 2;
        const direction = Math.max(distance, 24);
        const dx = (x / direction) * 5 * weight;
        const dy = (y / direction) * 5 * weight;
        const depth = 6 * weight;
        const rx = (-y / direction) * 1.5 * weight;
        const ry = (x / direction) * 1.5 * weight;
        letter.dx += (dx - letter.dx) * ease;
        letter.dy += (dy - letter.dy) * ease;
        letter.depth += (depth - letter.depth) * ease;
        letter.rx += (rx - letter.rx) * ease;
        letter.ry += (ry - letter.ry) * ease;
        unsettled ||=
          Math.abs(dx - letter.dx) +
            Math.abs(dy - letter.dy) +
            Math.abs(depth - letter.depth) +
            Math.abs(rx - letter.rx) +
            Math.abs(ry - letter.ry) >
          0.005;
        letter.glyph.style.transform = `perspective(600px) translate3d(${letter.dx}px,${letter.dy}px,${letter.depth}px) rotateX(${letter.rx}deg) rotateY(${letter.ry}deg)`;
      }
      if (unsettled) frame = requestAnimationFrame(tick);
      else if (!inside) reset();
    }
    function wake() {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    function move(event) {
      if (event.pointerType !== "mouse" || !enabled()) return reset();
      if (!inside) {
        measure();
        inside = true;
        element.classList.add("is-magnetic");
      }
      pointerX = event.clientX - rect.x;
      pointerY = event.clientY - rect.y;
      wake();
    }
    function leave() {
      if (!inside) return;
      inside = false;
      wake();
    }
    function layout() {
      reset();
    }
    const observer = new ResizeObserver(layout);
    observer.observe(element);
    document.fonts.ready.then(() => {
      if (!disposed) reset();
    });
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", reset);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    reduced.addEventListener("change", reset);
    mouse.addEventListener("change", reset);
    return () => {
      disposed = true;
      reset();
      observer.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", reset);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      reduced.removeEventListener("change", reset);
      mouse.removeEventListener("change", reset);
      overlay.remove();
    };
  }, [paused]);
  return (
    <h1 id="hero-title" ref={heading} aria-label="Hunter Lynch.">
      <span className="magnetic-line">Hunter</span>
      <span className="magnetic-line">
        Lynch<span className="name-period">.</span>
      </span>
    </h1>
  );
}
