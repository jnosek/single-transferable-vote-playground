import { Race } from "./race.js";
import RandomHelper from "./randomHelper.js";
import Vote, { BlockVote } from "./vote.js"; // Add this import if Vote is a default export

abstract class VoteGenerator {
    readonly numberOfVoters: number;

    constructor(numberOfVoters: number) {
        this.numberOfVoters = numberOfVoters;
    }

    abstract castVotes(race: Race): Vote[];
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
            const shuffled = RandomHelper.shuffle([...race.candidates]);
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
        const orderedCandidates = RandomHelper.weightedShuffle(
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
            const shuffled = RandomHelper.weightedShuffle([...orderedCandidates], voteWeights);
            votes.push(new BlockVote(shuffled.slice(0, race.seats)));
        }

        return votes;
    }
}

export default VoteGenerator;
export { RandomVoteGenerator, WeightedRandomVoteGenerator };