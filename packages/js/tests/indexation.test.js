import Indexation from "../src/components/Indexation";
import { fireEvent, render, screen, waitFor } from "./test-utils";

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

		render( <Indexation /> );

		const button = screen.getByRole( "button" );
		expect( button ).toHaveTextContent( "Start SEO data optimization" );
		expect( button ).toBeDisabled();

		const alert = screen.queryByText( "SEO data optimization is disabled for non-production environments." );
		expect( alert ).toBeInTheDocument();
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

		render( <Indexation /> );
		fireEvent.click( screen.getByRole( "button" ) );

		const optimizing = screen.queryByText( "Optimizing SEO data... This may take a while." );
		expect( optimizing ).toBeInTheDocument();

		const progressBar = document.getElementsByTagName( "progress" )[ 0 ];
		expect( progressBar ).toBeInTheDocument();
		expect( progressBar ).toHaveAttribute( "value", "0" );
		expect( progressBar ).toHaveAttribute( "max", "5" );

		await waitFor( () => {
			const complete = screen.queryByText( "SEO data optimization complete" );
			expect( complete ).toBeInTheDocument();
		}, { timeout: 1000 } );

		expect( global.fetch ).toHaveBeenCalledWith( "https://example.com/indexing-endpoint", {
			headers: {
				"X-WP-Nonce": "nonsense",
			},
			method: "POST",
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
			errorMessage: "An error message.",
		};

		global.fetch = jest.fn( () => (
			Promise.reject( new Error( "Request failed!" ) ) )
		);

		render( <Indexation /> );
		fireEvent.click( screen.getByRole( "button" ) );

		await waitFor( () => {
			const error = screen.queryByText( "An error message." );
			expect( error ).toBeInTheDocument();
		}, { timeout: 1000 } );

		expect( global.fetch ).toHaveBeenCalledWith( "https://example.com/indexing-endpoint", {
			headers: {
				"X-WP-Nonce": "nonsense",
			},
			method: "POST",
		} );
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

		const response = {
			objects: [ {}, {}, {}, {}, {} ],
			// eslint-disable-next-line camelcase
			next_url: false,
		};
		global.fetch = jest.fn().mockImplementation( ( url ) => {
			if ( url === "https://example.com/indexing-endpoint" ) {
				return fetchResponse( response );
			}

			return Promise.reject();
		} );

		const preIndexingAction = jest.fn();
		const postIndexingAction = jest.fn();

		render( <Indexation
			preIndexingActions={ { indexation: preIndexingAction } }
			indexingActions={ { indexation: postIndexingAction } }
		/> );
		fireEvent.click( screen.getByRole( "button" ) );

		await waitFor( () => {
			expect( preIndexingAction ).toHaveBeenCalledWith( global.yoastIndexingData );
			expect( postIndexingAction ).toHaveBeenCalledWith( response.objects, global.yoastIndexingData );
		}, { timeout: 1000 } );
	} );
} );
