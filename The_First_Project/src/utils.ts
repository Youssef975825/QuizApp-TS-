// Fisher-Yates (Knuth) shuffle — unlike `array.sort(() => Math.random() - 0.5)`,
// this produces a mathematically unbiased random ordering (the sort-based
// version skews certain permutations to be more likely than others).
export const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};