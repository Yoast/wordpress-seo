import {
	findReplacementVariables, serializeBlock,
	serializeEditor, serializeSelection,
	unserializeEditor,
	replaceReplacementVariables,
} from "../src/helpers/serialization";
import {
	convertToRaw,
	convertFromRaw,
	ContentBlock,
	EditorState,
	CharacterMetadata,
	SelectionState,
} from "draft-js";

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

		const actual = serializeEditor( unserializeEditor( input, TAGS ).getCurrentContent() );

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

describe( "serializeBlock", () => {
	it( "serializes all the content into a string", () => {
		const input = new ContentBlock( { text: "Piece of text" } );
		const expected = "Piece of text";

		const actual = serializeBlock( input, () => {} );

		expect( actual ).toBe( expected );
	} );

	it( "serializes within the given selection", () => {
		const input = new ContentBlock( { text: "Piece of text" } );
		const expected = "ece";

		const actual = serializeBlock( input, () => {}, { start: 2, end: 5 } );

		expect( actual ).toBe( expected );
	} );

	it( "serializes replacement variables as %%var%% tokens", () => {
		let input = new ContentBlock( { text: "Piece of text" } );
		const characterList = input
			.getCharacterList()
			// Set character at position 7 to be entity 1.
			.set( 6, new CharacterMetadata( { entity: 1 } ) )
			// Set character at position 8 to be entity 1.
			.set( 7, new CharacterMetadata( { entity: 1 } ) );
		input = input.merge( {
			characterList,
		} );
		const entity = {
			type: "%mention",
			mutability: "IMMUTABLE",
			data: { mention: { replaceName: "long_name" } },
		};
		const entityMap = { 1: entity };

		/**
		 * Get the matched entity for the given key.
		 *
		 * @param {number} key The key to be looked for in the entityMap.
		 *
		 * @returns {object} The matched entity.
		 */
		const getEntity = ( key ) => entityMap[ key ];

		const expected = "Piece %%long_name%% text";

		const actual = serializeBlock( input, getEntity, {} );

		expect( actual ).toBe( expected );
	} );

	it( "ignores replacement variables that are half selected", () => {
		let input = new ContentBlock( { text: "Piece of text" } );
		const characterList = input
			.getCharacterList()
			// Set character at position 7 to be entity 1.
			.set( 6, new CharacterMetadata( { entity: 1 } ) )
			// Set character at position 8 to be entity 1.
			.set( 7, new CharacterMetadata( { entity: 1 } ) );
		input = input.merge( {
			characterList,
		} );
		const entity = {
			type: "%mention",
			mutability: "IMMUTABLE",
			data: { mention: { replaceName: "long_name" } },
		};
		const entityMap = { 1: entity };

		/**
		 * Get the matched entity for the given key.
		 *
		 * @param {number} key The key to be looked for in the entityMap.
		 *
		 * @returns {object} The matched entity.
		 */
		const getEntity = ( key ) => entityMap[ key ];
		const expected = "f text";

		const actual = serializeBlock( input, getEntity, { start: 7, end: input.getText().length } );

		expect( actual ).toBe( expected );
	} );

	it( "works with multiple replacement variables", () => {
		let input = new ContentBlock( { text: "Piece of the text" } );
		const characterList = input
			.getCharacterList()
			// Set character at position 7 to be entity 1.
			.set( 6, new CharacterMetadata( { entity: 1 } ) )
			// Set character at position 8 to be entity 1.
			.set( 7, new CharacterMetadata( { entity: 1 } ) )
			.set( 9, new CharacterMetadata( { entity: 2 } ) )
			.set( 10, new CharacterMetadata( { entity: 2 } ) )
			.set( 11, new CharacterMetadata( { entity: 2 } ) );
		input = input.merge( {
			characterList,
		} );
		const expected = "Piece %%long_name%% %%other_long_name%% text";
		const entity1 = {
			type: "%mention",
			mutability: "IMMUTABLE",
			data: { mention: { replaceName: "long_name" } },
		};
		const entity2 = {
			type: "%mention",
			mutability: "IMMUTABLE",
			data: { mention: { replaceName: "other_long_name" } },
		};
		const entityMap = { 1: entity1, 2: entity2 };

		/**
		 * Get the matched entity for the given key.
		 *
		 * @param {number} key The key to be looked for in the entityMap.
		 *
		 * @returns {object} The matched entity.
		 */
		const getEntity = ( key ) => entityMap[ key ];

		const actual = serializeBlock( input, getEntity );

		expect( actual ).toBe( expected );
	} );
} );

