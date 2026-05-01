import {useCallback, useEffect, useRef, useState} from 'react';

export function useStopwatch() {
    const [elapsedMs, setElapsedMs] = useState(0);
    const startTimeRef = useRef<number>(Date.now());
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        startTimeRef.current = Date.now();
        setElapsedMs(0);
    }, []);

    const reset = useCallback(() => {
        startTimeRef.current = Date.now();
        setElapsedMs(0);
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setElapsedMs(Date.now() - startTimeRef.current);
        }, 100);

        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        };
    }, []);

    return {elapsedMs, start, reset};
}
