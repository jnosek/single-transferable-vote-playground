// Entry point for your TypeScript app
import HtmlLogger from "./components/htmlLogger.js";
import { SimpleVoteGenerator } from "./voteGenerator.js";
import PluralityTabulator from "./tabulators/pluralityTabulator.js";
import RaceViewModel from "./components/raceViewModel.js";

document.addEventListener('DOMContentLoaded', loaded);

function loaded(): void {

  // ui start
  const raceViewModel = new RaceViewModel();
  raceViewModel.bind();

  document.getElementById('plurality-run')!.addEventListener('click', () => {
    const output = new HtmlLogger('plurality-output');
    output.clear();

    raceViewModel.save();

    const race = raceViewModel.race;

    // display to page
    output.log(`Election for race ${race.name}`);
    
    for (let candidate of race.candidates) {
      output.secondary(`     ${candidate.name} (${candidate.party})`);
    }

    output.blank();

    // configure votes
    const voteCountInput = document.getElementById('plurality-voterCount') as HTMLInputElement;
    const voteGenerator = new SimpleVoteGenerator(parseInt(voteCountInput.value));

    // tabulate votes
    const tabulator = new PluralityTabulator();
    const results = tabulator.tabulateVotes(race, voteGenerator);

    output.primary('Election Results:');
    for (const candidateReturn of results.all) {
      if(candidateReturn.isElected) {
        output.success(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes (ELECTED)`);
      } else {
        output.secondary(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes`);
      }
    }
  });
}
