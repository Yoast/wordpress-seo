import { configureShortlinker, createShortlink, createShortlinkAnchorOpeningTag } from "../../src/shortlinker/singleton";

describe( "Shortlinker singleton", () => {
	beforeEach( () => {
		configureShortlinker( { params: { test: "true" } } );
	} );

	test( "createShortlink", () => {
		expect( createShortlink( "https://example.com" ) ).toBe( "https://example.com?test=true" );
	} );

	test( "createShortlink with extra params", () => {
		expect( createShortlink( "https://example.com", { extra: "params" } ) ).toBe( "https://example.com?test=true&extra=params" );
	} );

	test( "createShortlinkAnchorOpeningTag", () => {
		expect( createShortlinkAnchorOpeningTag( "https://example.com" ) ).toBe( "<a href='https://example.com?test=true' target='_blank'>" );
	} );

	test( "createShortlinkAnchorOpeningTag with extra params", () => {
		expect( createShortlinkAnchorOpeningTag( "https://example.com", { extra: "params" } ) ).toBe(
			"<a href='https://example.com?test=true&extra=params' target='_blank'>"
		);
	} );
} );
