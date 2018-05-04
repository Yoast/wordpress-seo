import { serializeEditor, unserializeEditor } from "../serialization";

describe( "editor serialization", () => {
	it( "transforms the deep structure to a plain string", () => {
		const structure = {
			blocks: [ {
				key: "f4sem",
				text: "title post_type test123 fa",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [ {
					offset: 0,
					length: 5,
					key: 0,
				}, { offset: 6, length: 9, key: 1 } ],
				data: {},
			} ],
			entityMap: {
				0: {
					type: "%%mention",
					mutability: "IMMUTABLE",
					data: { mention: new Map( [ [ "name", "title" ], [ "description", "%%title%%" ] ] ) },
				},
				1: {
					type: "%%mention",
					mutability: "IMMUTABLE",
					data: { mention: new Map( [ [ "name", "post_type" ], [ "description", "%%post_type%%" ] ] ) },
				},
			},
		};
		const expected = "%%title%% %%post_type%% test123 fa";

		const actual = serializeEditor( structure );

		expect( actual ).toBe( expected );
	} );
} );

describe( "editor unserialization", () => {
	it( "transforms a string into a Draft.js editor structure", () => {
		const input = "%%title%% %%post_type%% test test123";
		const expected = {
			blocks: [ {
				text: "title post_type test test123",
				entityRanges: [ {
					offset: 0,
					length: 5,
					key: 0,
				}, { offset: 6, length: 9, key: 1 } ],
			} ],
			entityMap: {
				0: {
					type: "%%mention",
					mutability: "IMMUTABLE",
					data: { mention: new Map( [ [ "name", "title" ], [ "description", "%%title%%" ] ] ) },
				},
				1: {
					type: "%%mention",
					mutability: "IMMUTABLE",
					data: { mention: new Map( [ [ "name", "post_type" ], [ "description", "%%post_type%%" ] ] ) },
				},
			},
		};

		const actual = unserializeEditor( input );

		expect( actual ).toEqual( expected );
	} );

	it( "should be revertable with serialization", () => {
		const input = "The first thing, %%title%%, %%post_type%% type.";
		const expected = input;

		const actual = serializeEditor( unserializeEditor( input ) );

		expect( actual ).toBe( expected );
	} );
} );
