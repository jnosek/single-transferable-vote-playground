// Entry point for your TypeScript app
import output from "./components/htmlLogger.js";
import { Race } from "./race.js";
import Candidate from "./candidate.js";
import { SimpleVoteGenerator } from "./voteGenerator.js";

document.addEventListener('DOMContentLoaded', loaded);

function loaded(): void {
  output.initialize('console-output');

  output.info('Application has started.');

  // create sample race
  const race = new Race("Mayoral Election", [
    new Candidate("Alice", "Democrat"),
    new Candidate("Bob", "Republican"),
    new Candidate("Charlie", "Independent")
  ]);

  // display to page
  output.log(`Election for race ${race.name}`);
  for (let candidate of race.candidates) {
    output.secondary(`     ${candidate.name} (${candidate.party})`);
  }

  // generate votes
  const voteGenerator = new SimpleVoteGenerator();
  const votes = voteGenerator.castVotes(400, race);

  output.success(`Generated ${votes.length} votes.`);

}
