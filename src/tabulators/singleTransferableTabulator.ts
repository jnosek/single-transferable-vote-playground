import { Race, RaceReturn } from "../race.js";
import VoteGenerator from "../voteGenerator.js";
import VoteTabulator from "./voteTabulator.js";

class SingleTransferableTabulator implements VoteTabulator {
    tabulateVotes(race: Race, votes: VoteGenerator): RaceReturn[] {
        // Implementation for tabulating votes in a single transferable vote election
        // TODO: Implement the logic and return RaceResults
        return [new RaceReturn([])];
    }
}