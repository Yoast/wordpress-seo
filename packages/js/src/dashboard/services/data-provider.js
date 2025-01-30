/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 */

export class DataProvider {
	#contentTypes;
	#userName;
	#features;
	#endpoints;
	#headers;
	#links;

	/**
	 * @param {ContentType[]} contentTypes The content types.
	 * @param {string} userName The user name.
	 * @param {Features} features Whether features are enabled.
	 * @param {Endpoints} endpoints The endpoints.
	 * @param {Object<string,string>} headers The headers for the WP requests.
	 * @param {Links} links The links.
	 * @constructor
	 */
	constructor( { contentTypes, userName, features, endpoints, headers, links } ) {
		this.#contentTypes = contentTypes;
		this.#userName = userName;
		this.#features = features;
		this.#endpoints = endpoints;
		this.#headers = headers;
		this.#links = links;
	}

	async getContentTypes() {
		return this.#contentTypes;
	}

	async getUserName() {
		return this.#userName;
	}

	async hasFeature( feature ) {
		return this.#features?.[ feature ] === true;
	}

	async getEndpoint( endpoint ) {
		return this.#endpoints?.[ endpoint ];
	}

	async getHeaders() {
		return this.#headers;
	}

	async getLink( id ) {
		return this.#links?.[ id ];
	}

	/**
	 * @param {string} endpoint The endpoint.
	 * @param {number?} limit The number of results to return.
	 * @throws {TypeError} If the URL is invalid.
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/URL
	 * @returns {URL} The URL to get the most popular content.
	 */
	static #createTopPagesUrl( endpoint, limit ) {
		const url = new URL( endpoint );

		if ( limit ) {
			url.searchParams.set( "limit", limit.toString( 10 ) );
		}

		return url;
	}

	async getTopPages( limit, signal ) {
		try {
			const response = await fetch(
				DataProvider.#createTopPagesUrl( this.#endpoints.topPages, limit ),
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						...this.#headers,
					},
					signal,
				}
			);
			if ( ! response.ok ) {
				throw new Error( "Not OK" );
			}

			const data = await response.json();
			if ( ! data || ! Array.isArray( data ) ) {
				throw new Error( "Invalid data" );
			}

			return data;
		} catch ( error ) {
			throw new Error( `Failed to fetch most popular content: ${ error }` );
		}
	}
}
