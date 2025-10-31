import { Race, RaceReturn } from "../race.js";
import VoteGenerator from "../voteGenerator.js";

interface VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[];
}

export default VoteTabulator;