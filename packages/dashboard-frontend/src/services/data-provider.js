/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 */

/**
 * Controls the data.
 */
export class DataProvider {
	#contentTypes;
	#features;
	#endpoints;
	#links;

	/**
	 * @param {ContentType[]} contentTypes The content types.
	 * @param {Features} features Whether features are enabled.
	 * @param {Endpoints} endpoints The endpoints.
	 * @param {Links} links The links.
	 */
	constructor( { contentTypes, features, endpoints, links } ) {
		this.#contentTypes = contentTypes;
		this.#features = features;
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
	 * @param {string} feature The feature to check.
	 * @returns {boolean} Whether the feature is enabled.
	 */
	hasFeature( feature ) {
		return this.#features?.[ feature ] === true;
	}

	/**
	 * @param {string} id The identifier.
	 * @returns {?string} The endpoint, if found.
	 */
	getEndpoint( id ) {
		return this.#endpoints?.[ id ];
	}

	/**
	 * @param {string} id The identifier.
	 * @returns {?string} The link, if found.
	 */
	getLink( id ) {
		return this.#links?.[ id ];
	}
}
