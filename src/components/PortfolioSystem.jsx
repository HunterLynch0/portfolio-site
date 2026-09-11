import { useEffect, useRef, useState } from "react";
import { initialSystemModule, systemModules } from "../data/system";
import Arrow from "./Arrow";

export default function PortfolioSystem({ paused }) {
  const host = useRef(null),
    controller = useRef(null),
    anchors = useRef(new Map()),
    pausedRef = useRef(paused);
  const pointerType = useRef("mouse");
  const [selected, setSelected] = useState(initialSystemModule);
  const selectedRef = useRef(selected);
  const module = systemModules.find((item) => item.id === selected);
  useEffect(() => {
    pausedRef.current = paused;
    controller.current?.syncMotion();
  }, [paused]);
  useEffect(() => {
    selectedRef.current = selected;
    controller.current?.setActive(selected);
  }, [selected]);
  useEffect(() => {
    let cancelled = false;
    import("../scene/portfolioSystem.js")
      .then(({ createPortfolioSystem }) => {
        if (cancelled) return;
        controller.current = createPortfolioSystem(host.current, {
          anchors: anchors.current,
          initialActive: selectedRef.current,
          paused: () => pausedRef.current,
          onHover: setSelected,
          onActivate: (id) => {
            const target = systemModules.find((item) => item.id === id);
            if (target) window.location.hash = target.href;
          },
        });
        controller.current.setActive(selectedRef.current);
      })
      .catch(() => {
        /* The semantic module links remain available without WebGL. */
      });
    return () => {
      cancelled = true;
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  return (
    <div className="technical-system">
      <div
        ref={host}
        className="system-viewport sculpture-stage"
        role="group"
        aria-label="Interactive portfolio system. Explore six connected modules."
      >
        <div className="system-fallback" aria-hidden="true">
          <span className="fallback-orb" />
          <p>A connected body of work.</p>
        </div>
        <div className="system-hotspots" aria-label="Explore portfolio modules">
          {systemModules.map((item) => (
            <a
              key={item.id}
              href={item.href}
              ref={(element) => {
                if (element) anchors.current.set(item.id, element);
                else anchors.current.delete(item.id);
              }}
              className={`system-hotspot ${selected === item.id ? "is-active" : ""}`}
              aria-label={`Explore ${item.label}: ${item.title}`}
              aria-current={selected === item.id ? "true" : undefined}
              aria-describedby={
                selected === item.id ? "system-preview" : undefined
              }
              onPointerEnter={() => {
                if (
                  !host.current?.classList.contains("is-dragging") &&
                  performance.now() >
                    Number(host.current?.dataset.suppressHoverUntil || 0)
                )
                  setSelected(item.id);
              }}
              onFocus={() => setSelected(item.id)}
              onPointerDown={(event) => {
                pointerType.current = event.pointerType;
              }}
              onPointerCancel={() => {
                pointerType.current = "mouse";
              }}
              onKeyDown={() => {
                pointerType.current = "keyboard";
              }}
              onClick={(event) => {
                if (pointerType.current === "touch") {
                  event.preventDefault();
                  setSelected(item.id);
                }
                pointerType.current = "mouse";
              }}
            >
              <span className="hotspot-caption">
                <span className="hotspot-index">{item.index}</span>
                <span className="hotspot-label">
                  {item.id === "featured" ? "IssueFlow" : item.label}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div
        className="system-preview"
        id="system-preview"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="system-preview-heading">
          <span className="eyebrow">
            {module.index} / {module.label}
          </span>
          <span className="system-preview-rule" />
        </div>
        <div className="system-preview-content" key={selected}>
          <h2>{module.title}</h2>
          <p>{module.preview}</p>
          <a className="text-link" href={module.href}>
            {module.action}
            <Arrow diagonal />
          </a>
        </div>
      </div>
      <div
        className="system-mobile-selector"
        role="group"
        aria-label="Choose a portfolio module"
      >
        {systemModules.map((item) => (
          <button
            key={item.id}
            aria-label={`Preview ${item.label}`}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            {item.index}
          </button>
        ))}
      </div>
    </div>
  );
}
