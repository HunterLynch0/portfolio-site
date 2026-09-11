import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  createSystemGeometry,
  springStep,
  updateCorePose,
} from "./systemGeometry.js";

import { createPulseScheduler } from "./pulseScheduler.js";
import { initialSystemModule } from "../data/system.js";
import {
  clamp,
  dragIntent,
  dragRotation,
  focusRotation,
  frameDelta,
  rotationLimits,
} from "./systemInteraction.js";

export function createPortfolioSystem(
  host,
  { onHover, onActivate, anchors, paused, initialActive = initialSystemModule },
) {
  const fallback = { dispose() {}, setActive() {}, syncMotion() {} };
  const canvas = document.createElement("canvas");
  let context;
  try {
    context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return fallback;
  }
  if (!context) return fallback;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: true,
    });
  } catch {
    return fallback;
  }
  canvas.setAttribute("aria-hidden", "true");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 640px)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.25 : 1.65));
  renderer.setClearColor(0xf5f4f0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 40);
  const model = createSystemGeometry(compact);
  scene.add(model.root);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(environment, 0.04);
  scene.environment = target.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x63665a, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3.8);
  key.position.set(-3, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.5);
  rim.position.set(5, 2, -3);
  scene.add(rim);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hoverPoint = new THREE.Vector2(4, 4);
  const projection = new THREE.Vector3();
  const labelBounds = new THREE.Box3();
  const labelCorner = new THREE.Vector3();
  const restProjection = new THREE.Vector3();
  const baseCamera = new THREE.Vector3(5.8, 6.3, 8.6);
  const cameraDirection = baseCamera.clone().normalize();
  const pointerSmooth = { x: 0, y: 0 };
  const manual = { yaw: 0, pitch: 0 };
  const orientation = { yaw: 0, pitch: 0 };
  const signalPoint = new THREE.Vector3();
  const signalTangent = new THREE.Vector3();
  const springResult = [0, 0];
  const offset = new THREE.Vector3();
  const tangentEnd = new THREE.Vector3();
  const signalAxis = new THREE.Vector3(0, 1, 0);
  let signalProgress = 1,
    signalModule = model.modules[0],
    pulseCount = 0,
    suppressClickUntil = 0;
  let idleTime = 0;
  let active = initialActive,
    frame = 0,
    last = 0,
    visible = true,
    lost = false,
    disposed = false,
    width = 1,
    height = 1,
    scrollTarget = 0,
    scroll = 0,
    distance = 11.8,
    pressed = null;
  const geometries = model.paths.flatMap((path) =>
    path.children.map((mesh) => ({
      mesh,
      rest: mesh.geometry.attributes.position.array.slice(),
    })),
  );

  const labels = new Map(
    [...anchors].map(([id, anchor]) => [
      id,
      {
        anchor,
        caption: anchor.querySelector(".hotspot-caption"),
        width: 0,
        height: 0,
      },
    ]),
  );
  const pulses = createPulseScheduler({
    count: model.modules.length,
    enabled: () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !lost &&
      !reduced.matches &&
      !paused(),
    emit(index, kind) {
      signalModule = model.modules[index];
      signalProgress = 0;
      host.dataset.signalModule = signalModule.data.id;
      host.dataset.signalKind = kind;
      host.dataset.pulseCount = String(++pulseCount);
      invalidate();
    },
  });
  function syncPulses() {
    if (!visible || document.hidden || lost || reduced.matches || paused()) {
      signalProgress = 1;
      model.signal.visible = false;
    }
    pulses.sync();
  }

  function positionLabels() {
    model.root.updateMatrixWorld(true);
    model.modules.forEach(({ group, data, base }) => {
      const label = labels.get(data.id);
      if (!label) return;
      const { anchor } = label;
      group.getWorldPosition(projection);
      projection.project(camera);
      labelBounds.setFromObject(group);
      let bottom = 0,
        top = height;
      for (let corner = 0; corner < 8; corner++) {
        labelCorner
          .set(
            corner & 1 ? labelBounds.max.x : labelBounds.min.x,
            corner & 2 ? labelBounds.max.y : labelBounds.min.y,
            corner & 4 ? labelBounds.max.z : labelBounds.min.z,
          )
          .project(camera);
        const y = (-labelCorner.y * 0.5 + 0.5) * height;
        bottom = Math.max(bottom, y);
        top = Math.min(top, y);
      }
      restProjection.copy(base);
      model.root.localToWorld(restProjection);
      restProjection.y += 0.36;
      restProjection.project(camera);
      anchor.style.setProperty(
        "--node-x",
        `${(restProjection.x * 0.5 + 0.5) * width}px`,
      );
      anchor.style.setProperty(
        "--node-y",
        `${(-restProjection.y * 0.5 + 0.5) * height}px`,
      );
      const labelX = clamp(
        (projection.x * 0.5 + 0.5) * width,
        label.width / 2 + 4,
        width - label.width / 2 - 4,
      );
      const labelY = clamp(
        (-projection.y * 0.5 + 0.5) * height < height * 0.55 &&
          projection.x < 0.5
          ? top - label.height - 6
          : bottom + 6,
        4,
        height - label.height - 4,
      );
      anchor.style.setProperty(
        "--label-shift-x",
        `${labelX - (restProjection.x * 0.5 + 0.5) * width}px`,
      );
      anchor.style.setProperty(
        "--label-shift-y",
        `${labelY - (-restProjection.y * 0.5 + 0.5) * height}px`,
      );
    });
  }
  function draw() {
    if (lost) return;
    renderer.render(scene, camera);
    positionLabels();
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.triangles = String(renderer.info.render.triangles);
    host.dataset.yaw = orientation.yaw.toFixed(4);
    host.dataset.pitch = orientation.pitch.toFixed(4);
    host.dataset.signal = signalProgress.toFixed(3);
    host.dataset.coreRotation = model.shell.rotation.y.toFixed(5);
    host.dataset.coreScale = model.nucleus.scale.x.toFixed(5);
  }
  function update(delta, instant = false) {
    const ease = instant ? 1 : 1 - Math.exp(-delta * 2.6);
    const still = reduced.matches || paused();
    const targetX = still ? 0 : pointer.x,
      targetY = still ? 0 : pointer.y;
    pointerSmooth.x += (targetX - pointerSmooth.x) * ease;
    pointerSmooth.y += (targetY - pointerSmooth.y) * ease;
    scroll += (scrollTarget - scroll) * ease;
    camera.position.copy(cameraDirection).multiplyScalar(distance);
    camera.position.x += pointerSmooth.x * 0.18;
    camera.position.y -= pointerSmooth.y * 0.1;
    camera.lookAt(0, 0.05, 0);
    const selected = model.modules.find((module) => module.data.id === active);
    const yawTarget = clamp(
      -0.15 +
        focusRotation(selected.data.angle) +
        manual.yaw +
        (still ? 0 : scroll * 0.08),
      -rotationLimits.yaw,
      rotationLimits.yaw,
    );
    const pitchTarget = clamp(
      manual.pitch,
      -rotationLimits.pitch,
      rotationLimits.pitch,
    );
    const poseEase = instant || still ? 1 : 1 - Math.exp(-delta * 8);
    orientation.yaw += (yawTarget - orientation.yaw) * poseEase;
    orientation.pitch += (pitchTarget - orientation.pitch) * poseEase;
    model.root.rotation.y = orientation.yaw + pointerSmooth.x * 0.012;
    model.root.rotation.x = orientation.pitch;
    model.root.rotation.z = pointerSmooth.y * 0.006;
    let moving =
      Math.abs(pointerSmooth.x - targetX) +
        Math.abs(pointerSmooth.y - targetY) +
        Math.abs(scroll - scrollTarget) >
        0.001 ||
      Math.abs(orientation.yaw - yawTarget) +
        Math.abs(orientation.pitch - pitchTarget) >
        0.0003;
    model.modules.forEach((module, index) => {
      const wanted = module.data.id === active ? 1 : 0;
      if (instant || still) {
        module.progress = wanted;
        module.velocity = 0;
      } else
        [module.progress, module.velocity] = springStep(
          module.progress,
          module.velocity,
          wanted,
          delta,
          springResult,
        );
      moving ||=
        Math.abs(module.progress - wanted) > 0.0005 ||
        Math.abs(module.velocity) > 0.001;
      const expansion =
        1 + module.progress * 0.105 + (still ? 0 : scroll * 0.105);
      module.group.position.set(
        module.base.x * expansion,
        module.base.y + module.progress * 0.36 + (still ? 0 : scroll * 0.13),
        module.base.z * expansion,
      );
      module.group.rotation.y =
        -module.data.angle + 0.35 + module.progress * 0.075;
      module.materials.silver.color.setScalar(0.52 + module.progress * 0.16);
      module.materials.graphite.color.setRGB(
        0.03 + module.progress * 0.018,
        0.034 + module.progress * 0.018,
        0.026 + module.progress * 0.018,
      );
      model.paths[index].children[0].material.color.setScalar(
        0.32 + module.progress * 0.32,
      );
      offset.copy(module.group.position).sub(module.base);
      for (let rail = 0; rail < 2; rail++) {
        const { mesh, rest } = geometries[index * 2 + rail];
        const position = mesh.geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
          const weight = (Math.floor(i / 7) / 20) ** 2;
          position.setXYZ(
            i,
            rest[i * 3] + offset.x * weight,
            rest[i * 3 + 1] + offset.y * weight,
            rest[i * 3 + 2] + offset.z * weight,
          );
        }
        position.needsUpdate = true;
      }
    });
    // Both cycles meet at 2,200 seconds: nine turns and 500 breaths.
    if (!still && !instant) idleTime = (idleTime + delta) % 2200;
    updateCorePose(model, idleTime);
    if (still) signalProgress = 1;
    if (signalProgress < 1) {
      signalProgress = Math.min(1, signalProgress + delta / 1.1);
      const route = model.paths[signalModule.index];
      const path = route.userData.curve;
      offset.copy(signalModule.group.position).sub(signalModule.base);
      path.getPoint(signalProgress, signalPoint);
      signalPoint.addScaledVector(offset, signalProgress ** 2);
      signalPoint.add(route.children[0].position);
      signalPoint.y += 0.02;
      const before = Math.max(0, signalProgress - 0.001);
      const after = Math.min(1, signalProgress + 0.001);
      path.getPoint(before, signalTangent);
      path.getPoint(after, tangentEnd);
      signalTangent.subVectors(tangentEnd, signalTangent);
      signalTangent.addScaledVector(offset, after ** 2 - before ** 2);
      model.signal.position.copy(signalPoint);
      model.signal.quaternion.setFromUnitVectors(
        signalAxis,
        signalTangent.normalize(),
      );
      model.signal.material.opacity = Math.sin(signalProgress * Math.PI);
      model.nucleus.material.emissiveIntensity +=
        Math.sin(Math.min(1, signalProgress * 3) * Math.PI) * 0.12;
      moving ||= signalProgress < 1;
    }
    model.signal.visible = !still && signalProgress < 1;
    draw();
    return moving || !still;
  }
  function tick(now) {
    frame = 0;
    if (disposed || !visible || document.hidden || lost) return;
    const delta = frameDelta(now, last);
    last = now;
    const moving = update(delta, reduced.matches || paused());
    if (moving && !reduced.matches && !paused())
      frame = requestAnimationFrame(tick);
  }
  function invalidate() {
    if (!disposed && !frame && visible && !document.hidden && !lost) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function setActive(id) {
    if (active !== id) {
      if (!model.modules.some((module) => module.data.id === id)) return;
      active = id;
      manual.yaw *= 0.55;
      manual.pitch *= 0.55;
      pulses.interact(
        model.modules.findIndex((module) => module.data.id === id),
      );
      invalidate();
    }
  }
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    labels.forEach((label) => {
      label.width = label.caption.offsetWidth;
      label.height = label.caption.offsetHeight;
    });
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Fit the assembled footprint, including the raised, selected component.
    distance = camera.aspect < 0.85 ? 14.8 : camera.aspect < 1.1 ? 12.0 : 9.7;
    camera.updateProjectionMatrix();
    update(1 / 60, true);
    invalidate();
  }
  function hit(event) {
    const rect = host.getBoundingClientRect();
    hoverPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(hoverPoint, camera);
    const intersections = raycaster.intersectObjects(
      model.modules.map((module) => module.group),
      true,
    );
    if (!intersections.length) return null;
    return intersections[0].object.parent.userData.moduleId;
  }
  function move(event) {
    if (pressed && event.pointerId === pressed.pointerId) {
      const dx = event.clientX - pressed.x,
        dy = event.clientY - pressed.y;
      const intent = pressed.dragging
        ? "rotate"
        : dragIntent(pressed.type, dx, dy);
      if (intent === "scroll") {
        pressed.scrolling = true;
        return;
      }
      if (pressed.scrolling || intent === "pending") return;
      if (!pressed.dragging) {
        pressed.dragging = true;
        host.classList.add("is-dragging");
        pointer.set(0, 0);
        try {
          host.setPointerCapture(event.pointerId);
        } catch {
          /* Synthetic or interrupted pointer. */
        }
      }
      Object.assign(
        manual,
        dragRotation(
          pressed.start,
          dx,
          dy,
          width,
          height,
          pressed.type === "touch",
        ),
      );
      if (event.cancelable) event.preventDefault();
      if (reduced.matches || paused()) update(1 / 60, true);
      else invalidate();
      return;
    }
    if (event.pointerType === "touch") return;
    // Parallax is local, small and slow; moving around the rest of the page is quiet.
    if (!host.contains(event.target)) {
      leave();
      return;
    }
    const rect = host.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
    const id = hit(event);
    canvas.style.cursor = id ? "pointer" : "grab";
    if (id && performance.now() > suppressClickUntil) {
      setActive(id);
      onHover(id);
    }
    if (!reduced.matches && !paused()) invalidate();
  }
  function down(event) {
    if (!event.isPrimary || event.button !== 0) return;
    pressed = {
      x: event.clientX,
      y: event.clientY,
      id: hit(event),
      type: event.pointerType,
      pointerId: event.pointerId,
      dragging: false,
      scrolling: false,
      start: { ...manual },
    };
  }
  function finishPointer(event) {
    if (!pressed || event.pointerId !== pressed.pointerId) return null;
    const start = pressed;
    pressed = null;
    host.classList.remove("is-dragging");
    if (host.hasPointerCapture(event.pointerId))
      host.releasePointerCapture(event.pointerId);
    if (start.dragging || start.scrolling) {
      suppressClickUntil = performance.now() + 350;
      host.dataset.suppressHoverUntil = String(suppressClickUntil);
    }
    return start;
  }
  function up(event) {
    const start = finishPointer(event);
    if (
      !start ||
      start.dragging ||
      start.scrolling ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7 ||
      !start.id
    )
      return;
    if (event.target.closest("a")) return;
    setActive(start.id);
    onHover(start.id);
    if (start.type !== "touch") onActivate(start.id);
  }
  function cancel(event) {
    finishPointer(event);
  }
  function blockDragClick(event) {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  function preventNativeDrag(event) {
    event.preventDefault();
  }
  function leave() {
    const changed = pointer.lengthSq() > 0;
    pointer.set(0, 0);
    if (changed && !pressed?.dragging && !reduced.matches && !paused())
      invalidate();
  }
  function interruptPointer() {
    if (pressed) finishPointer({ pointerId: pressed.pointerId });
    leave();
  }
  function onScroll() {
    scrollTarget = Math.min(scrollY / Math.max(innerHeight, 1), 1);
    if (!reduced.matches && !paused()) invalidate();
  }
  function syncMotion() {
    syncPulses();
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden) update(1 / 60, true);
    invalidate();
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncPulses();
      if (visible) invalidate();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "40px" },
  );
  const resizeObserver = new ResizeObserver(resize);
  const visibility = () => {
    syncPulses();
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else invalidate();
  };
  const contextLost = (event) => {
    event.preventDefault();
    lost = true;
    syncPulses();
    cancelAnimationFrame(frame);
    frame = 0;
    host.classList.remove("is-ready");
  };
  const contextRestored = () => {
    lost = false;
    syncPulses();
    host.classList.add("is-ready");
    resize();
  };
  observer.observe(host);
  resizeObserver.observe(host);
  window.addEventListener("pointermove", move, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  host.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", cancel);
  host.addEventListener("lostpointercapture", cancel);
  window.addEventListener("blur", interruptPointer);
  host.addEventListener("click", blockDragClick, true);
  host.addEventListener("dragstart", preventNativeDrag);
  reduced.addEventListener("change", syncMotion);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  host.classList.add("is-ready");
  onScroll();
  resize();
  syncPulses();
  return {
    setActive,
    syncMotion,
    dispose() {
      disposed = true;
      pulses.dispose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      host.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      host.removeEventListener("lostpointercapture", cancel);
      window.removeEventListener("blur", interruptPointer);
      host.removeEventListener("click", blockDragClick, true);
      host.removeEventListener("dragstart", preventNativeDrag);
      host.classList.remove("is-dragging");
      reduced.removeEventListener("change", syncMotion);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      model.dispose();
      target.dispose();
      renderer.dispose();
      canvas.remove();
      host.classList.remove("is-ready");
    },
  };
}
