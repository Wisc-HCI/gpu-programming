/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import RIGHT_ARM_1 from './RIGHT_ARM_1.glb';
import { useGLTF } from '@react-three/drei';
export default function Model(props) {
  const { nodes } = useGLTF(RIGHT_ARM_1);
  return [{type:'raw', geometry:nodes.RIGHT_ARM_1.geometry, material: nodes.RIGHT_ARM_1.material}]
  
}
useGLTF.preload(RIGHT_ARM_1)