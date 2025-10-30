import { Race, RaceResults } from "../race";
import Vote from "../vote";
import VoteTabulator from "./voteTabulator";

class PluralityTabulator implements VoteTabulator {
    tabulateVotes(race: Race, votes: Vote[]): RaceResults {
        // Implementation for tabulating votes in a plurality election

        return new RaceResults();
    }
}