import * as THREE from "three";

export const globalState = {
    scrollProgress: 0,
    focusTarget: null as THREE.Vector3 | null,
    isRedacted: true, // Default to true for safety
};
