import useStore from "../Store";
import { MeshLookupTable } from '../Misty-Robot/MeshLookup.js';
import {Scene} from 'robot-scene';

import React from 'react';

export default function Simulator(props) {
    const otherArgs = {
        displayTfs: false,
        displayGrid: true,
        isPolar: false,
        backgroundColor: "#d0d0d0",
        planeColor: "#a8a8a8",
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