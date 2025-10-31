import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator from "./voteTabulator.js";

class MajorityTabulator implements VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[] {
        
        const electionResults = this.tabulateRound(race, votes);
        
        if(electionResults.elected.length < race.seats) {
            // do runoff election for remaining seats
            const remainingSeats = race.seats - electionResults.elected.length;
            const runOffCandidates = electionResults.eliminated.sort((a, b) => b.votes - a.votes)
                .slice(0, remainingSeats + 1)
                .map(c => c.candidate);

            const runOffResults = this.tabulateVotes(
                new Race(`${race.name} Runoff`, runOffCandidates, remainingSeats),
                votes
            );

            // TODO: check for a tie and resolve it appropriately (coin flip?)

            return [ electionResults, ...runOffResults ];
        }
        else 
        {
            return [ electionResults ];
        }
    }

    private tabulateRound(race: Race, votes: VoteGenerator, isRunOff: boolean = false) : RaceReturn {
        // create map to store vote counts
        var voteCounts: Map<Candidate, number> = new Map(
            race.candidates.map(candidate => [candidate, 0])
        );

        // determine majority quota
        const quota = Math.floor((votes.numberOfVoters / 2) + 1);

        // Count votes for each candidate
        for(const vote of votes.castVotes(race)) {
            for(const candidate of vote.candidates) {
                voteCounts.set(candidate, voteCounts.get(candidate)! + 1);
            }
        }

        // Sort candidates by vote count in descending order
        let sortedVoteCounts = Array.from(voteCounts.entries())
            .sort((a, b) => b[1] - a[1]);

        // if this is not a runoff, filter out candidates who did not meet the quota
        // NOTE: this tabulator only does 1 round of runoffs, if not enough candidates meet the quota
        // in the runoff, the top vote getters will be elected
        if(!isRunOff)
            sortedVoteCounts = sortedVoteCounts.filter(([_, count]) => count >= quota)

        // find candidates meeting the quota, and fill the seats
        const electedCandidates = sortedVoteCounts
            .map(([candidate, _]) => candidate)
            .slice(0, race.seats);

        // generate RaceReturn
        return new RaceReturn(Array
            .from(voteCounts.entries())
            .map(([candidate, votes]) =>
                new CandidateReturn(
                    candidate,
                    votes,
                    electedCandidates.includes(candidate)
                )
        ));
    }
}

export default MajorityTabulator;