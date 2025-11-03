// Entry point for your TypeScript app
import HtmlLogger from "./components/htmlLogger.js";
import { RandomVoteGenerator, WeightedRandomVoteGenerator } from "./voteGenerator.js";
import PluralityTabulator from "./tabulators/pluralityTabulator.js";
import RaceViewModel from "./components/raceViewModel.js";
import MajorityTabulator from "./tabulators/majorityTabulator.js";

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
      output.secondary(`${candidate.name} (${candidate.party})`);
    }

    output.blank();

    // configure votes
    const voteCountInput = document.getElementById('plurality-voterCount') as HTMLInputElement;
    const voteGenerator = new WeightedRandomVoteGenerator(
      parseInt(voteCountInput.value), 
      [0.35, 0.3, 0.2, 0.15]
    );

    // tabulate votes
    const tabulator = new PluralityTabulator();
    const results = tabulator.tabulateVotes(race, voteGenerator);

    output.primary('Election Results:');
    for (const candidateReturn of results[0].all) {
      if(candidateReturn.isElected) {
        output.success(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes (ELECTED)`);
      } else {
        output.secondary(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes`);
      }
    }
  });

  document.getElementById('majority-run')!.addEventListener('click', () => {
    const output = new HtmlLogger('majority-output');
    output.clear();

    raceViewModel.save();

    const race = raceViewModel.race;

    // display to page
    output.log(`Election for race ${race.name}`);
    
    for (let candidate of race.candidates) {
      output.secondary(`${candidate.name} (${candidate.party})`);
    }

    output.blank();

    // configure votes
    const voteCountInput = document.getElementById('majority-voterCount') as HTMLInputElement;
    const voteGenerator = new WeightedRandomVoteGenerator(
      parseInt(voteCountInput.value), 
      [0.35, 0.3, 0.2, 0.2, 0.2]
    );

    // tabulate votes
    const tabulator = new MajorityTabulator();
    const results = tabulator.tabulateVotes(race, voteGenerator);

    // display results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if( i === 0 )
        output.primary("General Election Results:");
      else
        output.primary(`Runoff Election Results:`);

      output.blank();
      output.info(`Number of votes cast: ${result.all.reduce((sum, cr) => sum + cr.votes, 0)}`);
      
      for (const candidateReturn of result.all) {
        if(candidateReturn.isElected) {
          output.success(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes (ELECTED)`);
        } else {
          output.secondary(`${candidateReturn.candidate.name}: ${candidateReturn.votes} votes`);
        }
      }
      
      output.blank();
    }
  });
}
