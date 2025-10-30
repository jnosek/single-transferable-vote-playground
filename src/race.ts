import Candidate from "./candidate.js";

class Race {
    readonly name: string;
    readonly candidates: Candidate[];
    readonly seats: number;

    constructor(name: string, candidates: Candidate[], seats: number = 1) {
        this.name = name;
        this.candidates = candidates;
        this.seats = seats;
    }
}

class RaceResults {

}

export { Race, RaceResults };