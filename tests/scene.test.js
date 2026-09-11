import * as THREE from "three";
import {
  dragIntent,
  dragRotation,
  focusRotation,
  frameDelta,
  rotationLimits,
} from "../src/scene/systemInteraction.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createSystemGeometry,
  springStep,
  updateCorePose,
} from "../src/scene/systemGeometry.js";
import { createCorePanels } from "../src/scene/coreGeometry.js";
import { sections } from "../src/data/sections.js";
import { projects, skillGroups } from "../src/data/portfolio.js";
import { createPortfolioSystem } from "../src/scene/portfolioSystem.js";
import { initialSystemModule, systemModules } from "../src/data/system.js";

test("all six meaningful modules have unique geometry, picking IDs and destinations", () => {
  const model = createSystemGeometry();
  assert.equal(model.modules.length, 6);
  assert.equal(
    new Set(model.modules.map((m) => m.group.userData.moduleId)).size,
    6,
  );
  for (const module of model.modules) {
    assert.equal(module.data.id, module.group.userData.moduleId);
    assert.ok(module.group.children.length > 0);
    assert.ok(module.base.length() > 1.8);
    assert.ok(module.data.href.startsWith("#"));
  }
  assert.equal(
    systemModules.find((m) => m.id === "featured").href,
    "#issueflow",
  );
  model.dispose();
});

test("desktop and mobile assemblies stay within their geometry and draw-call budgets", () => {
  for (const compact of [false, true]) {
    const model = createSystemGeometry(compact);
    let triangles = 0,
      draws = 0;
    model.root.traverse((object) => {
      if (!object.isMesh) return;
      const vertices = object.geometry.getAttribute("position");
      assert.ok([...vertices.array].every(Number.isFinite));
      assert.ok(
        [...object.geometry.getAttribute("normal").array].every(
          Number.isFinite,
        ),
      );
      triangles +=
        ((object.geometry.index?.count ?? vertices.count) / 3) *
        (object.isInstancedMesh ? object.count : 1);
      draws++;
    });
    assert.ok(
      triangles < 22000,
      `${compact ? "Mobile" : "Desktop"} geometry: ${triangles} triangles`,
    );
    assert.ok(draws <= 44, `Draw-call budget exceeded: ${draws}`);
    model.dispose();
  }
});

test("hero numbers match their page destinations and follow the same order", () => {
  const destinations = new Map([
    ...Object.entries(sections).map(([id, section]) => [
      `#${id}`,
      section.number,
    ]),
    ...projects.map((project) => [`#${project.id}`, project.number]),
    ...skillGroups.map((group) => [`#${group.id}`, group.number]),
  ]);
  for (const module of systemModules)
    assert.equal(module.index, destinations.get(module.href));
  assert.equal(initialSystemModule, "about");
  assert.equal(systemModules[0].id, "about");
  assert.equal(systemModules[0].index, "01");
  assert.deepEqual(
    systemModules.map((module) => module.index),
    ["01", "02.1", "03", "03.1", "03.4", "04"],
  );
});

test("the smaller hex cage has genuine open windows", () => {
  const panels = createCorePanels();
  assert.equal(panels.filter((panel) => panel.sides === 6).length, 30);
  assert.equal(panels.filter((panel) => panel.sides === 5).length, 12);
  assert.equal(panels.length, 42);
  panels.forEach(({ geometry, normal }) => {
    assert.ok(Math.abs(normal.length() - 1) < 0.00001);
    assert.ok([...geometry.attributes.position.array].every(Number.isFinite));
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.updateMatrixWorld();
    const ray = new THREE.Raycaster(
      normal.clone().multiplyScalar(2),
      normal.clone().negate(),
    );
    assert.equal(
      ray.intersectObject(mesh).length,
      0,
      "Every hex/pentagon center is open",
    );
    material.dispose();
    geometry.dispose();
  });
});

test("each module opens the matching core sector and the energy pulse settles", () => {
  const model = createSystemGeometry();
  const poses = [];
  for (const selected of model.modules) {
    model.modules.forEach((module) => {
      module.progress = module === selected ? 1 : 0;
    });
    updateCorePose(model);
    assert.ok([...model.ports.instanceMatrix.array].every(Number.isFinite));
    const contact = model.ports.instanceMatrix.array;
    const offset = selected.index * 16;
    assert.ok(
      Math.abs(Math.hypot(contact[offset + 12], contact[offset + 14]) - 0.84) <
        0.00001,
    );
    const sector = model.shellSectors.find(
      (sector) => sector.data.id === selected.data.id,
    );
    assert.ok(sector.mesh.position.length() > 0.085);
    assert.equal(model.nucleus.scale.x, 1);
    assert.equal(model.nucleus.material.emissiveIntensity, 0.58);
    poses.push(model.containment.rotation.toArray().join(","));
    selected.progress = 0.5;
    updateCorePose(model);
    assert.ok(model.nucleus.scale.x > 1 && model.nucleus.scale.x < 1.04);
    assert.ok(model.nucleus.material.emissiveIntensity > 0.58);
  }
  assert.equal(new Set(poses).size, 6);
  model.dispose();
});

