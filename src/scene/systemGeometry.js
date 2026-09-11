import { createOrbCore } from "./coreGeometry.js";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { systemModules } from "../data/system.js";

function plate(width, depth, height, radius = 0.055, detail = 3) {
  const x = -width / 2,
    y = -depth / 2,
    r = Math.min(radius, width / 3, depth / 3);
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + depth - r);
  shape.quadraticCurveTo(x + width, y + depth, x + width - r, y + depth);
  shape.lineTo(x + r, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    bevelSegments: 2,
    curveSegments: detail,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2, 0);
  return geometry;
}

// Shallow relief shapes share the same horizontal plane as the existing bases.
function relief(points, thickness = 0.018) {
  const shape = new THREE.Shape();
  points.forEach(([x, z], index) =>
    index ? shape.lineTo(x, -z) : shape.moveTo(x, -z),
  );
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function hexRing(radius, inner, thickness) {
  const shape = new THREE.Shape();
  const hole = new THREE.Path();
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * Math.PI * 2;
    const h = -t;
    if (i === 0) {
      shape.moveTo(Math.cos(t) * radius, Math.sin(t) * radius);
      hole.moveTo(Math.cos(h) * inner, Math.sin(h) * inner);
    } else {
      shape.lineTo(Math.cos(t) * radius, Math.sin(t) * radius);
      hole.lineTo(Math.cos(h) * inner, Math.sin(h) * inner);
    }
  }
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 2,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Batch each articulated part by material to keep rendering economical.
function assembly() {
  const buckets = { silver: [], graphite: [], dark: [] };
  return {
    add(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
      const matrix = new THREE.Matrix4().compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
        new THREE.Vector3(1, 1, 1),
      );
      const source = geometry.index ? geometry.toNonIndexed() : geometry;
      source.applyMatrix4(matrix);
      source.deleteAttribute("uv");
      buckets[material].push(source);
      if (source !== geometry) geometry.dispose();
    },
    finish(materials) {
      const group = new THREE.Group();
      for (const [key, geometries] of Object.entries(buckets)) {
        if (!geometries.length) continue;
        const merged = mergeGeometries(geometries, false);
        group.add(new THREE.Mesh(merged, materials[key]));
        geometries.forEach((g) => g.dispose());
      }
      return group;
    },
  };
}

