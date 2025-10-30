import { Race, RaceResults } from "../race";
import Vote from "../vote";
import VoteTabulator from "./voteTabulator";

class singleTransferableTabulator implements VoteTabulator {
    tabulateVotes(race: Race, votes: Vote[]): RaceResults {
        // Implementation for tabulating votes in a single transferable vote election
        // TODO: Implement the logic and return RaceResults
        return new RaceResults();
    }
}