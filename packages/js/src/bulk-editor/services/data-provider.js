/**
 * @typedef {Object} ContentType A content type.
 * @property {string} name The name of the content type.
 * @property {string} label The label of the content type.
 */

/**
 * Controls the data for the bulk editor.
 */
export class DataProvider {
	#contentTypes;
	#endpoints;
	#links;

	/**
	 * @param {Object} [data] The initial data.
	 * @param {ContentType[]} [data.contentTypes] The content types.
	 * @param {Object<string,string>} [data.endpoints] The endpoints.
	 * @param {Object<string,string>} [data.links] The links.
	 */
		this.#contentTypes = contentTypes;
		this.#endpoints = endpoints;
		this.#links = links;
	}

	/**
	 * @returns {ContentType[]} The content types.
	 */
	getContentTypes() {
		return this.#contentTypes;
	}

	/**
	 * @param {string} endpoint The endpoint to get.
	 * @returns {string} The endpoint or an empty string if not found.
	 */
	getEndpoint( endpoint ) {
		return this.#endpoints[ endpoint ] || "";
	}

	/**
	 * @returns {Object<string,string>} The endpoints.
	 */
	getEndpoints() {
		return this.#endpoints;
	}

	/**
	 * @param {string} link The link to get.
	 * @returns {string} The link or an empty string if not found.
	 */
	getLink( link ) {
		return this.#links[ link ] || "";
	}

	/**
	 * @returns {Object<string,string>} The links.
	 */
	getLinks() {
		return this.#links;
	}
}
