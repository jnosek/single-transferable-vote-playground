import Candidate from "./candidate.js";

/**
 * Represents a vote in the election system.
 * 
 * @interface Vote
 */
interface Vote {

    /**
     * Gets the list of candidates the voter selected for a given race
     */
    get Candidates(): Candidate[];

    /**
     * Gets the candidate that is the current top preference for this vote.
     */
    get Candidate(): Candidate;
}

class BlockVote implements Vote {
    private candidates: Candidate[];

    constructor(candidates: Candidate[]) {
        this.candidates = candidates;
    }

    get Candidates(): Candidate[] {
        return this.candidates;
    }

    get Candidate(): Candidate {
        return this.candidates[0];
    }
}

export default Vote;
export { Vote, BlockVote };