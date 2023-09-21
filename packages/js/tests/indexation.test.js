// import { act } from "react-dom/test-utils";
// import Indexation from "../src/components/Indexation";

/**
 * Fetch mock response.
 *
 * @param {Object} data Response data.
 *
 * @returns {Promise} The promise.
 */
const fetchResponse = ( data ) => {
	return Promise.resolve( { text: () => Promise.resolve( JSON.stringify( data ) ), ok: true } );
};

describe( "Indexation", () => {
	it( "it won't allow you to index a non production environment", () => {
		global.yoastIndexingData = {
			disabled: true,
		};
	} );

	it( "will show you when the indexation is complete", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				// eslint-disable-next-line camelcase
				indexing_endpoints: {
					prepare: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
		};

		global.fetch = jest.fn().mockImplementation( ( url ) => {
			if ( url === "https://example.com/indexing-endpoint" ) {
				return fetchResponse( {
					objects: [
						{}, {}, {}, {}, {},
					],
					// eslint-disable-next-line camelcase
					next_url: false,
				} );
			}

			return Promise.reject();
		} );
	} );

	it( "shows an error when something goes wrong", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				// eslint-disable-next-line camelcase
				indexing_endpoints: {
					prepare: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
			subscriptionActivationLink: "https://example.net/activation-link",
			errorMessage: "An error message.",
		};

		global.fetch = jest.fn( () => (
			Promise.reject( new Error( "Request failed!" ) ) )
		);
	} );

	it( "executes registered pre- and postindexing actions", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				// eslint-disable-next-line camelcase
				indexing_endpoints: {
					indexation: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
		};

		global.fetch = jest.fn().mockImplementation( ( url ) => {
			if ( url === "https://example.com/indexing-endpoint" ) {
				return fetchResponse( {
					objects: [
						{}, {}, {}, {}, {},
					],
					// eslint-disable-next-line camelcase
					next_url: false,
				} );
			}

			return Promise.reject();
		} );

		// const preIndexingAction = jest.fn();
		// const postIndexingAction = jest.fn();
	} );
} );
