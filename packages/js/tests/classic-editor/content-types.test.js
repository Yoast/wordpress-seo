import { getContentTypeReplacements } from "../../src/classic-editor/content-types";
import {
	createPostReplacementVariableConfigurations,
	createTermReplacementVariableConfigurations,
} from "../../src/classic-editor/replacement-variables";

describe( "The getContentTypes function", () => {
	it( "should return the replacement variable configuration per content type ", () => {
		const actual = getContentTypeReplacements();

		expect( actual.post.name ).toEqual( "post" );
		expect( actual.post.replacementVariableConfigurations.toString() ).
			toBe( createPostReplacementVariableConfigurations().toString() );
		expect( actual.term.name ).toEqual( "term" );
		expect( actual.term.replacementVariableConfigurations.toString() ).
			toBe( createTermReplacementVariableConfigurations().toString() );
	} );
} );
