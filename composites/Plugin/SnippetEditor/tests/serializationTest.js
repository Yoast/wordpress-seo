import {
	findReplacementVariables,
	serializeEditor,
	unserializeEditor,
} from "../serialization";
import { convertToRaw } from "draft-js";

jest.mock( "draft-js/lib/generateRandomKey", () => () => {
	let randomKey = global._testDraftJSRandomNumber;

	if ( ! randomKey ) {
		randomKey = 0;
	}

	randomKey++;
	global._testDraftJSRandomNumber = randomKey;

	return randomKey + "";
} );

const TAGS = [
	{ name: "title", value: "Title" },
	{ name: "post_type", value: "Gallery" },
];

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
					offset: 6,
					length: 9,
					key: 0,
				}, {
					offset: 0,
					length: 5,
					key: 1,
				} ],
				data: {},
			} ],
			entityMap: {
				0: {
					type: "%mention",
					mutability: "IMMUTABLE",
					data: { mention: { replaceName: "post_type" } },
				},
				1: {
					type: "%mention",
					mutability: "IMMUTABLE",
					data: { mention: { replaceName: "title" } },
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
				data: {},
				key: "1",
				inlineStyleRanges: [],
				type: "unstyled",
				depth: 0,
				text: "title post_type test test123",
				entityRanges: [ {
					offset: 0,
					length: 5,
					key: 0,
				}, {
					offset: 6,
					length: 9,
					key: 1,
				} ],
			} ],
			entityMap: {
				0: {
					type: "%mention",
					mutability: "IMMUTABLE",
					data: { mention: { replaceName: "title" } },
				},
				1: {
					type: "%mention",
					mutability: "IMMUTABLE",
					data: { mention: { replaceName: "post_type" } },
				},
			},
		};

		const actual = convertToRaw( unserializeEditor( input, TAGS ).getCurrentContent() );

		expect( actual ).toEqual( expected );
	} );

	it( "should be revertable with serialization", () => {
		const input = "The first thing, %%title%%, %%post_type%% type.";
		const expected = input;

		const actual = serializeEditor( convertToRaw( unserializeEditor( input, TAGS ).getCurrentContent() ) );

		expect( actual ).toBe( expected );
	} );
} );

describe( "findReplacementVariables", () => {
	it( "determines the list of replacement variables in the text", () => {
		const content = "Hallo %%title%%, meer spul. %%abcdefghijklmnopqrstuvwxyz%%. Hoi! %%post_type%%.";
		const expected = [
			{
				name: "title",
				start: 6,
				length: 9,
			},
			{
				name: "abcdefghijklmnopqrstuvwxyz",
				start: 28,
				length: 30,
			},
			{
				name: "post_type",
				start: 65,
				length: 13,
			},
		];

		const actual = findReplacementVariables( content );

		expect( actual ).toEqual( expected );
	} );

	it( "recognizes edge cases", () => {
		const content = "%%title%% !";
		const expected = [
			{
				name: "title",
				start: 0,
				length: 9,
			},
		];

		const actual = findReplacementVariables( content );

		expect( actual ).toEqual( expected );
	} );

	it( "recognizes variables at the end of the string", () => {
		const content = "Hoi %%title%%";
		const expected = [
			{
				name: "title",
				start: 4,
				length: 9,
			},
		];

		const actual = findReplacementVariables( content );

		expect( actual ).toEqual( expected );
	} );

	it( "recognizes malformed replacement variables correctly", () => {
		const content = "%%gibberish%%title%%";
		const expected = [
			{
				name: "gibberish",
				start: 0,
				length: 13,
			},
		];

		const actual = findReplacementVariables( content );

		expect( actual ).toEqual( expected );
	} );
} );
