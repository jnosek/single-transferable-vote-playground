import Candidate from "./candidate.js";
import { Race } from "./race.js";
import Vote, { BlockVote } from "./vote.js"; // Add this import if Vote is a default export

abstract class VoteGenerator {
    readonly numberOfVoters: number;

    constructor(numberOfVoters: number) {
        this.numberOfVoters = numberOfVoters;
    }

    abstract castVotes(race: Race): Vote[];

    // Fisher-Yates shuffle
    protected static shuffle<T>(array: T[]): T[] {
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
    protected static weightedShuffle<T>(array: T[], weights: number[]): T[] {
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

/**
 * A implementation of VoteGenerator that generates random votes.
 * 
 * Every voter will randomly select a candidate for each available seat in the race. 
 * 
 * Uses Math.random() for equally distributed randomness.
 */
class RandomVoteGenerator extends VoteGenerator {

    castVotes(race: Race): Vote[] {
        const votes: Vote[] = [];
        for (let i = 0; i < this.numberOfVoters; i++) {

            // Create a shallow copy and shuffle it
            const shuffled = RandomVoteGenerator.shuffle([...race.candidates]);
            votes.push(new BlockVote(shuffled.slice(0, race.seats)));
        }

        return votes;
    }
}

/**
 * A implementation of VoteGenerator that generates weighted random votes.
 * 
 * Each candidate has a weight that influences their likelihood of being elected.
 * The winners are determined by these weights, and then vote counts are distributed accordingly.
 */
class WeightedRandomVoteGenerator extends VoteGenerator {
    private weights: number[];

    constructor(numberOfVoters: number, weights: number[]) {
        super(numberOfVoters);
        this.weights = weights;
    }

    castVotes(race: Race): Vote[] {
        const votes: Vote[] = [];
        
        // order candidates randomly based on weights
        // this gives the chance that the lower weights will win the election
        // for more varied results
        const orderedCandidates = WeightedRandomVoteGenerator.weightedShuffle(
            [...race.candidates], 
            // only take as many weights as there are candidates
            this.weights.slice(0, race.candidates.length));

        // create new vote weights to distribute votes to the predetermined winners
        const voteWeights: number[] = [];
        for (let i = 0; i < orderedCandidates.length; i++) {
            if (i < race.seats)
                voteWeights.push(1);
            else
                voteWeights.push(Math.random() * 0.8);
        }

        // generate votes using the new vote weights
        for (let i = 0; i < this.numberOfVoters; i++) {
            // Create a shallow copy and shuffle it
            const shuffled = WeightedRandomVoteGenerator.weightedShuffle([...orderedCandidates], voteWeights);
            votes.push(new BlockVote(shuffled.slice(0, race.seats)));
        }

        return votes;
    }
}

export default VoteGenerator;
export { RandomVoteGenerator, WeightedRandomVoteGenerator };