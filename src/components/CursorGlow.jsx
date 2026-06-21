import useMousePosition from "../hooks/useMousePosition";
import "../styles/CursorGlow.css";

function CursorGlow() {
  const { visible, active } = useMousePosition();
  const className = `cursor-system ${visible ? "is-visible" : ""} ${active ? "is-active" : ""}`;

  return (
    <>
      <div className={`${className} cursor-system-ring`}></div>
      <div className={`${className} cursor-system-core`}></div>
    </>
  );
}

export default CursorGlow;
