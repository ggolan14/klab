import {createContext, useContext, useState, useEffect} from "react";

/**
 * Creates a weighted random choice from options based on percentage distribution.
 * @param {any[]} options - The list of possible values.
 * @param {number[]} percentages - The list of percentages for each option.
 * @returns {any} - A chosen value.
 */
function chooseWeighted(options, percentages) {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < options.length; i++) {
        cumulative += percentages[i];
        if (rand <= cumulative) return options[i];
    }
    return options[options.length - 1]; // fallback
}

const ConditionsContext = createContext(null);

export const ConditionsProvider = ({conditions, children}) => {
    const [chosenValues, setChosenValues] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        let tempValues = {};
        let foundError = null;
        for (const [key, value] of Object.entries(conditions)) {

            if (!(typeof value === "object") || !("options" in value) || !("percentage" in value)) {
                continue;
            }
            const {percentage, options} = value;
            const total = percentage.reduce((a, b) => a + b, 0);

            if (total !== 100) {
                foundError = `Condition "${key}" percentages sum to ${total}, not 100.`;
                break;
            }

            tempValues[key] = chooseWeighted(options, percentage);
        }

        if (foundError) {
            setError(foundError);
            setChosenValues({});
        } else {
            setError(null);
            setChosenValues(tempValues);
        }
    }, [conditions]);

    return (
        <ConditionsContext.Provider value={{chosenValues, error}}>
            {children}
        </ConditionsContext.Provider>
    );
};

// Custom hook for using the context
export const useConditions = () => {
    const ctx = useContext(ConditionsContext);
    if (!ctx) throw new Error("useConditions must be used within a ConditionsProvider");
    return ctx;
};
