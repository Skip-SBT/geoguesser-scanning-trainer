export interface Country {
    id: string;
    name: string;
    center: [number, number];
    scale: number;
}

export const COUNTRIES: Country[] = [
    {id: 'de', name: 'Germany', center: [10.5, 51.2], scale: 3000},
    {id: 'fr', name: 'France', center: [2.5, 46.5], scale: 2800},
    {id: 'us', name: 'United States', center: [-98, 39], scale: 750},
    {id: 'br', name: 'Brazil', center: [-53, -10], scale: 850},
    {id: 'ru', name: 'Russia', center: [58, 56], scale: 500},
    {id: 'in', name: 'India', center: [78, 22], scale: 1100},
    {id: 'cn', name: 'China', center: [105, 35], scale: 650},
    {id: 'au', name: 'Australia', center: [134, -25], scale: 850},
    {id: 'jp', name: 'Japan', center: [136, 37], scale: 2200},
    {id: 'it', name: 'Italy', center: [12.5, 42], scale: 2500},
    {id: 'es', name: 'Spain', center: [-4, 40], scale: 2300},
    {id: 'gb', name: 'United Kingdom', center: [-2, 54], scale: 3000},
    {id: 'tr', name: 'Turkey', center: [35, 39], scale: 1600},
];
