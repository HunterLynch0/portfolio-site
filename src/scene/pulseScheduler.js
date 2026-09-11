// One sleeping timer and one reused packet. Interaction always takes priority.
export function createPulseScheduler({
  count,
  enabled,
  emit,
  delay = setTimeout,
  cancel = clearTimeout,
  random = Math.random,
}) {
  let timer = null;
  let next = 0;
  let disposed = false;
  function stop() {
    if (timer !== null) cancel(timer);
    timer = null;
  }
  function sync() {
    if (disposed || !enabled()) return stop();
    if (timer !== null) return;
    timer = delay(
      () => {
        timer = null;
        if (disposed || !enabled()) return;
        emit(next, "passive");
        next = (next + 1) % count;
        sync();
      },
      3400 + random() * 2100,
    );
  }
  return {
    sync,
    interact(index) {
      stop();
      if (!disposed && enabled()) emit(index, "interaction");
      sync();
    },
    dispose() {
      disposed = true;
      stop();
    },
  };
}
