/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import LEFT_ARM_1 from './LEFT_ARM_1.glb';
import { useGLTF } from '@react-three/drei';
export default function Model(props) {
  const { nodes } = useGLTF(LEFT_ARM_1);
  return [{type:'raw', geometry:nodes.LEFT_ARM_1.geometry, material: nodes.LEFT_ARM_1.material, scale: [1,1,1], rotation: [0,0,0]}]
  
}
useGLTF.preload(LEFT_ARM_1)