import {City} from 'data/cities';
import React, {memo} from 'react';
import {Marker} from 'react-simple-maps';

interface Props {
    city: City;
    zoom: number;
    onClick: (cityId: string) => void;
}

const FONT_SIZE: Record<1 | 2 | 3, number> = {1: 13, 2: 10, 3: 8};
const DOT_RADIUS: Record<1 | 2 | 3, number> = {1: 3, 2: 1.8, 3: 0};
const CITY_FILL: Record<1 | 2 | 3, string> = {1: '#ddeeff', 2: '#b0c8e0', 3: '#7a99b8'};
const AVERAGE_CHAR_WIDTH_RATIO = 0.56;
const LABEL_OFFSET_MAJOR = -12;
const LABEL_OFFSET_MINOR = -8;

function CityLabel({city, zoom, onClick}: Readonly<Props>) {
    const imp = city.importance;
    // divide all SVG-unit sizes by zoom so they render at constant screen pixel size
    const fontSize = FONT_SIZE[imp] / zoom;
    const dotR = DOT_RADIUS[imp] / zoom;
    const [rawDx, rawDy] = city.labelOffset ?? [0, imp === 1 ? LABEL_OFFSET_MAJOR : LABEL_OFFSET_MINOR];
    const dx = rawDx / zoom;
    const dy = rawDy / zoom;
    const pad = 2 / zoom;
    const charWidth = fontSize * AVERAGE_CHAR_WIDTH_RATIO;

    const handleClick = (e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation();
        onClick(city.id);
    };

    return (
        <Marker coordinates={[city.lng, city.lat]}>
            <g onClick={handleClick} style={{cursor: 'pointer'}}>
                {dotR > 0 && <circle cx={0} cy={0} r={dotR} fill="#5a7a9a" pointerEvents="none" />}
                <rect
                    x={dx - pad}
                    y={dy - fontSize}
                    width={city.name.length * charWidth + 2 * pad}
                    height={fontSize + 2 * pad}
                    fill="transparent"
                    pointerEvents="all"
                />
                <text
                    x={dx}
                    y={dy}
                    fontSize={fontSize}
                    fontFamily="sans-serif"
                    fontWeight={imp === 1 ? 600 : 400}
                    fill={CITY_FILL[imp]}
                    pointerEvents="all"
                >
                    {city.name}
                </text>
            </g>
        </Marker>
    );
}

export default memo(CityLabel);