test("ambient core motion breathes gently without moving the surrounding system", () => {
  const model = createSystemGeometry();
  const positions = model.modules.map(({ group }) => group.position.toArray());
  updateCorePose(model, 0);
  const startRotation = model.shell.rotation.y;
  updateCorePose(model, 2.2);
  assert.equal(model.nucleus.scale.x, 1.072);
  assert.ok(Math.abs(model.nucleus.material.emissiveIntensity - 0.622) < 1e-8);
  const halfwayRotation = model.shell.rotation.y;
  updateCorePose(model, 4.4);
  assert.equal(model.nucleus.scale.x, 1);
  assert.equal(model.nucleus.material.emissiveIntensity, 0.58);
  assert.ok(
    Math.abs(model.shell.rotation.y - halfwayRotation * 2 + startRotation) <
      1e-8,
  );
  assert.ok(model.shell.rotation.y < 0.12, "Less than seven degrees per breath");
  model.modules[0].progress = 0.5;
  updateCorePose(model, 2.2);
  assert.ok(
    model.nucleus.scale.x < 1.1,
    "Interaction and breathing remain restrained together",
  );
  const pausedScale = model.nucleus.scale.x;
  const pausedRotation = model.shell.rotation.y;
  updateCorePose(model, 2.2);
  assert.equal(model.nucleus.scale.x, pausedScale);
  assert.equal(model.shell.rotation.y, pausedRotation);
  assert.deepEqual(
    model.modules.map(({ group }) => group.position.toArray()),
    positions,
  );
  model.dispose();
});

test("hover springs settle predictably at common frame rates and after a frame stall", () => {
  for (const fps of [30, 60, 120]) {
    let position = 0,
      velocity = 0;
    for (let i = 0; i < fps * 3; i++) {
      [position, velocity] = springStep(
        position,
        velocity,
        1,
        i === 2 ? 0.5 : 1 / fps,
      );
      assert.ok(Number.isFinite(position) && position >= 0 && position < 1.05);
    }
    assert.ok(Math.abs(position - 1) < 0.0001);
    for (let i = 0; i < fps * 3; i++)
      [position, velocity] = springStep(position, velocity, 0, 1 / fps);
    assert.ok(Math.abs(position) < 0.0001);
  }
});

for (const blocked of [false, true]) {
  test(`${blocked ? "Blocked" : "Unavailable"} WebGL preserves an interactive fallback`, () => {
    const previous = globalThis.document;
    globalThis.document = {
      createElement: () => ({
        getContext: () => {
          if (blocked) throw new Error("Blocked");
          return null;
        },
      }),
    };
    try {
      const controller = createPortfolioSystem({}, {});
      assert.doesNotThrow(() => {
        controller.setActive("backend");
        controller.syncMotion();
        controller.dispose();
      });
    } finally {
      globalThis.document = previous;
    }
  });
}

test("dragging has resistance, stable limits and preserves vertical touch scrolling", () => {
  assert.equal(dragIntent("touch", 3, 4), "pending");
  assert.equal(dragIntent("touch", 10, 70), "scroll");
  assert.equal(dragIntent("touch", 70, 10), "rotate");
  assert.equal(dragIntent("mouse", 0, 70), "rotate");
  const still = dragRotation({ yaw: 0.58, pitch: 0.1 }, 0, 0, 400, 300);
  assert.ok(Math.abs(still.yaw - 0.58) < 0.000001);
  for (const direction of [-1, 1]) {
    const pose = dragRotation(
      { yaw: 0, pitch: 0 },
      direction * 100000,
      direction * 100000,
      320,
      300,
    );
    assert.ok(Math.abs(pose.yaw) <= 0.59);
    assert.ok(Math.abs(pose.pitch) <= rotationLimits.pitch);
  }
  assert.equal(
    dragRotation({ yaw: 0, pitch: 0 }, 80, 5, 320, 300, true).pitch,
    0,
  );
  assert.ok(
    focusRotation(systemModules[0].angle) > 0,
    "About begins in its intended orientation",
  );
});

test("routing never samples outside its curve after same-frame clock skew", () => {
  const model = createSystemGeometry();
  for (const elapsed of [-8, 0, 8, 16, 1000]) {
    const delta = frameDelta(1000 + elapsed, 1000);
    assert.ok(delta > 0 && delta <= 1 / 30);
    for (const path of model.paths) {
      const point = path.userData.curve.getPoint(delta / 1.1);
      assert.ok(point.toArray().every(Number.isFinite));
    }
  }
  model.dispose();
});
