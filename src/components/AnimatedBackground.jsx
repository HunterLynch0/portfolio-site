import "../styles/AnimatedBackground.css";

function AnimatedBackground({ progress = 0 }) {
  return (
    <div
      className="animated-background"
      style={{ "--background-progress": progress.toFixed(4) }}
      aria-hidden="true"
    >
      <div className="background-aurora"></div>
      <div className="background-grid"></div>
      <div className="background-circuit"></div>
      <div className="background-scanlines"></div>
      <div className="background-noise"></div>
      <div className="background-particles">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index}></span>
        ))}
      </div>
    </div>
  );
}

export default AnimatedBackground;
