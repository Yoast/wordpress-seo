/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 * @type {import("../index").TopPageData}
 * @type {import("../index").SiteKitConfiguration} SiteKitConfiguration
 */

/**
 * Controls the data.
 */
export class DataProvider {
	#contentTypes;
	#userName;
	#features;
	#endpoints;
	#headers;
	#links;
	#siteKitConfiguration;

	/**
	 * @param {ContentType[]} contentTypes The content types.
	 * @param {string} userName The user name.
	 * @param {Features} features Whether features are enabled.
	 * @param {Endpoints} endpoints The endpoints.
	 * @param {Object<string,string>} headers The headers for the WP requests.
	 * @param {Links} links The links.
	 * @param {SiteKitConfiguration} siteKitConfiguration The Site Kit configuration.
	 */
	constructor( { contentTypes, userName, features, endpoints, headers, links, siteKitConfiguration } ) {
		this.#contentTypes = contentTypes;
		this.#userName = userName;
		this.#features = features;
		this.#endpoints = endpoints;
		this.#headers = headers;
		this.#links = links;
		this.#siteKitConfiguration = siteKitConfiguration;
	}

	/**
	 * @returns {ContentType[]} The content types.
	 */
	getContentTypes() {
		return this.#contentTypes;
	}

	/**
	 * @returns {string} The user name.
	 */
	getUserName() {
		return this.#userName;
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
	 * @returns {Object<string,string>} The headers for making requests to the endpoints.
	 */
	getHeaders() {
		return this.#headers;
	}

	/**
	 * @param {string} id The identifier.
	 * @returns {?string} The link, if found.
	 */
	getLink( id ) {
		return this.#links?.[ id ];
	}

	/**
	 * @returns {SiteKitConfiguration} The site kit configuration data.
	 */
	getSiteKitConfiguration() {
		return this.#siteKitConfiguration;
	}

	/**
	 * @param {boolean} isConnected Whether the site kit is connected.
	 */
	setSiteKitConnected( isConnected ) {
		// This creates a new object to avoid mutation and force re-rendering.
		this.#siteKitConfiguration = {
			...this.#siteKitConfiguration,
			isConnected,
		};
	}

	/**
	 * @param {boolean} isConfigurationDismissed Whether the site kit configuration is (permanently) dismissed.
	 */
	setSiteKitConfigurationDismissed( isConfigurationDismissed ) {
		// This creates a new object to avoid mutation and force re-rendering.
		this.#siteKitConfiguration = {
			...this.#siteKitConfiguration,
			isConfigurationDismissed,
		};
	}
}
