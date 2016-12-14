import ProminentWordCache from "./ProminentWordCache";
import EventEmitter from "events";

/**
 * Handles the retrieval and storage of focus keyword suggestions
 */
class ProminentWordNoStorage extends EventEmitter {
	/**
	 * A null-object for the prominent word storage.
	 */
	constructor() {
		super();
	}

	/**
	 * A void version of saving the prominent words.
	 *
	 * @returns {Promise} Resolves immediately.
	 */
	saveProminentWords() {
		return Promise.resolve();
	}
}

export default ProminentWordNoStorage;
