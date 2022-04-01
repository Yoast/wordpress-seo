import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Indexation from "../src/components/Indexation";

/**
 * Fetch mock response.
 *
 * @param {Object} data Response data.
 *
 * @returns {Promise} The promise.
 */
const fetchReponse = ( data ) => {
	return Promise.resolve( { text: () => Promise.resolve( JSON.stringify( data ) ), ok: true } );
};

describe( "Indexation", () => {
	it( "it won't allow you to index a non production environment", () => {
		global.yoastIndexingData = {
			disabled: true,
		};

		const component = mount( <Indexation /> );

		const button = component.find( "button" );

		expect( button.text() ).toEqual( "Start SEO data optimization" );
		expect( button.props().disabled ).toBe( true );

		const alert = component.find( "Alert" );

		expect( alert.text() ).toEqual( "SEO data optimization is disabled for non-production environments." );
	} );

	it( "will show you when the indexation is complete", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				indexing_endpoints: {
					prepare: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
		};

		global.fetch = jest.fn();
		global.fetch.mockImplementation( ( url ) => {
			if ( url === "https://example.com/indexing-endpoint" ) {
				return fetchReponse( {
					objects: [
						{}, {}, {}, {}, {},
					],
					// eslint-disable-next-line camelcase
					next_url: false,
				} );
			}

			return Promise.reject();
		} );

		const component = mount( <Indexation /> );

		component.find( "button" ).simulate( "click" );

		const progressBar = component.find( "ProgressBar" );
		expect( progressBar.prop( "value" ) ).toEqual( 0 );
		expect( progressBar.prop( "max" ) ).toEqual( 5 );

		await act( async() => {
			component.update();
		} );

		component.update();

		expect( global.fetch ).toHaveBeenCalledWith( "https://example.com/indexing-endpoint", {
			headers: {
				"X-WP-Nonce": "nonsense",
			},
			method: "POST",
		} );

		const alert = await component.find( "Alert" );
		expect( alert.text() ).toEqual( "SEO data optimization complete" );
		expect( alert.prop( "type" ) ).toEqual( "success" );
	} );

	it( "shows an error when something goes wrong", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
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

		const component = mount( <Indexation /> );

		await act( async() => {
			component.find( "button" ).simulate( "click" );
		} );

		component.update();

		const alert = component.find( "Alert" );

		expect( alert.prop( "type" ) ).toEqual( "error" );
	} );

	it( "executes registered pre- and postindexing actions", async() => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				indexing_endpoints: {
					indexation: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
		};

		global.fetch = jest.fn();
		global.fetch.mockImplementation( ( url ) => {
			if ( url === "https://example.com/indexing-endpoint" ) {
				return fetchReponse( {
					objects: [
						{}, {}, {}, {}, {},
					],
					// eslint-disable-next-line camelcase
					next_url: false,
				} );
			}

			return Promise.reject();
		} );

		const preIndexingAction = jest.fn();
		const postIndexingAction = jest.fn();

		const component = mount( <Indexation
			preIndexingActions={ { indexation: preIndexingAction } }
			indexingActions={ { indexation: postIndexingAction } }
		/> );

		component.instance().setState( { state: "in_progress" } );

		await component.instance().doIndexing( "indexation" );

		component.update();

		const settings = global.yoastIndexingData;

		expect( preIndexingAction ).toHaveBeenCalledWith( settings );
		expect( postIndexingAction ).toHaveBeenCalledWith( [
			// Response.objects
			{}, {}, {}, {}, {},
		], settings );
	} );
} );
