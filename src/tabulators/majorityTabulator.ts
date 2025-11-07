import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import RandomHelper from "../randomHelper.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator, { Tabulator } from "./voteTabulator.js";

class MajorityTabulator implements VoteTabulator {
    /**
     * Tabulate votes using the majority voting system, with 1 runoff if necessary
     * The majority quota is calculated as (number of voters / 2) + 1
     * 
     * @param race 
     * @param votes 
     * @returns 
     */
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[] {
        
        const electionResults = this.tabulateRound(race, votes);
        
        if(electionResults.elected.length === race.seats) {
            // all seats filled, return results
            return [ electionResults ];
        }

        // else, do runoff election for remaining seats
        const remainingSeats = race.seats - electionResults.elected.length;

        let sortedVoteCounts = Tabulator.sortVotesByCount(electionResults.eliminated);
        const runOffCandidates = Tabulator.selectCandidates(remainingSeats + 1, sortedVoteCounts);
        const runOffResults = this.tabulateRound(
            new Race(`${race.name} Runoff`, runOffCandidates, remainingSeats),
            votes
        );

        // if we still don't have enough elected candidates, take subsequent 
        // candidates from the runoff results, and flip a coin for ties
        if(runOffResults.elected.length < remainingSeats) {
            const electedCandidates = MajorityTabulator.selectRunOffCandidates(remainingSeats, runOffResults);

            // return new runoff results with updated elected candidates
            return [ electionResults, new RaceReturn(
                runOffResults.all.map(c => 
                    new CandidateReturn(
                        c.candidate,
                        c.votes,
                        electedCandidates.includes(c.candidate)
                    )
                )
            )];
        }

        return [ electionResults, runOffResults ];
    }

    /**
     * tabulate a single round of majority voting
     * 
     * @param race 
     * @param votes 
     * @param isRunOff 
     * @returns 
     */
    private tabulateRound(race: Race, votes: VoteGenerator) : RaceReturn {
        // create map to store vote counts
        var voteCounts: Map<Candidate, number> = new Map(
            race.candidates.map(candidate => [candidate, 0])
        );

        // determine majority quota based on number of voters
        const quota = Math.floor((votes.numberOfVoters / 2) + 1);

        // Count votes for each candidate
        for(const vote of votes.castVotes(race)) {
            for(const candidate of vote.candidates) {
                voteCounts.set(candidate, voteCounts.get(candidate)! + 1);
            }
        }

        // Sort candidates by vote count and 
        // filter to only those who met the quota
        const sortedVoteCounts = new Map(
            Array.from(Tabulator.sortVotesByCount(voteCounts))
            .filter(([count, _]) => count >= quota)
        );

        // find candidates meeting the quota, and fill the seats
        const electedCandidates: Candidate[] = Tabulator.selectCandidatesStrict(race.seats, sortedVoteCounts);

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
    
    

    private static selectRunOffCandidates(availableSeats: number, runOffResults: RaceReturn) : Candidate[] {
        const electedCandidates: Candidate[] = runOffResults.elected.map(c => c.candidate);
            
        const sortedVoteCounts = Tabulator.sortVotesByCount(runOffResults.eliminated);
            
        for(const [_, candidates] of sortedVoteCounts) {
            // we have enough elected candidates, so stop
            if(electedCandidates.length >= availableSeats) {
                break;
            }
            // we have enough elected candidates to fill the remaining seats
            else if(candidates.length <= availableSeats - electedCandidates.length) {
                electedCandidates.push(...candidates);
            } 
            // we have more candidates than remaining seats, need to break ties
            else {
                // shuffle candidates to randomize selection
                const shuffled = RandomHelper.shuffle(candidates);
                electedCandidates.push(...shuffled.slice(0, availableSeats - electedCandidates.length));
            }
        } 

        return electedCandidates;
    }
}

export default MajorityTabulator;