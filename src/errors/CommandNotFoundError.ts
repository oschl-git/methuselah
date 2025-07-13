export default class CommandNotFoundError extends Error {
  commandName?: string;
	
	constructor(message: string, commandName?: string) {
    super(message);
    this.name = "CommandNotFoundError";
		this.commandName = commandName;
  }
}
