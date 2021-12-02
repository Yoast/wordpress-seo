import IndexingService from "../../src/services/IndexingService";

describe( "IndexingService", () => {
	it( "Defaults to empty objects for indexing actions", () => {
		const instance = new IndexingService( {} );

		expect( instance.preIndexingActions ).toBeInstanceOf( Object );
		expect( instance.postIndexingActions ).toBeInstanceOf( Object );
		expect( Object.keys( instance.preIndexingActions ) ).toHaveLength( 0 );
		expect( Object.keys( instance.postIndexingActions ) ).toHaveLength( 0 );
	} );

	it( "Filters non-function indexing actions", () => {
		const func = jest.fn();
		const preIndexingActions = {
			func: func,
			number: 1,
			nothing: null,
			string: "string",
		};
		const postIndexingActions = {
			func: func,
			number: 1,
			nothing: null,
			string: "string",
		};

		const instance = new IndexingService( {}, preIndexingActions, postIndexingActions );

		expect( Object.keys( instance.preIndexingActions ) ).toHaveLength( 1 );
		expect( Object.keys( instance.postIndexingActions ) ).toHaveLength( 1 );
		expect( instance.preIndexingActions.func ).toEqual( func );
		expect( instance.postIndexingActions.func ).toEqual( func );
	} );

	it( "Does nothing when no endpoints are provided", async() => {
		const instance = new IndexingService( {} );

		global.fetch = jest.fn();
		expect( global.fetch ).not.toBeCalled();
		const progress = jest.fn();
		expect( progress ).not.toBeCalled();

		const count = await instance.index( {}, progress );
		expect( count ).toEqual( 0 );
	} );

	it( "Calls endpoints until they have no next URL", async() => {
		const instance = new IndexingService( { restApi: { root: "root", nonce: "nonce" } } );

		global.fetch = jest.fn();
		global.fetch.mockImplementation( ( url ) => {
			if ( url === "root/path" ) {
				const data = {
					objects: [
						{}, {}, {}, {}, {},
					],
					// eslint-disable-next-line camelcase
					next_url: false,
				};
				return Promise.resolve( { text: () => Promise.resolve( JSON.stringify( data ) ), ok: true } );
			}

			return Promise.reject();
		} );
		const progress = jest.fn();
		expect( progress ).toBeCalledWith( 5 );

		instance.index( { test: "/path" }, progress );
	} );
} );
