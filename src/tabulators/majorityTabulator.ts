import Candidate from "../candidate.js";
import { CandidateReturn, Race, RaceReturn } from "../race.js";
import RandomHelper from "../randomHelper.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator from "./voteTabulator.js";

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

        let sortedVoteCounts = MajorityTabulator.sortVotesByCount(electionResults.eliminated);
        const runOffCandidates = MajorityTabulator.selectCandidates(remainingSeats + 1, sortedVoteCounts, false);
        const runOffResults = this.tabulateRound(
            new Race(`${race.name} Runoff`, runOffCandidates, remainingSeats),
            votes
        );

        // if we still don't have enough elected candidates, take subsequent 
        // candidates from the runoff results, and flip a coin for ties
        if(runOffResults.elected.length < remainingSeats) {
            const electedCandidates: Candidate[] = runOffResults.elected.map(c => c.candidate);
            
            sortedVoteCounts = MajorityTabulator.sortVotesByCount(runOffResults.eliminated);
            
            for(const [_, candidates] of sortedVoteCounts) {
                // we have enough elected candidates, so stop
                if(electedCandidates.length >= remainingSeats) {
                    break;
                }
                // we have enough elected candidates to fill the remaining seats
                else if(candidates.length <= remainingSeats - electedCandidates.length) {
                    electedCandidates.push(...candidates);
                } 
                // we have more candidates than remaining seats, need to break ties
                else {
                    // shuffle candidates to randomize selection
                    const shuffled = RandomHelper.shuffle(candidates);
                    electedCandidates.push(...shuffled.slice(0, remainingSeats - electedCandidates.length));
                }
            } 

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

        // Sort candidates by vote count in descending order
        // then group them by count
        // and filter to only those who met the quota
        const sortedVoteCounts = new Map(
            Array.from(MajorityTabulator.sortVotesByCount(voteCounts))
            .filter(([count, _]) => count >= quota)
        );

        // find candidates meeting the quota, and fill the seats
        const electedCandidates: Candidate[] = MajorityTabulator.selectCandidates(race.seats, sortedVoteCounts);

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

    /**
     * Sorts candidates by their vote counts in descending order,
     * then groups them by vote count.
     */
    private static sortVotesByCount(candidates: Map<Candidate, number> | CandidateReturn[]): Map<number, Candidate[]> {
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
     * Select candidates based on available seats and sorted vote counts
     * @param availableSeats 
     * @param sortedVoteCounts 
     * @param exclusive 
     * @returns 
     */
    private static selectCandidates(availableSeats: number, sortedVoteCounts: Map<number, Candidate[]>, exclusive: boolean = true) : Candidate[] {
        const electedCandidates: Candidate[] = [];

        for(const [_, candidates] of sortedVoteCounts) {
            if(
                // we have enough elected candidates,
                electedCandidates.length >= availableSeats ||
                // or if this is an exclusive select and there are more 
                // elected candidates than seats, we have ties that need to be resolved
                (exclusive && availableSeats - electedCandidates.length < candidates.length)) {
                // then stop
                    break;
            } 

            // there are enough seats for all candidates with this count, elect them all
            electedCandidates.push(...candidates);
        }

        return electedCandidates;
    }
}

export default MajorityTabulator;