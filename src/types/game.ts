import {City} from 'data/cities';

export interface GuessResult {
    city: City;
    timeMs: number;
    timestamp: number;
}

export interface GameSession {
    results: GuessResult[];
    streak: number;
    totalTimeMs: number;
    startedAt: number;
}
