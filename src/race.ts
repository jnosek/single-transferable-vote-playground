import Candidate from "./candidate.js";

class Race {
    public name: string;
    public candidates: Candidate[];
    public seats: number;

    constructor(name: string, candidates: Candidate[], seats: number = 1) {
        this.name = name;
        this.candidates = candidates;
        this.seats = seats;
    }

    static empty(): Race {
        return new Race("", []);
    }

    static fromJson(json: string) : Race
    {
        const obj = JSON.parse(json);
        const candidates = obj.candidates.map((c: any) => new Candidate(c.name, c.party));
        return new Race(obj.name, candidates, obj.seats);
    }

    static toJson(race: Race): string {
        return JSON.stringify({
            name: race.name,
            candidates: race.candidates.map(c => ({ name: c.name, party: c.party })),
            seats: race.seats
        });
    }
}

class RaceReturn {
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

export { Race, RaceReturn, CandidateReturn };