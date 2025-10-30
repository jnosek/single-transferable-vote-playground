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

class RaceReturns {
    readonly elected: CandidateReturn[];
    readonly eliminated: CandidateReturn[];
    readonly all: CandidateReturn[];

    constructor(all: CandidateReturn[]) {
        this.all = all;
        this.elected = all.filter(c => c.isElected);
        this.eliminated = all.filter(c => !c.isElected);
    }
}

class CandidateReturn {
    readonly candidate: Candidate;
    readonly votes: number;
    readonly isElected: boolean;

    constructor(candidate: Candidate, votes: number, isElected: boolean = false) {
        this.candidate = candidate;
        this.votes = votes;
        this.isElected = isElected;
    }
}

export { Race, RaceReturns, CandidateReturn };