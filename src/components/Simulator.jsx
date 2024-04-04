import useStore from "../Store";
import { MeshLookupTable } from '../Misty-Robot/MeshLookup.js';
import {Scene} from 'robot-scene';

import React from 'react';

export default function Simulator(props) {
    const otherArgs = {
        displayTfs: false,
        displayGrid: true,
        isPolar: false,
        backgroundColor: "#3a3a3a",
        planeColor: "#3a3a3a",
        highlightColor: "#ffffff",
        plane: 0,
        fov: 60,
        ar: false,
        vr: false,
    }

    return (
        <Scene store={useStore} meshLookup={MeshLookupTable} {...otherArgs}/>
    )

}