import { describe, expect } from "@jest/globals";
import { EDIT_TYPE } from "../../../src/ai-generator/constants";
import { applyPluggableReplacementVariables } from "../../../src/ai-generator/helpers";

describe( "applyPluggableReplacementVariables", () => {
	test.each( [
		[ "title", "   <h1>Title with spaces and HTML</h1>   ", EDIT_TYPE.title, "Title with spaces and HTML" ],
		[ "description", "   <p>Description with spaces and HTML</p>   ", EDIT_TYPE.description, "Description with spaces and HTML" ],
		[ "title with out adding editType to the function", "   <h1>Title with spaces and HTML</h1>   ", undefined, "Title with spaces and HTML" ],
	] )( "should apply replacements for %s", ( _, content, editType, expected ) => {
		expect( applyPluggableReplacementVariables( content, editType ) ).toEqual( expected );
	} );
} );
