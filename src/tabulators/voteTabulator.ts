import { Race, RaceReturns } from "../race.js";
import VoteGenerator from "../voteGenerator.js";

interface VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturns;
}

export default VoteTabulator;