// Entry point for your TypeScript app
import output from "./components/htmlLogger.js";
import { Race } from "./race.js";
import Candidate from "./candidate.js";
import { SimpleVoteGenerator } from "./voteGenerator.js";
import PluralityTabulator from "./tabulators/pluralityTabulator.js";

document.addEventListener('DOMContentLoaded', loaded);

function loaded(): void {
  output.initialize('console-output');

  output.info('Application has started.');
  output.blank();

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
  output.blank();

  // tabulate votes
  const tabulator = new PluralityTabulator();
  const results = tabulator.tabulateVotes(race, votes);

  output.primary('Election Results:');
  for (const candidateReturn of results.all) {
    if(candidateReturn.isElected) {
      output.success(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes (ELECTED)`);
    } else {
      output.secondary(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes`);
    }
  }
}
