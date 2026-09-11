import { test } from "node:test";
import assert from "node:assert/strict";
import { createPulseScheduler } from "../src/scene/pulseScheduler.js";

test("passive packets cycle with varied gaps; interaction replaces the timer and destination", () => {
  let eligible = true,
    serial = 0,
    random = 0;
  const pending = new Map(),
    emitted = [],
    delays = [];
  const scheduler = createPulseScheduler({
    count: 6,
    enabled: () => eligible,
    emit: (...packet) => emitted.push(packet),
    random: () => (random++ % 3) / 2,
    delay(callback, ms) {
      pending.set(++serial, callback);
      delays.push(ms);
      return serial;
    },
    cancel: (id) => pending.delete(id),
  });
  const fire = () => {
    assert.equal(pending.size, 1);
    const [id, callback] = [...pending][0];
    pending.delete(id);
    callback();
  };
  scheduler.sync();
  scheduler.sync();
  for (let i = 0; i < 7; i++) fire();
  assert.deepEqual(
    emitted.map(([index]) => index),
    [0, 1, 2, 3, 4, 5, 0],
  );
  assert.ok(delays.every((ms) => ms >= 3000 && ms <= 6000));
  assert.equal(new Set(delays).size, 3);
  scheduler.interact(4);
  assert.deepEqual(emitted.at(-1), [4, "interaction"]);
  assert.equal(pending.size, 1);
  eligible = false;
  scheduler.sync();
  assert.equal(pending.size, 0);
  const count = emitted.length;
  scheduler.interact(2);
  assert.equal(emitted.length, count);
  eligible = true;
  scheduler.sync();
  const staleCallback = [...pending.values()][0];
  scheduler.dispose();
  staleCallback();
  scheduler.sync();
  assert.equal(pending.size, 0);
  assert.equal(emitted.length, count);
});

test("a visibility or motion change at timer delivery cannot send a packet", () => {
  let eligible = true,
    callback;
  const scheduler = createPulseScheduler({
    count: 6,
    enabled: () => eligible,
    emit: () => assert.fail("Inactive scene emitted a pulse"),
    delay: (fn) => {
      callback = fn;
      return 1;
    },
    cancel() {},
  });
  scheduler.sync();
  eligible = false;
  callback();
  scheduler.dispose();
});
