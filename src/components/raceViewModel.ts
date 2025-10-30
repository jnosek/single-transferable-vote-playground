import Candidate from "../candidate.js";
import { Race } from "../race.js";

class RaceViewModel {
    private _race: Race;

    constructor()
    {
        this._race = this.loadFromStorage();
    }

    /**
     * Binds the view model to the HTML elements.
     */
    public bind(): void {
        // race name handlers and values
        const raceNameInput = document.getElementById('race-name') as HTMLInputElement;
        raceNameInput.value = this._race.name;
        raceNameInput.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement;
            this._race.name = input.value;
        });

        // race seats handlers and values
        const raceSeatsInput = document.getElementById('race-seats') as HTMLInputElement;
        raceSeatsInput.value = this._race.seats.toString();
        raceSeatsInput.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement;
            this._race.seats = parseInt(input.value) || 1;
        });

        // add candidate button handler
        document.getElementById('add-candidate')!.addEventListener('click', () => this.addCandidateListener());

        // populate existing candidates
        for (const candidate of this._race.candidates) {
            this.addCandidateUi(candidate);
        }
    }
    
    private addCandidateListener(): void {
        // read values from inputs
        const candidateNameInput = document.getElementById('candidate-name') as HTMLInputElement;
        const candidatePartyInput = document.getElementById('candidate-party') as HTMLInputElement;
        const name = candidateNameInput.value.trim();
        const party = candidatePartyInput.value.trim();
        
        // if not valid, stop
        if (!name || !party) {
            console.warn("Candidate name and party are required.");
            return;
        }
        
        // add candidate to model
        const newCandidate = new Candidate(name, party);
        this._race.candidates.push(newCandidate);

        // add candidate to UI
        this.addCandidateUi(newCandidate);

        // reset input
        candidateNameInput.value = '';
        candidatePartyInput.value = '';
    }

    private addCandidateUi(candidate: Candidate): void {
        const candidateList = document.getElementById('candidates-list')!;
        const template = document.getElementById('candidate-template') as HTMLTemplateElement;
        const listItem = template.content.cloneNode(true) as HTMLElement;

        const candidateNameElement = listItem.querySelector('p')!;
        candidateNameElement.textContent = candidate.name;

        const candidatePartyElement = listItem.querySelector('small')!;
        candidatePartyElement.textContent = candidate.party;

        const removeButton = listItem.querySelector('button.btn-danger')!;
        removeButton.addEventListener('click', (event) => this.removeCandidateListener(event));
        candidateList.appendChild(listItem);
    }

    private removeCandidateListener(e: Event): void {
        const listItem = (e.target as Element).closest('li')!;
        const candidateList = document.getElementById('candidates-list')!;
        const index = Array.from(candidateList.children).indexOf(listItem);
        this._race.candidates.splice(index, 1);

        this.removeCandidateUi(listItem);
    }

    private removeCandidateUi(item: Element): void {
        const candidateList = document.getElementById('candidates-list')!;
        candidateList.removeChild(item);
    }

    public load(): void {
        this._race = this.loadFromStorage();
    }

    private loadFromStorage(): Race {
        const json = localStorage.getItem('race');
        if (json) {
            return Race.fromJson(json);
        }
        return Race.empty();
    }

    public get race(): Race {
        return this._race;
    }
}

export default RaceViewModel;