import { configureQueryStringAppender, appendQueryString, createAnchorOpeningTag } from "../../../src/helpers/queryStringAppender/singleton";

describe( "QueryStringAppender singleton", () => {
	beforeEach( () => {
		configureQueryStringAppender( { params: { test: "true" } } );
	} );

	test( "appendQueryString", () => {
		expect( appendQueryString( "https://example.com" ) ).toBe( "https://example.com?test=true" );
	} );

	test( "appendQueryString with extra params", () => {
		expect( appendQueryString( "https://example.com", { extra: "params" } ) ).toBe( "https://example.com?test=true&extra=params" );
	} );

	test( "createAnchorOpeningTag", () => {
		expect( createAnchorOpeningTag( "https://example.com" ) ).toBe( "<a href='https://example.com?test=true' target='_blank'>" );
	} );

	test( "createAnchorOpeningTag with extra params", () => {
		expect( createAnchorOpeningTag( "https://example.com", { extra: "params" } ) ).toBe(
			"<a href='https://example.com?test=true&extra=params' target='_blank'>"
		);
	} );
} );
