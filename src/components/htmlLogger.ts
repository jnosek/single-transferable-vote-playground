class HTMLLogger {
    private static consoleOutput: HTMLElement | null = null;

    static initialize(elementId: string): void {
        this.consoleOutput = document.getElementById(elementId);
    }
 
    static log(message: string): void {
        if (this.consoleOutput) {
            const logEntry = document.createElement("pre");
            logEntry.textContent = message;
            this.consoleOutput.appendChild(logEntry);
        }
    }
}
export default HTMLLogger;