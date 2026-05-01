import {City} from 'data/cities';

const MAX_ROAD_NEIGHBORS = 3;

function geoDist(a: City, b: City): number {
    const latDiff = a.lat - b.lat;
    const lngDiff = a.lng - b.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

export function computeRoads(cities: City[], maxDist: number): Array<[[number, number], [number, number]]> {
    const edges: Array<[[number, number], [number, number]]> = [];
    const seen = new Set<string>();

    for (const city of cities) {
        const neighbors = cities
            .filter((c) => c.id !== city.id)
            .map((c) => ({city: c, d: geoDist(city, c)}))
            .filter(({d}) => d <= maxDist)
            .sort((a, b) => a.d - b.d)
            .slice(0, MAX_ROAD_NEIGHBORS);

        for (const {city: nb} of neighbors) {
            const key = [city.id, nb.id].sort().join('~');
            if (!seen.has(key)) {
                seen.add(key);
                edges.push([
                    [city.lng, city.lat],
                    [nb.lng, nb.lat],
                ]);
            }
        }
    }

    return edges;
}
