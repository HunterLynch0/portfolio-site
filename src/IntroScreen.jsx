import { useEffect, useState } from "react";

const INTRO_EXIT_DELAY = 2600;
const INTRO_REMOVE_DELAY = 3300;

function IntroScreen({ onComplete }) {
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, INTRO_EXIT_DELAY);

    const removeTimer = window.setTimeout(() => {
      setIsMounted(false);
      onComplete?.();
    }, INTRO_REMOVE_DELAY);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
      <div
          className={`intro-screen ${isExiting ? "intro-screen-exit" : ""}`}
          role="status"
          aria-label="Hunter Lynch"
      >
        <div className="intro-grid"></div>

        <div className="intro-title-shell">
          <span className="intro-system-line" aria-hidden="true">PORTFOLIO_BOOT</span>
          <div className="intro-name" data-text="Hunter Lynch" aria-hidden="true">
            Hunter Lynch
          </div>
          <div className="intro-loader" aria-hidden="true">
            <span></span>
          </div>
        </div>
      </div>
  );
}

export default IntroScreen;
