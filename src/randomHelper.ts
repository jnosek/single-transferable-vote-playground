class RandomHelper {
    /**
     * Shuffles an array using the Fisher-Yates shuffle algorithm.
     * @param array The array to shuffle.
     * @returns A new shuffled array.
     */
    public static shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Shuffles an array based on weights using a weighted random order.
     * @param array The array to shuffle.
     * @param weights The weights corresponding to each element.
     * @returns A new array shuffled according to weights.
     */
    public static weightedShuffle<T>(array: T[], weights: number[]): T[] {
        const result: T[] = [];
        const items = array.slice();
        const itemWeights = weights.slice();

        while (items.length > 0) {
            const totalWeight = itemWeights.reduce((a, b) => a + b, 0);
            let rand = Math.random() * totalWeight;
            let idx = 0;
            while (rand >= itemWeights[idx]) {
                rand -= itemWeights[idx];
                idx++;
            }
            result.push(items[idx]);
            items.splice(idx, 1);
            itemWeights.splice(idx, 1);
        }

        return result;
    }
}

export default RandomHelper;