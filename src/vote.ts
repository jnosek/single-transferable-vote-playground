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
    get candidates(): Candidate[];

    /**
     * Gets the candidate that is the current top preference for this vote.
     */
    get candidate(): Candidate;
}

class BlockVote implements Vote {
    private _candidates: Candidate[];

    constructor(candidates: Candidate[]) {
        this._candidates = candidates;
    }

    get candidates(): Candidate[] {
        return this._candidates;
    }

    get candidate(): Candidate {
        return this._candidates[0];
    }
}

export default Vote;
export { Vote, BlockVote };