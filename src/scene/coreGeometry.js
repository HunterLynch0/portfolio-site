import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { systemModules } from "../data/system.js";

// The dual of a subdivided icosahedron produces a closed, mostly hexagonal
// cage (with twelve pentagonal joints), with true holes rather than transparency.
export function createCorePanels() {
  const source = new THREE.IcosahedronGeometry(1, 1);
  const points = source.attributes.position;
  const vertices = new Map();
  for (let i = 0; i < points.count; i += 3) {
    const triangle = [0, 1, 2].map((j) =>
      new THREE.Vector3().fromBufferAttribute(points, i + j),
    );
    const center = triangle
      .reduce((sum, p) => sum.add(p), new THREE.Vector3())
      .normalize();
    triangle.forEach((point) => {
      const key = point
        .toArray()
        .map((value) => value.toFixed(5))
        .join(",");
      if (!vertices.has(key))
        vertices.set(key, { normal: point.clone().normalize(), centers: [] });
      vertices.get(key).centers.push(center);
    });
  }
  source.dispose();
  return [...vertices.values()].map(({ normal, centers }) => {
    const reference =
      Math.abs(normal.y) < 0.9
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);
    const tangent = reference.cross(normal).normalize();
    const bitangent = normal.clone().cross(tangent);
    centers.sort(
      (a, b) =>
        Math.atan2(a.dot(bitangent), a.dot(tangent)) -
        Math.atan2(b.dot(bitangent), b.dot(tangent)),
    );
    const center = normal.clone().multiplyScalar(0.8);
    const outer = centers.map((point) => {
      const projected = point.clone().multiplyScalar(0.8 / point.dot(normal));
      return projected.sub(center).multiplyScalar(0.91).add(center);
    });
    const hole = outer.map((point) =>
      point.clone().sub(center).multiplyScalar(0.9).add(center),
    );
    const back = outer.map((point) =>
      point.clone().addScaledVector(normal, -0.014),
    );
    const innerBack = hole.map((point) =>
      point.clone().addScaledVector(normal, -0.014),
    );
    const positions = [];
    const triangle = (...points) =>
      points.forEach((p) => positions.push(p.x, p.y, p.z));
    for (let i = 0; i < outer.length; i++) {
      const n = (i + 1) % outer.length;
      triangle(outer[i], outer[n], hole[n]);
      triangle(outer[i], hole[n], hole[i]);
      triangle(outer[i], back[i], back[n]);
      triangle(outer[i], back[n], outer[n]);
      triangle(hole[i], hole[n], innerBack[n]);
      triangle(hole[i], innerBack[n], innerBack[i]);
      triangle(back[i], innerBack[i], innerBack[n]);
      triangle(back[i], innerBack[n], back[n]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.computeVertexNormals();
    return { geometry, normal, sides: outer.length };
  });
}

export function createOrbCore(materials, compact) {
  const core = new THREE.Group();
  const shell = new THREE.Group();
  shell.position.y = 0.42;
  shell.scale.setScalar(0.82 * 0.875);
  core.add(shell);
  const sectors = systemModules.map((data) => ({ data, geometries: [] }));
  const panels = createCorePanels();
  panels.forEach(({ geometry, normal }) => {
    const angle = Math.atan2(normal.z, normal.x);
    const nearest = sectors.reduce((best, sector) =>
      Math.cos(angle - sector.data.angle) > Math.cos(angle - best.data.angle)
        ? sector
        : best,
    );
    nearest.geometries.push(geometry);
  });
  const shellSectors = sectors.map(({ data, geometries }) => {
    const material = materials.graphite.clone();
    material.metalness = 0.72;
    material.roughness = 0.34;
    const mesh = new THREE.Mesh(mergeGeometries(geometries, false), material);
    geometries.forEach((geometry) => geometry.dispose());
    shell.add(mesh);
    return { mesh, data };
  });
  const energy = new THREE.MeshStandardMaterial({
    color: 0xf1f3e9,
    emissive: 0xe0e6db,
    emissiveIntensity: 0.58,
    metalness: 0.18,
    roughness: 0.26,
  });
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.37, compact ? 24 : 32, compact ? 16 : 20),
    energy,
  );
  shell.add(nucleus);
  const containment = new THREE.Group();
  containment.position.y = shell.position.y;
  containment.scale.setScalar(0.875);
  const rings = [[Math.PI / 2 - 0.28, 0.18, 0.2]];
  const ringGeometries = rings.map((rotation) => {
    const geometry = new THREE.TorusGeometry(0.77, 0.011, 6, compact ? 48 : 64);
    geometry.applyMatrix4(
      new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)),
    );
    const nonIndexed = geometry.toNonIndexed();
    geometry.dispose();
    return nonIndexed;
  });
  containment.add(
    new THREE.Mesh(mergeGeometries(ringGeometries, false), materials.silver),
  );
  ringGeometries.forEach((geometry) => geometry.dispose());
  core.add(containment);
  return { core, shell, shellSectors, nucleus, containment };
}
