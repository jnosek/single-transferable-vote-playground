import { Race, RaceReturns } from "../race.js";
import Vote from "../vote.js";

interface VoteTabulator {
    tabulateVotes(race: Race, votes: Vote[]): RaceReturns;
}

export default VoteTabulator;