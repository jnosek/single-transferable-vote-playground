import { Race, RaceResults } from "../race";
import Vote from "../vote";

interface VoteTabulator {
    tabulateVotes(race: Race, votes: Vote[]): RaceResults;
}

export default VoteTabulator;