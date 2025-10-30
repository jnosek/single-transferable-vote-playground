class HTMLLogger {
    private static consoleOutput: HTMLElement | null = null;

    static initialize(elementId: string): void {
        this.consoleOutput = document.getElementById(elementId);
    }
 
    static log(message: string): void {
        this.logWithClass(message, "text-body");
    }

    static primary(message: string): void {
        this.logWithClass(message, "text-primary");
    }

    static secondary(message: string): void {
        this.logWithClass(message, "text-secondary");
    }

    static success(message: string): void {
        this.logWithClass(message, "text-success");
    }

    static danger(message: string): void {
        this.logWithClass(message, "text-danger");
    }

    static warning(message: string): void {
        this.logWithClass(message, "text-warning");
    }

    static info(message: string): void {
        this.logWithClass(message, "text-info");
    }

    private static logWithClass(message: string, className: string): void {
        if (this.consoleOutput) {
            const logEntry = document.createElement("pre");
            logEntry.className = className;
            logEntry.textContent = message;
            this.consoleOutput.appendChild(logEntry);
        }
    }
}
export default HTMLLogger;