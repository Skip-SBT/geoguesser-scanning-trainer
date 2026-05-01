import {CITIES, City} from 'data/cities';
import {COUNTRIES, Country} from 'data/countries';
import {useStopwatch} from 'hooks/useStopwatch';
import {useCallback, useEffect, useRef, useState} from 'react';
import {playCorrect, playCountryChange, playGameOver, playTick, playWrong} from 'utils/sounds';

const INITIAL_TIME_MS = 8000;
const MIN_TIME_MS = 2000;
const TIME_REDUCTION_MS = 150;
const GUESSES_PER_COUNTRY = 3;
const TARGET_MAX_2_TIME_MS = 6000;
const TARGET_MAX_3_TIME_MS = 4000;
const TICK_RATIO_THRESHOLD = 0.5;
const TICK_MIN_REMAINING_MS = 3000;
const TICK_CRITICAL_MS = 1500;
const TICK_STEP_NORMAL_MS = 500;
const TICK_STEP_CRITICAL_MS = 250;

function computeTimeLimit(correct: number): number {
    return Math.max(MIN_TIME_MS, INITIAL_TIME_MS - correct * TIME_REDUCTION_MS);
}

function computeTargetMax(timeLimitMs: number): 1 | 2 | 3 {
    if (timeLimitMs >= TARGET_MAX_2_TIME_MS) return 1;
    if (timeLimitMs >= TARGET_MAX_3_TIME_MS) return 2;
    return 3;
}

function pickCountry(excludeId?: string): Country {
    const pool = excludeId ? COUNTRIES.filter((c) => c.id !== excludeId) : COUNTRIES;
    return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildQueue(countryId: string, targetMax: 1 | 2 | 3, lastId?: string): City[] {
    const q = shuffle(CITIES.filter((c) => c.countryId === countryId && c.importance <= targetMax));
    if (lastId && q.length > 1 && q[0]?.id === lastId) {
        // Avoid repeating the previously used city as the next target when possible.
        const firstCity = q[0];
        q[0] = q[1];
        q[1] = firstCity;
    }
    return q;
}

export function useTimedGame() {
    const {elapsedMs, reset: resetStopwatch} = useStopwatch();

    const initialCountry = pickCountry();
    const initialTimeLimit = INITIAL_TIME_MS;
    const queueRef = useRef<City[]>(buildQueue(initialCountry.id, computeTargetMax(initialTimeLimit)));
    const indexRef = useRef(0);
    const guessesRef = useRef(0);
    const scoreRef = useRef(0);
    const gameOverRef = useRef(false);
    const lastTickIntervalRef = useRef(-1);

    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
    const [currentCountry, setCurrentCountry] = useState<Country>(initialCountry);
    const [targetCity, setTargetCity] = useState<City>(queueRef.current[0]);
    const [guessesInCountry, setGuessesInCountry] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        if (!gameOverRef.current && isCorrect === null && elapsedMs >= timeLimit) {
            gameOverRef.current = true;
            setGameOver(true);
            playGameOver();
        }
    }, [elapsedMs, timeLimit, isCorrect]);

    useEffect(() => {
        if (gameOverRef.current || isCorrect !== null) return;
        const remaining = timeLimit - elapsedMs;
        const threshold = Math.max(TICK_MIN_REMAINING_MS, timeLimit * TICK_RATIO_THRESHOLD);
        if (remaining > threshold) {
            lastTickIntervalRef.current = -1;
            return;
        }
        // tick every TICK_STEP_NORMAL_MS when low, every TICK_STEP_CRITICAL_MS when critical
        const step = remaining < TICK_CRITICAL_MS ? TICK_STEP_CRITICAL_MS : TICK_STEP_NORMAL_MS;
        const interval = Math.ceil(remaining / step);
        if (interval !== lastTickIntervalRef.current) {
            lastTickIntervalRef.current = interval;
            playTick();
        }
    }, [elapsedMs, timeLimit, isCorrect]);

    const advance = useCallback(
        (country: Country) => {
            const newGuesses = guessesRef.current;
            const newTimeLimit = computeTimeLimit(scoreRef.current);
            if (newGuesses >= GUESSES_PER_COUNTRY) {
                const next = pickCountry(country.id);
                queueRef.current = buildQueue(next.id, computeTargetMax(newTimeLimit));
                indexRef.current = 0;
                guessesRef.current = 0;
                setCurrentCountry(next);
                setGuessesInCountry(0);
                playCountryChange();
            } else {
                indexRef.current += 1;
                if (indexRef.current >= queueRef.current.length) {
                    const lastId = queueRef.current[queueRef.current.length - 1]?.id;
                    queueRef.current = buildQueue(country.id, computeTargetMax(newTimeLimit), lastId);
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
            if (gameOverRef.current || isCorrect !== null) return;

            if (cityId === targetCity.id) {
                playCorrect();
                const newScore = scoreRef.current + 1;
                scoreRef.current = newScore;
                guessesRef.current += 1;
                setScore(newScore);
                setTimeLimit(computeTimeLimit(newScore));
                setGuessesInCountry(guessesRef.current);
                setIsCorrect(true);
                const snapshotCountry = currentCountry;
                setTimeout(() => {
                    setIsCorrect(null);
                    advance(snapshotCountry);
                }, 400);
            } else {
                playWrong();
                setIsCorrect(false);
                setTimeout(() => setIsCorrect(null), 400);
            }
        },
        [isCorrect, targetCity, currentCountry, advance],
    );

    const restart = useCallback(() => {
        const country = pickCountry();
        const tl = INITIAL_TIME_MS;
        const queue = buildQueue(country.id, computeTargetMax(tl));

        scoreRef.current = 0;
        guessesRef.current = 0;
        gameOverRef.current = false;
        lastTickIntervalRef.current = -1;
        queueRef.current = queue;
        indexRef.current = 0;

        setScore(0);
        setTimeLimit(tl);
        setGameOver(false);
        setCurrentCountry(country);
        setTargetCity(queue[0]);
        setGuessesInCountry(0);
        setIsCorrect(null);
        resetStopwatch();
    }, [resetStopwatch]);

    return {gameOver, score, timeLimit, elapsedMs, currentCountry, targetCity, guessesInCountry, isCorrect, handleCityClick, restart};
}
