import QueryStringAppender from "../../src/queryStringAppender/QueryStringAppender";

describe( "QueryStringAppender", () => {
	test( "create an instance without config to include empty params", () => {
		const queryStringAppender = new QueryStringAppender();
		expect( queryStringAppender._config ).toEqual( { params: {} } );
	} );

	test( "create an instance with config to save the params", () => {
		const queryStringAppender = new QueryStringAppender( { params: { test: "true" } } );
		expect( queryStringAppender._config ).toEqual( { params: { test: "true" } } );
	} );

	test( "configure: save the params", () => {
		const queryStringAppender = new QueryStringAppender();
		queryStringAppender.configure( { params: { test: "true" } } );
		expect( queryStringAppender._config ).toEqual( { params: { test: "true" } } );
	} );

	test( "configure: overwrite params", () => {
		const queryStringAppender = new QueryStringAppender( { params: { test: "false" } } );
		queryStringAppender.configure( { params: { test: "true" } } );
		expect( queryStringAppender._config ).toEqual( { params: { test: "true" } } );
	} );

	test( "createQueryString to return a string", () => {
		expect( QueryStringAppender.createQueryString( {} ) ).toEqual( "" );
	} );

	test( "createQueryString to return a query string with one param", () => {
		expect( QueryStringAppender.createQueryString( { platform: "PC" } ) ).toEqual( "platform=PC" );
	} );

	test( "createQueryString to return a query string with multiple params", () => {
		expect( QueryStringAppender.createQueryString( { platform: "PC", version: "1.2.3" } ) ).toEqual( "platform=PC&version=1.2.3" );
	} );

	test( "createQueryString to encode the params", () => {
		expect( QueryStringAppender.createQueryString( {
			platform: "PC",
			version: "1.2.3",
			encode: "this includes spaces",
		} ) ).toEqual( "platform=PC&version=1.2.3&encode=this%20includes%20spaces" );
	} );

	test( "createQueryString to encode the params - key too", () => {
		expect( QueryStringAppender.createQueryString( {
			platform: "PC",
			version: "1.2.3",
			"encode this": "this includes spaces",
		} ) ).toEqual( "platform=PC&version=1.2.3&encode%20this=this%20includes%20spaces" );
	} );

	test( "create a link without params", () => {
		const queryStringAppender = new QueryStringAppender();
		expect( queryStringAppender.append( "https://example.com" ) ).toEqual( "https://example.com" );
	} );

	test( "create a link with params", () => {
		const queryStringAppender = new QueryStringAppender( {
			params: {
				platform: "PC",
				version: "1.2.3",
				"encode this": "this includes spaces",
			},
		} );
		expect( queryStringAppender.append( "https://example.com" ) ).toEqual(
			"https://example.com?platform=PC&version=1.2.3&encode%20this=this%20includes%20spaces"
		);
	} );

	test( "create a link with extra params", () => {
		const queryStringAppender = new QueryStringAppender( {
			params: {
				platform: "PC",
				version: "1.2.3",
				"encode this": "this includes spaces",
			},
		} );
		expect( queryStringAppender.append( "https://example.com", { extra: "params" } ) ).toEqual(
			"https://example.com?platform=PC&version=1.2.3&encode%20this=this%20includes%20spaces&extra=params"
		);
	} );

	test( "create a anchor opening tag with params", () => {
		const queryStringAppender = new QueryStringAppender( {
			params: {
				platform: "PC",
				version: "1.2.3",
				"encode this": "this includes spaces",
			},
		} );
		expect( queryStringAppender.createAnchorOpeningTag( "https://example.com" ) ).toEqual(
			"<a href='https://example.com?platform=PC&version=1.2.3&encode%20this=this%20includes%20spaces' target='_blank'>"
		);
	} );

	test( "create a anchor opening tag with extra params", () => {
		const queryStringAppender = new QueryStringAppender( {
			params: {
				platform: "PC",
				version: "1.2.3",
				"encode this": "this includes spaces",
			},
		} );
		expect( queryStringAppender.createAnchorOpeningTag( "https://example.com", { extra: "params" } ) ).toEqual(
			"<a href='https://example.com?platform=PC&version=1.2.3&encode%20this=this%20includes%20spaces&extra=params' target='_blank'>"
		);
	} );
} );