export function createSystemGeometry(compact = false) {
  const silver = new THREE.MeshStandardMaterial({
    color: 0xbdbdb6,
    metalness: 1,
    roughness: 0.23,
    envMapIntensity: 1.8,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x343630,
    metalness: 0.45,
    roughness: 0.48,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x141612,
    metalness: 0.25,
    roughness: 0.6,
  });
  const materials = { silver, graphite, dark };
  const root = new THREE.Group();
  const { core, shell, shellSectors, nucleus, containment } = createOrbCore(
    materials,
    compact,
  );
  // Six ports terminate the existing paired rails at the core's manifold.
  const manifoldParts = assembly();
  manifoldParts.add(
    new THREE.TorusGeometry(0.69, 0.043, 6, compact ? 36 : 48),
    "graphite",
    [0, -0.18, 0],
    [Math.PI / 2, 0, 0],
  );
  const ports = new THREE.InstancedMesh(
    plate(0.1, 0.095, 0.026, 0.015, 2),
    silver,
    systemModules.length,
  );
  ports.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  // Tiny routing contacts share one draw call, with individual silver values.
  const portPose = new THREE.Object3D();
  const portColor = new THREE.Color();
  systemModules.forEach((data, index) => {
    const angle = data.angle;
    manifoldParts.add(
      plate(0.23, 0.15, 0.065, 0.02),
      "silver",
      [Math.cos(angle) * 0.66, -0.16, Math.sin(angle) * 0.66],
      [0, -angle, 0],
    );
    portPose.position.set(
      Math.cos(angle) * 0.74,
      -0.109,
      Math.sin(angle) * 0.74,
    );
    portPose.rotation.y = -angle;
    portPose.updateMatrix();
    ports.setMatrixAt(index, portPose.matrix);
    ports.setColorAt(index, portColor.setScalar(0.28));
  });
  // The contacts move only within a tightly bounded central area.
  ports.frustumCulled = false;
  core.add(ports);
  core.add(manifoldParts.finish(materials));
  root.add(core);
  const chassis = assembly();
  chassis.add(
    hexRing(2.32, 2.235, 0.034),
    "silver",
    [0, -0.285, 0],
    [0, -0.4, 0],
  );
  chassis.add(
    hexRing(2.29, 2.245, 0.036),
    "graphite",
    [0, -0.33, 0],
    [0, -0.4, 0],
  );
  root.add(chassis.finish(materials));

  const modules = systemModules.map((data, index) => {
    const parts = assembly();
    parts.add(plate(0.94, 0.78, 0.065), "silver", [0, -0.16, 0]);
    parts.add(plate(0.82, 0.66, 0.065), "graphite", [0, -0.085, 0]);
    if (data.id === "featured") {
      // A shallow tilted application screen with a sidebar and three issue rows.
      const screen = (geometry, material, position = [0, 0, 0]) => {
        geometry.translate(...position);
        parts.add(geometry, material, [0, 0.18, 0], [0.32, 0, 0]);
      };
      parts.add(plate(0.28, 0.25, 0.12), "dark", [0, 0.04, 0]);
      screen(plate(0.7, 0.5, 0.025), "graphite", [0.015, -0.045, 0.015]);
      screen(plate(0.72, 0.52, 0.035), "silver");
      screen(plate(0.64, 0.44, 0.015, 0.025), "graphite", [0, 0.032, 0]);
      screen(
        new THREE.BoxGeometry(0.56, 0.014, 0.025),
        "silver",
        [0, 0.051, -0.17],
      );
      screen(
        new THREE.BoxGeometry(0.085, 0.014, 0.3),
        "silver",
        [-0.245, 0.051, 0.02],
      );
      for (let row = 0; row < 3; row++) {
        const z = -0.085 + row * 0.1;
        screen(
          new THREE.BoxGeometry(0.29 - row * 0.035, 0.014, 0.035),
          "silver",
          [0.015, 0.051, z],
        );
        screen(new THREE.CylinderGeometry(0.023, 0.023, 0.014, 8), "silver", [
          0.245,
          0.051,
          z,
        ]);
      }
    } else if (data.id === "backend") {
      parts.add(plate(0.62, 0.45, 0.17), "dark", [0, 0.04, 0]);
      for (let i = 0; i < 7; i++)
        parts.add(plate(0.045, 0.57, 0.28, 0.015), "silver", [
          (i - 3) * 0.096,
          0.12,
          0,
        ]);
    } else if (data.id === "databases") {
      for (let i = 0; i < 3; i++) {
        parts.add(
          new THREE.CylinderGeometry(0.3, 0.3, 0.09, compact ? 24 : 40),
          "silver",
          [0, 0.02 + i * 0.13, 0],
        );
        parts.add(
          new THREE.CylinderGeometry(0.27, 0.27, 0.035, compact ? 24 : 40),
          "graphite",
          [0, 0.08 + i * 0.13, 0],
        );
      }
      parts.add(
        new THREE.CylinderGeometry(0.105, 0.105, 0.012, 20),
        "dark",
        [0, 0.368, 0],
      );
    } else if (data.id === "skills") {
      // Three neatly aligned precision tools: open spanner, driver and hex key.
      parts.add(
        plate(0.075, 0.36, 0.065, 0.02),
        "silver",
        [-0.24, 0.045, 0.075],
      );
      parts.add(
        relief(
          [
            [-0.115, -0.18],
            [-0.115, -0.29],
            [-0.06, -0.33],
            [-0.06, -0.205],
            [0.06, -0.205],
            [0.06, -0.33],
            [0.115, -0.29],
            [0.115, -0.18],
            [0.035, -0.11],
            [-0.035, -0.11],
          ],
          0.065,
        ),
        "silver",
        [-0.24, 0.015, 0],
      );
      parts.add(plate(0.135, 0.25, 0.09, 0.025), "graphite", [0, 0.055, 0.17]);
      // A silver collar and two restrained grip bands distinguish the driver.
      parts.add(
        new THREE.BoxGeometry(0.145, 0.045, 0.04),
        "silver",
        [0, 0.055, 0.04],
      );
      for (const z of [0.13, 0.21])
        parts.add(new THREE.BoxGeometry(0.12, 0.012, 0.018), "silver", [
          0,
          0.11,
          z,
        ]);
      parts.add(
        new THREE.BoxGeometry(0.045, 0.045, 0.31),
        "silver",
        [0, 0.055, -0.095],
      );
      parts.add(
        new THREE.BoxGeometry(0.07, 0.026, 0.07),
        "silver",
        [0, 0.055, -0.28],
      );
      parts.add(
        relief(
          [
            [0.17, -0.28],
            [0.245, -0.28],
            [0.245, 0.18],
            [0.36, 0.18],
            [0.36, 0.255],
            [0.17, 0.255],
          ],
          0.065,
        ),
        "silver",
        [0, 0.03, 0],
      );
    } else if (data.id === "about") {
      // Layered architectural prism with a recessed, geometric profile relief.
      const identity = (geometry, material, position) => {
        geometry.translate(...position);
        parts.add(geometry, material, [0, 0.17, 0], [-0.5, 0, 0]);
      };
      identity(plate(0.56, 0.55, 0.18, 0.025), "silver", [0, 0, 0]);
      identity(plate(0.48, 0.47, 0.022, 0.018), "graphite", [0, 0.106, 0]);
      identity(
        relief(
          [
            [-0.16, 0.19],
            [-0.14, 0.13],
            [-0.07, 0.085],
            [-0.07, 0.015],
            [-0.12, -0.045],
            [-0.13, -0.12],
            [-0.09, -0.18],
            [0.015, -0.2],
            [0.085, -0.155],
            [0.09, -0.095],
            [0.145, -0.035],
            [0.095, -0.02],
            [0.09, 0.055],
            [0.04, 0.075],
            [0.04, 0.115],
            [0.145, 0.16],
            [0.16, 0.19],
          ],
          0.018,
        ).rotateY(Math.PI),
        "silver",
        [0, 0.127, 0],
      );
    } else if (data.id === "contact") {
      // Slim envelope with an inset face and a raised folded triangular flap.
      parts.add(plate(0.69, 0.46, 0.07, 0.025), "graphite", [0, 0.065, 0]);
      parts.add(plate(0.65, 0.42, 0.018, 0.02), "silver", [0, 0.113, 0]);
      parts.add(
        relief(
          [
            [-0.31, -0.19],
            [0.31, -0.19],
            [0, 0.105],
          ],
          0.009,
        ),
        "graphite",
        [0, 0.14, 0],
      );
      parts.add(
        relief(
          [
            [-0.28, -0.19],
            [0.28, -0.19],
            [0, 0.078],
          ],
          0.01,
        ),
        "silver",
        [0, 0.15, 0],
      );
    }
    const ownMaterials = {
      silver: silver.clone(),
      graphite: graphite.clone(),
      dark,
    };
    const group = parts.finish(ownMaterials);
    group.userData.moduleId = data.id;
    group.position.set(
      Math.cos(data.angle) * data.radius,
      data.elevation,
      Math.sin(data.angle) * data.radius,
    );
    group.rotation.y = -data.angle + 0.35;
    root.add(group);
    return {
      group,
      data,
      index,
      materials: ownMaterials,
      base: group.position.clone(),
      progress: 0,
      velocity: 0,
    };
  });
  const paths = modules.map(({ base, data }) => {
    const points = [
      new THREE.Vector3(
        Math.cos(data.angle) * 0.62,
        -0.18,
        Math.sin(data.angle) * 0.62,
      ),
      new THREE.Vector3(
        Math.cos(data.angle) * 1.18,
        -0.26,
        Math.sin(data.angle) * 1.18,
      ),
      new THREE.Vector3(base.x * 0.84, base.y - 0.19, base.z * 0.84),
    ];
    const path = new THREE.CatmullRomCurve3(points);
    const group = new THREE.Group();
    group.userData.curve = path;
    const railMaterial = silver.clone();
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.TubeGeometry(path, 20, 0.017, 6, false),
        railMaterial,
      );
      rail.position.set(
        Math.sin(data.angle) * side * 0.052,
        0,
        -Math.cos(data.angle) * side * 0.052,
      );
      group.add(rail);
    }
    root.add(group);
    return group;
  });
  const signal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0286, 0.0286, 0.216, 8),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false,
      transparent: true,
      depthWrite: false,
    }),
  );
  signal.visible = false;
  root.add(signal);
  return {
    root,
    core,
    shell,
    shellSectors,
    nucleus,
    containment,
    signal,
    ports,
    portPose,
    portColor,
    modules,
    paths,
    materials,
    dispose() {
      const geometries = new Set(),
        allMaterials = new Set();
      root.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) allMaterials.add(object.material);
      });
      ports.dispose();
      geometries.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
    },
  };
}

