/* global describe, it, expect */

import * as actions from "../../../src/redux/actions/keywords";

describe( "keywords actions", () => {
	it( "should pass along the keywords when using set keywords", () => {
		const expected = {
			type: actions.SET_KEYWORDS,
			keywords: [ "testing", "some", "keywords" ],
		};
		const actual = actions.setKeywords( [ "testing", "some", "keywords" ] );

		expect( actual ).toEqual( expected );
	} );

	it( "should pass along the keyword when using add keyword", () => {
		const expected = {
			type: actions.ADD_KEYWORD,
			keyword: "new keyword",
			index: -1,
		};
		const actual = actions.addKeyword( "new keyword" );

		expect( actual ).toEqual( expected );
	} );

	it( "should pass along the index when using add keyword with an index", () => {
		const expected = {
			type: actions.ADD_KEYWORD,
			keyword: "new keyword",
			index: 3,
		};
		const actual = actions.addKeyword( "new keyword", 3 );

		expect( actual ).toEqual( expected );
	} );

	it( "should pass along the to be removed keyword when using remove keyword", () => {
		const expected = {
			type: actions.REMOVE_KEYWORD,
			keyword: "remove this",
		};
		const actual = actions.removeKeyword( "remove this" );

		expect( actual ).toEqual( expected );
	} );
} );
