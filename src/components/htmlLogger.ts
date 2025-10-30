class HTMLLogger {
    private consoleOutput: HTMLElement | null = null;

    constructor(elementId: string) {
        this.consoleOutput = document.getElementById(elementId);
    }

    public log(message: string): void {
        this.logWithClass(message, "text-body");
    }

    public primary(message: string): void {
        this.logWithClass(message, "text-primary");
    }

    public secondary(message: string): void {
        this.logWithClass(message, "text-secondary");
    }

    public success(message: string): void {
        this.logWithClass(message, "text-success");
    }

    public danger(message: string): void {
        this.logWithClass(message, "text-danger");
    }

    public warning(message: string): void {
        this.logWithClass(message, "text-warning");
    }

    public info(message: string): void {
        this.logWithClass(message, "text-info");
    }

    public blank(): void {
        if (this.consoleOutput) {
            const blankEntry = document.createElement("pre");
            blankEntry.textContent = " ";
            this.consoleOutput.appendChild(blankEntry);
        }
    }

    public clear(): void {
        if (this.consoleOutput) {
            this.consoleOutput.innerHTML = "";
        }
    }

    private logWithClass(message: string, className: string): void {
        if (this.consoleOutput) {
            const logEntry = document.createElement("pre");
            logEntry.className = className;
            logEntry.textContent = message;
            this.consoleOutput.appendChild(logEntry);
        }
    }
}
export default HTMLLogger;