import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator from "./voteTabulator.js";

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
        const electedCandidates = Array.from(voteCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([candidate, _]) => candidate)
            .slice(0, race.seats);

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