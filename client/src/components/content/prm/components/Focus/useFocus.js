import { useEffect, useRef, useState } from 'react';
import {FocusStats} from "./types.ts"

/**
 *
 * @param intervalMs{number}
 * @returns {FocusStats}
 */
export function useFocus(intervalMs = 200) {
    const statsRef = useRef({
        focusChecks: 0,
        focusCount: 0,
        focusProp: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            statsRef.current.focusChecks++;
            if (document.hasFocus()) {
                statsRef.current.focusCount++;
            }

            statsRef.current.focusProp = Math.round(
                (statsRef.current.focusCount / statsRef.current.focusChecks) * 1000
            ) / 1000;
        }, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    return statsRef;
}
