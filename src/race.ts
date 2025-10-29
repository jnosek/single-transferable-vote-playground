import Candidate from "./candidate";

class Race {
    readonly name: string;
    readonly candidates: Candidate[];

    constructor(name: string, candidates: Candidate[]) {
        this.name = name;
        this.candidates = candidates;
    }
}

export default Race;