export const rotationLimits = { yaw: Math.PI * 0.23, pitch: Math.PI * 0.045 };
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
// RAF timestamps can precede an input event's performance.now() in the same
// frame. Keep that clock skew from advancing springs or curve samples backward.
export const frameDelta = (now, previous) =>
  clamp((now - previous) / 1000, 1 / 240, 1 / 30);

export function focusRotation(angle) {
  const delta = Math.atan2(Math.sin(angle - 0.98), Math.cos(angle - 0.98));
  return clamp(delta * 0.16, -0.22, 0.22);
}

export function dragIntent(type, dx, dy) {
  if (Math.hypot(dx, dy) < 7) return "pending";
  if (type === "touch" && Math.abs(dy) > Math.abs(dx) * 1.1) return "scroll";
  if (type === "touch" && Math.abs(dx) < Math.abs(dy) * 1.1) return "pending";
  return "rotate";
}

// Integrating through tanh adds resistance without a hard stop or a jump when
// another gesture starts near the limit. The released position is retained.
export function dragRotation(start, dx, dy, width, height, touch = false) {
  const resisted = (value, delta, limit) =>
    limit *
    Math.tanh(Math.atanh(clamp(value / limit, -0.999, 0.999)) + delta / limit);
  return {
    yaw: resisted(start.yaw, (dx / Math.max(width, 1)) * 1.7, 0.59),
    pitch: touch
      ? start.pitch
      : resisted(
          start.pitch,
          (dy / Math.max(height, 1)) * 0.48,
          rotationLimits.pitch,
        ),
  };
}
