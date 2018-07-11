/**
 * Analysis Web Worker.
 */
class AnalysisWebWorker {
	/**
	 * Initializes the AnalysisWebWorker class.
	 */
	constructor() {
		this.configuration = {};
		this.paper = null;

		this.handleMessage = this.handleMessage.bind( this );
	}

	/**
	 * Receives the post message and determines the command.
	 *
	 * @param {MessageEvent} arguments              The post message event.
	 * @param {Object}       arguments.data         The data object.
	 * @param {string}       arguments.data.type    The command type.
	 * @param {string}       arguments.data.payload The payload of the command.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, payload } } ) {
		switch( type ) {
			case "initialize":
				this.initialize( payload );
				break;
			case "analyze":
				this.analyze( payload );
				break;
			default:
				console.warn( "Unrecognized command", type );
		}
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {Object} configuration The configuration object.
	 *
	 * @returns {void}
	 */
	initialize( configuration ) {
		this.configuration = configuration;
		console.log( "Analysis worker initialized.", configuration );
	}

	/**
	 * Runs an analyzation of a paper.
	 *
	 * @param {Object} arguments                 The payload object.
	 * @param {number} arguments.id              The id of this analyze request.
	 * @param {Object} arguments.paper           The paper to analyze.
	 * @param {Object} [arguments.configuration] The configuration for this
	 *                                           specific analyzation.
	 *
	 * @returns {void}
	 */
	analyze( { id, paper, configuration = {} } ) {
		console.log( "Analyzing...", id, paper, configuration );
		self.postMessage( { type: "analyze done", id, paper, configuration } );
	}
}

// Create an instance of the analysis web worker.
const analysisWebWorker = new AnalysisWebWorker();

// Bind the post message handler.
self.addEventListener( "message", analysisWebWorker.handleMessage );
