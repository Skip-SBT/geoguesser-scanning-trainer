import CityLabel from 'components/scanning-trainer/CityLabel';
import RoadLayer from 'components/scanning-trainer/RoadLayer';
import {City} from 'data/cities';
import {Country} from 'data/countries';
import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ComposableMap, Geographies, Geography} from 'react-simple-maps';
import {computeRoads} from 'utils/roads';

interface Props {
    cities: City[];
    country: Country;
    onCityClick: (cityId: string) => void;
    maxImportance?: 1 | 2 | 3;
}

interface Transform {
    tx: number;
    ty: number;
    k: number;
}

const ZOOM_THRESHOLD_MEDIUM = 2;
const ZOOM_THRESHOLD_HIGH = 4;
const WHEEL_DELTA_SCALE = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 20;
const ROAD_DIST_BASE = 8000;

function zoomImportanceMax(k: number): 1 | 2 | 3 {
    if (k < ZOOM_THRESHOLD_MEDIUM) return 1;
    if (k < ZOOM_THRESHOLD_HIGH) return 2;
    return 3;
}

function MapView({cities, country, onCityClick, maxImportance}: Props) {
    const [tf, setTf] = useState<Transform>({tx: 0, ty: 0, k: 1});
    const [dragging, setDragging] = useState(false);
    const lastMouse = useRef<[number, number]>([0, 0]);

    useEffect(() => {
        setTf({tx: 0, ty: 0, k: 1});
    }, [country.id]);

    // Convert a CSS-pixel delta/position into SVG internal units.
    // ComposableMap always renders viewBox="0 0 800 600" scaled to fill the container,
    // so cursor positions from getBoundingClientRect are in a different coordinate space
    // than the <g transform> which lives in SVG internal units.
    const toSvgCoords = (el: SVGSVGElement, cx: number, cy: number): [number, number] => {
        const rect = el.getBoundingClientRect();
        const vb = el.viewBox.baseVal;
        return [(cx - rect.left) * (vb.width / rect.width), (cy - rect.top) * (vb.height / rect.height)];
    };

    const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault();
        const [cx, cy] = toSvgCoords(e.currentTarget, e.clientX, e.clientY);
        const factor = Math.pow(2, -e.deltaY / WHEEL_DELTA_SCALE);
        setTf((prev) => {
            const newK = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.k * factor));
            // snap back to the default country view when fully zoomed out
            if (newK === 1) return {tx: 0, ty: 0, k: 1};
            const s = newK / prev.k;
            return {tx: cx * (1 - s) + prev.tx * s, ty: cy * (1 - s) + prev.ty * s, k: newK};
        });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button !== 0) return;
        setDragging(true);
        lastMouse.current = [e.clientX, e.clientY];
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!(e.buttons & 1)) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const vb = e.currentTarget.viewBox.baseVal;
        const scaleX = vb.width / rect.width;
        const scaleY = vb.height / rect.height;
        const dx = (e.clientX - lastMouse.current[0]) * scaleX;
        const dy = (e.clientY - lastMouse.current[1]) * scaleY;
        lastMouse.current = [e.clientX, e.clientY];
        setTf((prev) => ({...prev, tx: prev.tx + dx, ty: prev.ty + dy}));
    }, []);

    const stopDrag = useCallback(() => setDragging(false), []);

    const impMax = maxImportance ?? zoomImportanceMax(tf.k);
    const visibleCities = useMemo(() => cities.filter((c) => c.importance <= impMax), [cities, impMax]);

    const roads = useMemo(() => computeRoads(visibleCities, ROAD_DIST_BASE / country.scale), [visibleCities, country.scale]);

    const sw = 1 / tf.k;

    return (
        <ComposableMap
            projection="geoMercator"
            style={{width: '100%', height: '100%', cursor: dragging ? 'grabbing' : 'grab'}}
            projectionConfig={{center: country.center, scale: country.scale}}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
        >
            <g transform={`translate(${tf.tx},${tf.ty}) scale(${tf.k})`}>
                <Geographies geography={`${import.meta.env.BASE_URL}world-50m.json`}>
                    {({geographies}) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1a2332"
                                stroke="#2d3a4a"
                                strokeWidth={0.5 * sw}
                                style={{
                                    default: {outline: 'none'},
                                    hover: {outline: 'none'},
                                    pressed: {outline: 'none'},
                                }}
                            />
                        ))
                    }
                </Geographies>
                <RoadLayer roads={roads} zoom={tf.k} />
                {visibleCities.map((city) => (
                    <CityLabel key={city.id} city={city} zoom={tf.k} onClick={onCityClick} />
                ))}
            </g>
        </ComposableMap>
    );
}

export default memo(MapView);
