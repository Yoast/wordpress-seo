export enum LogLevel {
	/**
	 * Nothing will be logged (default)
	 */
	NONE = 0,
	/**
	 * Only errors will be logged.
	 */
	ERROR = 1,
	/**
	 * Warnings and errors will be logged.
	 */
	WARNING = 2,

	/**
	 * Info, warnings and errors will be logged.
	 */
	INFO = 3,

	/**
	 * Debug information, info, warnings and errors will be logged.
	 */
	DEBUG = 4,
}

export interface Logger {
	setLogLevel( level: LogLevel ): void;
	error( ...input: unknown[] ): void;
	warning( ...input: unknown[] ): void;
	info( ...input: unknown[] ): void;
	debug( ...input: unknown[] ): void;
	log( ...input: unknown[] ): void;
}

/**
 * Logs input to the window.console if the loglevel is set
 */
export class ConsoleLogger implements Logger {
	level: LogLevel = LogLevel.NONE;

	/**
	 * Creates a new ConsoleLogger
	 * @param logLevel The minimum severity a message needs to have to appear in the log (default NONE)
	 */
	constructor( logLevel: LogLevel = LogLevel.NONE ) {
		this.setLogLevel( logLevel );
	}

	/**
	 * Sets the minimum loglevel required for logs to appear.
	 * @param level The desired level.
	 */
	setLogLevel( level: LogLevel ) {
		this.level = level;
	}

	/**
	 * Logs data if the severity is at or above the current loglevel.
	 *
	 * @param level The severity of the message.
	 * @param color The color of the message label.
	 * @param input The data to log.
	 */
	protected writeLog( level: LogLevel, color: string, ...input: unknown[] ): void {
		if ( this.level >= level && level !== LogLevel.NONE ) {
			// This should be the only remaining console.log in the repository.
			// eslint-disable-next-line no-console
			console.log( `%c ${ LogLevel[ level ] }:`, `color: ${ color };`, ...input );
		}
	}

	/**
	 * Write debug logging.
	 *
	 * @param input The data to log.
	 */
	log( ...input: unknown[] ): void {
		this.debug( ...input );
	}

	/**
	 * Logs detailed debug information.
	 *
	 * @param input The data to log.
	 */
	debug( ...input: unknown[] ): void {
		this.writeLog( LogLevel.DEBUG, "darkorchid", ...input );
	}

	/**
	 * Logs information.
	 *
	 * @param input The data to log.
	 */
	info( ...input: unknown[] ): void {
		this.writeLog( LogLevel.INFO, "blue", ...input );
	}

	/**
	 * Logs a warning.
	 *
	 * @param input The data to log.
	 */
	warning( ...input: unknown[] ): void {
		this.writeLog( LogLevel.WARNING, "darkorange", ...input );
	}

	/**
	 * Logs an error.
	 *
	 * @param input The data to log.
	 */
	error( ...input: unknown[] ): void {
		this.writeLog( LogLevel.ERROR, "red", ...input );
	}

	/**
	 * Starts a logging group.
	 *
	 * @param label The label for this group.
	 */
	startGroup( label: string ): void {
		// eslint-disable-next-line no-console
		console.groupCollapsed( label );
	}

	/**
	 * Ends the logging group that is currently active.
	 */
	endGroup(): void {
		// eslint-disable-next-line no-console
		console.groupEnd();
	}
}

const logger = new ConsoleLogger( LogLevel.ERROR );

export default logger;
