import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import RandomHelper from "../randomHelper.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator, { Tabulator } from "./voteTabulator.js";

/**
* A tabulator that implements the plurality voting system.
*/
class PluralityTabulator implements VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[] {
        
        // create map to store vote counts
        var voteCounts: Map<Candidate, number> = new Map(
            race.candidates.map(candidate => [candidate, 0])
        );

        // Count votes for each candidate
        for(const vote of votes.castVotes(race)) {
            for(const candidate of vote.candidates) {
                voteCounts.set(candidate, voteCounts.get(candidate)! + 1);
            }
        }

        // Sort candidates by vote count in descending order
        const sortedVoteCounts = Tabulator.sortVotesByCount(voteCounts);
        const electedCandidates: Candidate[] = [];

        // select candidates and break any ties randomly
        for(const [_, candidates] of sortedVoteCounts) {
            // we have enough elected candidates, so stop
            if(electedCandidates.length >= race.seats) {
                break;
            }
            // we have enough elected candidates to fill the remaining seats
            else if(candidates.length <= race.seats - electedCandidates.length) {
                electedCandidates.push(...candidates);
            } 
            // we have more candidates than remaining seats, need to break ties
            else {
                // shuffle candidates to randomize selection
                const shuffled = RandomHelper.shuffle(candidates);
                electedCandidates.push(...shuffled.slice(0, race.seats - electedCandidates.length));
            }
        } 

        // generate RaceReturns
        return [
            new RaceReturn(race.candidates.map(candidate =>
                new CandidateReturn(
                    candidate, 
                    voteCounts.get(candidate)!,
                    electedCandidates.includes(candidate)
                )
            ))
        ];
    }
}

export default PluralityTabulator;