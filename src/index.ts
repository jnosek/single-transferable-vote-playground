// Entry point for your TypeScript app
import output from "./components/htmlLogger.js";

document.addEventListener('DOMContentLoaded', loaded);

function loaded(): void {
  output.initialize('console-output');

  output.log('Application has started.');
}
