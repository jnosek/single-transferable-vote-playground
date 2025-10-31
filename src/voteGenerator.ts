import Candidate from "./candidate.js";
import { Race } from "./race.js";
import Vote, { BlockVote } from "./vote.js"; // Add this import if Vote is a default export

abstract class VoteGenerator {
    protected numberOfVoters: number;

    constructor(numberOfVoters: number) {
        this.numberOfVoters = numberOfVoters;
    }

    abstract castVotes(race: Race): Vote[];
}

/**
 * A simple implementation of VoteGenerator that generates random votes.
 * 
 * Every voter will randomly select a candidate for each available seat in the race. 
 */
class SimpleVoteGenerator extends VoteGenerator {

    castVotes(race: Race): Vote[] {
        const votes: Vote[] = [];
        for (let i = 0; i < this.numberOfVoters; i++) {
            const selectedCandidates: Candidate[] = [];

            // Create a shallow copy and shuffle it
            const shuffled = SimpleVoteGenerator.shuffle([...race.candidates]);
            votes.push(new BlockVote(shuffled.slice(0, race.seats)));
        }

        return votes;
    }

    // Fisher-Yates shuffle
    private static shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default VoteGenerator;
export { SimpleVoteGenerator };