import { useEffect, useRef, useState } from 'react';
import {FocusStats} from "./types.ts"

/**
 *
 * @param intervalMs{number}
 * @returns {FocusStats}
 */
export function useFocus(intervalMs = 200) {
    const [stats, setStats] = useState({
        focusChecks: 0,
        focusCount: 0,
        focusProp: 0,
    });

    const focusChecksRef = useRef(0);
    const focusCountRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            focusChecksRef.current++;
            if (document.hasFocus()) {
                focusCountRef.current++;
            }

            const prop =
                Math.round(
                    (focusCountRef.current / focusChecksRef.current) * 1000
                ) / 1000;

            setStats({
                focusChecks: focusChecksRef.current,
                focusCount: focusCountRef.current,
                focusProp: prop,
            });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    return stats;
}
