import Indexation from "../src/components/Indexation";
import { mount } from "enzyme";

/**
 * Fetch mock response.
 *
 * @param {Object} data Response data.
 *
 * @returns {Promise} The promise.
 */
const fetchReponse = ( data ) => {
	return new Promise( resolve => {
		resolve( {
			json: () => {
				return new Promise( resolve2 => {
					resolve2( data );
				} );
			},
		} );
	} );
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

		expect( alert.text() ).toEqual( "This button to optimize the SEO data for your website is disabled for non-production environments." );
	} );

	it( "will show you when the indexation is complete", ( done ) => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				endpoints: {
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

		component.instance().setPreIndexingActions( {} );
		component.instance().setIndexingActions( {} );

		component.find( "button" ).simulate( "click" );

		const progressBar = component.find( "ProgressBar" );
		expect( progressBar.prop( "value" ) ).toEqual( 0 );
		expect( progressBar.prop( "max" ) ).toEqual( 5 );

		// Allow callbacks to be executed first.
		setTimeout( () => {
			component.update();

			expect( global.fetch ).toHaveBeenCalledWith( "https://example.com/indexing-endpoint", {
				headers: {
					"X-WP-Nonce": "nonsense",
				},
				method: "POST",
			} );

			const alert = component.find( "Alert" );
			expect( alert.text() ).toEqual( "SEO data optimization complete" );
			expect( alert.prop( "type" ) ).toEqual( "success" );

			done();
		} );
	} );

	it( "shows an error when womthing goed wrong", ( done ) => {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				endpoints: {
					prepare: "indexing-endpoint",
				},
				nonce: "nonsense",
			},
		};

		global.fetch = jest.fn();
		global.fetch.mockImplementation( () => {
			return Promise.reject( new Error( "Request failed!" ) );
		} );

		const component = mount( <Indexation /> );

		component.instance().setPreIndexingActions( {} );
		component.instance().setIndexingActions( {} );

		component.find( "button" ).simulate( "click" );

		setTimeout( () => {
			component.update();

			const alert = component.find( "Alert" );

			expect( alert.prop( "type" ) ).toEqual( "error" );
			expect( alert.text() ).toEqual(
				"Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
				"Please click the button again to re-start the process."
			);

			done();
		} );
	} );

	it( "executes registered pre- and postindexing actions", async function() {
		global.yoastIndexingData = {
			amount: 5,
			restApi: {
				root: "https://example.com/",
				endpoints: {
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

		const component = mount( <Indexation /> );

		const preIndexingAction = jest.fn();
		preIndexingAction.mockReturnValue( Promise.resolve() );
		const postIndexingAction = jest.fn();
		postIndexingAction.mockReturnValue( Promise.resolve() );

		component.instance().setState( {
			indexation: preIndexingAction,
		} );
		component.instance().setState( {
			indexation: postIndexingAction,
		} );

		await component.instance().doIndexing( "indexation" );

		// Allow setState to mutate the sate.
		setTimeout( () => {
			expect( preIndexingAction ).toHaveBeenCalledWith( "indexation" );
			expect( postIndexingAction ).toHaveBeenCalledWith( "indexation", {
				objects: [
					{}, {}, {}, {}, {},
				],
				// eslint-disable-next-line camelcase
				next_url: false,
			} );
		} );
	} );
} );