export function springStep(position, velocity, target, delta, result = [0, 0]) {
  const dt = Math.min(delta, 1 / 30);
  const acceleration = (target - position) * 110 - velocity * 21;
  const nextVelocity = velocity + acceleration * dt;
  result[0] = position + nextVelocity * dt;
  result[1] = nextVelocity;
  return result;
}

// Blend interaction with a quiet core-only cycle. The controller advances this
// clock only while visible and motion is enabled.
export function updateCorePose(model, idleTime = 0) {
  let x = 0,
    z = 0,
    attention = 0,
    transition = 0;
  model.modules.forEach((module, index) => {
    const amount = module.progress;
    x += Math.cos(module.data.angle) * amount;
    z += Math.sin(module.data.angle) * amount;
    attention += amount;
    transition += amount * (1 - amount);
    const radius = 0.74 + amount * 0.1;
    model.portPose.position.set(
      Math.cos(module.data.angle) * radius,
      -0.109 + amount * 0.028,
      Math.sin(module.data.angle) * radius,
    );
    model.portPose.rotation.y = -module.data.angle;
    model.portPose.updateMatrix();
    model.ports.setMatrixAt(index, model.portPose.matrix);
    model.ports.setColorAt(
      index,
      model.portColor.setScalar(0.28 + amount * 0.5),
    );
  });
  model.ports.instanceMatrix.needsUpdate = true;
  model.ports.instanceColor.needsUpdate = true;
  const normalizer = Math.max(attention, 1);
  x /= normalizer;
  z /= normalizer;
  model.shellSectors.forEach(({ mesh, data }) => {
    const module = model.modules.find((module) => module.data.id === data.id);
    const expansion = module.progress * 0.085;
    mesh.position.set(
      Math.cos(data.angle) * expansion,
      expansion * 0.3,
      Math.sin(data.angle) * expansion,
    );
    mesh.material.color.setScalar(0.095 + module.progress * 0.038);
  });
  // Cosine easing has zero velocity at both ends of the 4.4-second breath.
  // A restrained 7.2% idle expansion blends with the existing interaction response.
  const breath = (1 - Math.cos((idleTime * Math.PI * 2) / 4.4)) * 0.5;
  model.nucleus.scale.setScalar(
    1 + breath * 0.072 + Math.min(transition, 0.5) * 0.07,
  );
  model.nucleus.material.emissiveIntensity =
    0.58 + breath * 0.042 + transition * 0.38;
  model.containment.rotation.x = z * 0.12;
  model.containment.rotation.z = -x * 0.12;
  // A slow ambient turn: one revolution in about 244 seconds.
  model.shell.rotation.y = x * 0.035 + (idleTime * Math.PI * 2 * 1.8) / 440;
}
