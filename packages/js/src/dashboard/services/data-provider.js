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
	#subscribers = new Set();

	#stepsStatuses;

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
		this.#stepsStatuses = [
			this.#siteKitConfiguration.isInstalled,
			this.#siteKitConfiguration.isActive,
			this.#siteKitConfiguration.isSetupCompleted,
			this.#siteKitConfiguration.isConnected,
		]
	}

	/**
     * Subscribe to changes in the site kit configuration.
     * @param {Function} callback The callback to call when the configuration changes.
     * @returns {Function} Unsubscribe function.
     */
	subscribe( callback ) {
		this.#subscribers.add( callback );
		return () => this.#subscribers.delete( callback );
	}

	/**
     * Notify all subscribers of a change in the site kit configuration.
     */
	notifySubscribers() {
		this.#subscribers.forEach( callback => callback() );
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
	 * @returns {boolean} The possible stepper statuses.
	 */
	getStepsStatuses() {
		return this.#stepsStatuses;
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
	 * Gets the first incomplete step.
	 * @returns {number} The step that is currently unfinished. Returns -1 when all steps are finished.
	 */
	getSiteKitCurrentConnectionStep() {
		return this.#stepsStatuses.findIndex( status => ! status );
	}

	isSiteKitConnectionCompleted() {
		return this.getSiteKitCurrentConnectionStep() === -1;
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
		this.#stepsStatuses[ 3 ] = isConnected;
		this.notifySubscribers();
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
		this.notifySubscribers();
	}
}
