import {CITIES, City} from 'data/cities';
import {COUNTRIES, Country} from 'data/countries';
import {useStopwatch} from 'hooks/useStopwatch';
import {useCallback, useRef, useState} from 'react';
import {GameSession, GuessResult} from 'types/game';
import {playCorrect, playCountryChange, playWrong} from 'utils/sounds';

export type DifficultyLevel = 1 | 2 | 3;

const GUESSES_PER_COUNTRY = 3;
const LEVEL_2_MIN_CORRECT = 6;
const LEVEL_3_MIN_CORRECT = 15;

const DIFFICULTY: Record<DifficultyLevel, {visibleMax: 1 | 2 | 3; targetMax: 1 | 2 | 3}> = {
    1: {visibleMax: 2, targetMax: 1},
    2: {visibleMax: 3, targetMax: 2},
    3: {visibleMax: 3, targetMax: 3},
};

function computeLevel(totalCorrect: number): DifficultyLevel {
    if (totalCorrect < LEVEL_2_MIN_CORRECT) return 1;
    if (totalCorrect < LEVEL_3_MIN_CORRECT) return 2;
    return 3;
}

export function getDifficultyConfig(level: DifficultyLevel) {
    return DIFFICULTY[level];
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickCountry(excludeId?: string): Country {
    const pool = excludeId ? COUNTRIES.filter((c) => c.id !== excludeId) : COUNTRIES;
    return pool[Math.floor(Math.random() * pool.length)];
}

function buildQueue(countryId: string, targetMax: 1 | 2 | 3, lastCityId?: string): City[] {
    const q = shuffle(CITIES.filter((c) => c.countryId === countryId && c.importance <= targetMax));
    if (lastCityId && q.length > 1 && q[0]?.id === lastCityId) {
        [q[0], q[1]] = [q[1], q[0]];
    }
    return q;
}

const INITIAL_SESSION: GameSession = {
    results: [],
    streak: 0,
    totalTimeMs: 0,
    startedAt: Date.now(),
};

export function useGameEngine() {
    const {elapsedMs, reset: resetStopwatch} = useStopwatch();

    const initialCountry = pickCountry();
    const queueRef = useRef<City[]>(buildQueue(initialCountry.id, DIFFICULTY[1].targetMax));
    const indexRef = useRef(0);
    const guessesRef = useRef(0);
    const totalCorrectRef = useRef(0);

    const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(1);
    const [currentCountry, setCurrentCountry] = useState<Country>(initialCountry);
    const [targetCity, setTargetCity] = useState<City>(queueRef.current[0]);
    const [guessesInCountry, setGuessesInCountry] = useState(0);
    const [session, setSession] = useState<GameSession>(INITIAL_SESSION);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const advanceTarget = useCallback(
        (country: Country) => {
            const newGuesses = guessesRef.current;
            if (newGuesses >= GUESSES_PER_COUNTRY) {
                const next = pickCountry(country.id);
                const newLevel = computeLevel(totalCorrectRef.current);
                const {targetMax} = DIFFICULTY[newLevel];
                queueRef.current = buildQueue(next.id, targetMax);
                indexRef.current = 0;
                guessesRef.current = 0;
                setCurrentCountry(next);
                setGuessesInCountry(0);
                setDifficultyLevel(newLevel);
                playCountryChange();
            } else {
                indexRef.current += 1;
                if (indexRef.current >= queueRef.current.length) {
                    const lastId = queueRef.current[queueRef.current.length - 1]?.id;
                    const {targetMax} = DIFFICULTY[computeLevel(totalCorrectRef.current)];
                    queueRef.current = buildQueue(country.id, targetMax, lastId);
                    indexRef.current = 0;
                }
            }
            setTargetCity(queueRef.current[indexRef.current]);
            resetStopwatch();
        },
        [resetStopwatch],
    );

    const handleCityClick = useCallback(
        (cityId: string) => {
            if (isCorrect !== null) return;

            if (cityId === targetCity.id) {
                playCorrect();
                const result: GuessResult = {city: targetCity, timeMs: elapsedMs, timestamp: Date.now()};
                totalCorrectRef.current += 1;
                setSession((prev) => ({
                    ...prev,
                    results: [result, ...prev.results],
                    streak: prev.streak + 1,
                    totalTimeMs: prev.totalTimeMs + elapsedMs,
                }));
                guessesRef.current += 1;
                setGuessesInCountry(guessesRef.current);
                setIsCorrect(true);
                const snapshotCountry = currentCountry;
                setTimeout(() => {
                    setIsCorrect(null);
                    advanceTarget(snapshotCountry);
                }, 400);
            } else {
                playWrong();
                setIsCorrect(false);
                const snapshotCountry = currentCountry;
                setTimeout(() => {
                    setIsCorrect(null);
                    advanceTarget(snapshotCountry);
                }, 600);
            }
        },
        [isCorrect, targetCity, elapsedMs, currentCountry, advanceTarget],
    );

    return {session, targetCity, currentCountry, guessesInCountry, difficultyLevel, elapsedMs, handleCityClick, isCorrect};
}
