/* global jest beforeEach describe it expect */

import GutenbergDataCollector from "../../src/replacevar/gutenberg-data-collector";

const collector = new GutenbergDataCollector();

global.wp = { data: {}, api: { models: {} } };

beforeEach( () => {
	const select = jest.fn().mockReturnValue( {
		getEditedPostAttribute: jest.fn()
			.mockReturnValue( 1 ),
	} );
	const Page = jest.fn().mockImplementation( () => {
		return {
			fetch: jest.fn().mockReturnValue( {
				done: jest.fn().mockImplementation( callback => {
					callback( {
						title: {
							rendered: "The title",
						},
					} );
				} ),
			} ),
		};
	} );
	global.wp.data.select = select;
	global.wp.api.models.Page = Page;
} );

describe( "GutenbergDataProvider", () => {
	it( "gets the parent id", () => {
		const expected = 1;
		expect( collector.getParentId() ).toBe( expected );
	} );

	it( "gets the parent title from the wordpress API", done => {
		const callback = ( title ) => {
			expect( title ).toBe( "The title" );
			done();
		};

		collector.getParentTitle( 1, callback );
	} );
} );

