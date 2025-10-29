import Race from "./race";

interface VoteGenerator {

    castVotes(numberOfVoters: number, race: Race): Vote[];
}