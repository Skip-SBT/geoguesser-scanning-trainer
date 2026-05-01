declare module 'react-simple-maps' {
    import {ComponentType, CSSProperties, MouseEventHandler, ReactNode, WheelEventHandler} from 'react';

    export interface ComposableMapProps {
        projection?: string;
        projectionConfig?: Record<string, unknown>;
        style?: CSSProperties;
        children?: ReactNode;
        onWheel?: WheelEventHandler<SVGSVGElement>;
        onMouseDown?: MouseEventHandler<SVGSVGElement>;
        onMouseMove?: MouseEventHandler<SVGSVGElement>;
        onMouseUp?: MouseEventHandler<SVGSVGElement>;
        onMouseLeave?: MouseEventHandler<SVGSVGElement>;
    }
    export const ComposableMap: ComponentType<ComposableMapProps>;

    export interface GeographiesProps {
        geography: string | object;
        children: (_props: {geographies: GeographyFeature[]}) => ReactNode;
    }
    export const Geographies: ComponentType<GeographiesProps>;

    export interface GeographyFeature {
        rsmKey: string;
        [key: string]: unknown;
    }

    export interface GeographyProps {
        geography: GeographyFeature;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        style?: {
            default?: CSSProperties;
            hover?: CSSProperties;
            pressed?: CSSProperties;
        };
    }
    export const Geography: ComponentType<GeographyProps>;

    export interface MarkerProps {
        coordinates: [number, number];
        children?: ReactNode;
    }
    export const Marker: ComponentType<MarkerProps>;

    export interface LineProps {
        from: [number, number];
        to: [number, number];
        stroke?: string;
        strokeWidth?: number;
        strokeLinecap?: string;
        fill?: string;
        className?: string;
    }
    export const Line: ComponentType<LineProps>;

    export interface ZoomableGroupProps {
        zoom?: number;
        center?: [number, number];
        minZoom?: number;
        maxZoom?: number;
        onMoveEnd?: (position: {coordinates: [number, number]; zoom: number}) => void;
        children?: ReactNode;
    }
    export const ZoomableGroup: ComponentType<ZoomableGroupProps>;

    export interface MapContextValue {
        width: number;
        height: number;
        projection: (coords: [number, number]) => [number, number] | null;
        path: unknown;
    }
    export function useMapContext(): MapContextValue;
}
