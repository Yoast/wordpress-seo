import { enforceTitleVariable } from "../../../src/ai-generator/helpers";

describe( "enforceTitleVariable", () => {
	it( "should return the same template if it already includes '%%title%%'", () => {
		const template = "Some content with %%title%% inside";
		const result = enforceTitleVariable( template, "post" );
		expect( result ).toBe( template );
	} );

	it( "should set '%%title%%' to the template if it does not include it", () => {
		const template = "Some content without title variable";
		const expected = "%%title%%";
		const result = enforceTitleVariable( template, "post" );
		expect( result ).toBe( expected );
	} );

	it( "should return '%%title%%' if the template is empty", () => {
		const template = "";
		const expected = "%%title%%";
		const result = enforceTitleVariable( template, "post" );
		expect( result ).toBe( expected );
	} );

	it( "should set '%%term title%% Archives' to the template if it does not include it and we are working on a term", () => {
		const template = "Some content without title variable";
		const expected = "%%term_title%%";
		const result = enforceTitleVariable( template, "term" );
		expect( result ).toBe( expected );
	} );
} );