describe( "serializeSelection", () => {
	it( "only serializes a selected part of the content state", () => {
		const text = "Text %%entity%% %%entity%% Text";
		const editorState = unserializeEditor( text, [ { name: "entity", value: "EntityValue" } ] );
		const key = editorState.getCurrentContent().getFirstBlock().getKey();
		const selection = new SelectionState( {
			anchorKey: key,
			anchorOffset: 12,
			focusKey: key,
			focusOffset: 23,
		} );
		const expected = "%%entity%% Text";

		const actual = serializeSelection( editorState.getCurrentContent(), selection );

		expect( actual ).toBe( expected );
	} );
} );

describe( "replaceReplacementVariables", () => {
	it( "replaces a replacement variable that has no space behind it.", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%%moretext",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [  ],
				data: {},
			} ],
			entityMap: {		},
		};

		const editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getCurrentContent().toJS()
			.blockMap.f4sem.text;

		expect( actual ).toEqual( "Title moretext" );
	} );

	it( "places the cursor after the appended space.", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%%moretext",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [  ],
				data: {},
			} ],
			entityMap: {},
		};

		SelectionState.createEmpty( "f4sem" )
			.merge( {
				anchorOffset: 9,
				focusOffset: 9,
			} );

		const editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getSelection().toJS().anchorOffset;

		expect( actual ).toEqual( 6 );
	} );

	it( "replaces a replacement variable that already has a space behind it.", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%% moretext",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [  ],
				data: {},
			} ],
			entityMap: {},
		};

		const editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getCurrentContent().toJS()
			.blockMap.f4sem.text;

		expect( actual ).toEqual( "Title moretext" );
	} );

	it( "replaces a replacement variable that has no space behind it, with multiple replacevars.", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%%moretext%%title%%",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [ ],
				data: {},
			} ],
			entityMap: {
			},
		};

		const editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getCurrentContent().toJS()
			.blockMap.f4sem.text;

		expect( actual ).toEqual( "Title moretextTitle " );
	} );

	it( "places the cursor after the replaced entity when there is no space appended.", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%%",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [ ],
				data: {},
			} ],
			entityMap: {
			},
		};

		const selection = SelectionState.createEmpty( "f4sem" )
			.merge( {
				anchorOffset: 9,
				focusOffset: 9,
			} );

		let editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		editorState = EditorState.acceptSelection( editorState, selection );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getSelection();

		expect( actual.getAnchorOffset() ).toEqual( 6 );
		expect( actual.getFocusOffset() ).toEqual( 6 );
	} );

	it( "keeps the selection around the same content if the selection is unrelated to the replacement variables", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "%%title%% %%title%% A piece of text",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [ ],
				data: {},
			} ],
			entityMap: {
			},
		};

		const anchorOffset = 20;
		const focusOffset = 35;
		const selection = SelectionState.createEmpty( "f4sem" )
			.merge( {
				anchorOffset: anchorOffset,
				focusOffset: focusOffset,
			} );
		// We remove 4x '%%' so that amounts to a change of 8.
		const changeInOffset = -8;

		let editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		editorState = EditorState.acceptSelection( editorState, selection );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getSelection();

		expect( actual.getAnchorOffset() ).toEqual( anchorOffset + changeInOffset );
		expect( actual.getFocusOffset() ).toEqual( focusOffset + changeInOffset );
	} );

	it( "spaces out replacement variables that are stuck together", () => {
		const input = "%%title%%%%title%%%%title%%%%title%%";
		const expected = "%%title%% %%title%% %%title%% %%title%% ";
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = serializeEditor( unserializeEditor( input, replacementVariables ).getCurrentContent() );

		expect( actual ).toBe( expected );
	} );

	it( "doesn't move the selection if the extra space is after the current selection", () => {
		const contentState = {
			blocks: [ {
				key: "f4sem",
				text: "Text %%title%%",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [ ],
				data: {},
			} ],
			entityMap: {
			},
		};

		const anchorOffset = 2;
		const focusOffset = 2;
		const selection = SelectionState.createEmpty( "f4sem" )
			.merge( {
				anchorOffset: anchorOffset,
				focusOffset: focusOffset,
			} );
		/*
		 * Because all the changes in the text are after the cursor, no change in offset
		 * should occur.
		 */
		const changeInOffset = 0;

		let editorState = EditorState.createWithContent( convertFromRaw( contentState ) );
		editorState = EditorState.acceptSelection( editorState, selection );
		const replacementVariables = [ { name: "title", label: "Title", value: "My title" } ];

		const actual = replaceReplacementVariables( editorState, replacementVariables ).getSelection();

		expect( actual.getAnchorOffset() ).toEqual( anchorOffset + changeInOffset );
		expect( actual.getFocusOffset() ).toEqual( focusOffset + changeInOffset );
	} );
} );
