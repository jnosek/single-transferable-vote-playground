import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import VoteGenerator from "../voteGenerator.js";

interface VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[];
}

class Tabulator {
    /**
     * Sorts candidates by their vote counts in descending order,
     * then groups them by vote count.
     */
    public static sortVotesByCount(candidates: Map<Candidate, number> | CandidateReturn[]): Map<number, Candidate[]> {
        let sortedVoteCounts: Map<number, Candidate[]> = new Map();

        let votes: [Candidate, number][] = [];
        if(candidates instanceof Map) {
            votes = Array.from(candidates.entries());
        } else if(candidates instanceof Array) {
            votes = candidates.map(candidateReturn => [candidateReturn.candidate, candidateReturn.votes]);
        }
        else {
            throw new Error("Invalid candidates type");
        }

        // Sort candidates by vote count in descending order
        // then group them by count
        votes
            .sort((a, b) => b[1] - a[1])
            .forEach(([candidate, count]) => {
                if (!sortedVoteCounts.has(count))
                    sortedVoteCounts.set(count, [candidate]);
                else
                    sortedVoteCounts.get(count)!.push(candidate);
            });

        return sortedVoteCounts;
    }

    /**
     * Select top candidates based on sorted vote counts
     * This will not select more candidates than the count, even if there are more candidates due to ties
     * @param count 
     * @param sortedVoteCounts 
     * @returns 
     */
    public static selectCandidatesStrict(count: number, sortedVoteCounts: Map<number, Candidate[]>) : Candidate[] {
        const electedCandidates: Candidate[] = [];

        for(const [_, candidates] of sortedVoteCounts) {
            if(
                // we have enough elected candidates,
                electedCandidates.length >= count ||
                // or if there are more candidates than seats, we have ties that need to be resolved
                // do not select them
                (count - electedCandidates.length < candidates.length)) {
                // then stop
                    break;
            } 

            // there are enough seats for all candidates with this count, select them all
            electedCandidates.push(...candidates);
        }

        return electedCandidates;
    }

    /**
     * Select top candidates based on sorted vote counts
     * @param count 
     * @param sortedVoteCounts 
     * @returns 
     */
    public static selectCandidates(count: number, sortedVoteCounts: Map<number, Candidate[]>) : Candidate[] {
        const electedCandidates: Candidate[] = [];

        for(const [_, candidates] of sortedVoteCounts) {
            if(
                // we have enough elected candidates,
                electedCandidates.length >= count) {
                // then stop
                    break;
            } 

            // select them all
            electedCandidates.push(...candidates);
        }

        return electedCandidates;
    }
}

export default VoteTabulator;
export { VoteTabulator, Tabulator };