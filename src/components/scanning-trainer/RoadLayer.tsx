import React, {memo} from 'react';
import {useMapContext} from 'react-simple-maps';

interface Props {
    roads: Array<[[number, number], [number, number]]>;
    zoom: number;
}

const ROAD_CURVATURE = 0.07;
const ROAD_CASING_WIDTH = 2.2;
const ROAD_SURFACE_WIDTH = 1.0;

function RoadLayer({roads, zoom}: Props) {
    const {projection} = useMapContext();
    const sw = 1 / zoom;

    const paths: string[] = [];
    for (let i = 0; i < roads.length; i++) {
        const [from, to] = roads[i];
        const p1 = projection(from);
        const p2 = projection(to);
        if (!p1 || !p2) continue;

        const mx = (p1[0] + p2[0]) / 2;
        const my = (p1[1] + p2[1]) / 2;
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        // perpendicular unit vector
        const nx = -dy / len;
        const ny = dx / len;
        // curvature alternates deterministically per segment
        const sign = i % 2 === 0 ? 1 : -1;
        const cpx = mx + nx * len * ROAD_CURVATURE * sign;
        const cpy = my + ny * len * ROAD_CURVATURE * sign;

        paths.push(`M ${p1[0]} ${p1[1]} Q ${cpx} ${cpy} ${p2[0]} ${p2[1]}`);
    }

    return (
        <g>
            {/* casing pass — wider darker stroke drawn under all road surfaces */}
            {paths.map((d, i) => (
                <path key={`rc${i}`} d={d} stroke="#0d1822" strokeWidth={ROAD_CASING_WIDTH * sw} fill="none" strokeLinecap="round" />
            ))}
            {/* surface pass — narrower lighter stroke */}
            {paths.map((d, i) => (
                <path key={`rs${i}`} d={d} stroke="#1e3a56" strokeWidth={ROAD_SURFACE_WIDTH * sw} fill="none" strokeLinecap="round" />
            ))}
        </g>
    );
}

export default memo(RoadLayer);
