import {
	collectPromptContent,
	MAX_TOKENS_DEFAULT,
	MAX_TOKENS_IRREGULAR,
} from "../../../src/shared-admin/helpers/prompt-content";

/**
 * Builds a sentence with a given token count.
 *
 * @param {string} text       The sentence text.
 * @param {number} tokenCount How many tokens the sentence consists of.
 *
 * @returns {{text: string, tokens: Array}} The sentence.
 */
const sentence = ( text, tokenCount ) => ( { text, tokens: Array( tokenCount ).fill( "x" ) } );

describe( "collectPromptContent", () => {
	it( "concatenates the sentences that fit within the budget", () => {
		const paragraphs = [ { sentences: [ sentence( "Hello", 1 ), sentence( " World", 1 ) ] } ];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_DEFAULT ) ).toBe( "Hello World" );
	} );

	it( "separates paragraphs with a space", () => {
		const paragraphs = [
			{ sentences: [ sentence( "First.", 2 ) ] },
			{ sentences: [ sentence( "Second.", 2 ) ] },
		];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_DEFAULT ) ).toBe( "First. Second." );
	} );

	it( "only adds whole sentences, so the content never ends mid-sentence", () => {
		const paragraphs = [ {
			sentences: [
				sentence( "a", 70 ),
				sentence( "b", 70 ),
				sentence( "c", 70 ),
				sentence( "d", 70 ),
				// The fifth sentence pushes the count past 300, so it is dropped whole.
				sentence( "e", 70 ),
			],
		} ];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_DEFAULT ) ).toBe( "abcd" );
	} );

	it( "applies the irregular budget when it is the one passed in", () => {
		const paragraphs = [ {
			sentences: [ sentence( "a", 70 ), sentence( "b", 70 ), sentence( "c", 70 ) ],
		} ];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_IRREGULAR ) ).toBe( "ab" );
	} );

	it( "counts the paragraph separator as a token", () => {
		// 149 + separator (1) = 150, so the budget is exactly spent and the second paragraph's sentence drops.
		const paragraphs = [
			{ sentences: [ sentence( "a", 149 ) ] },
			{ sentences: [ sentence( "b", 1 ) ] },
		];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_IRREGULAR ) ).toBe( "a" );
	} );

	it( "replaces new lines and carriage returns with a space", () => {
		const paragraphs = [ { sentences: [ sentence( "Hello\n\r\n\nthis is a text with\n\nnew lines", 8 ) ] } ];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_DEFAULT ) ).toBe( "Hello this is a text with new lines" );
	} );

	it( "falls back to a full stop when the first sentence alone exceeds the budget", () => {
		const paragraphs = [ { sentences: [ sentence( "A very long sentence", 350 ) ] } ];

		expect( collectPromptContent( paragraphs, MAX_TOKENS_DEFAULT ) ).toBe( "." );
	} );

	it( "falls back to a full stop when there is nothing to collect", () => {
		expect( collectPromptContent( [], MAX_TOKENS_DEFAULT ) ).toBe( "." );
		expect( collectPromptContent( [ { sentences: [] } ], MAX_TOKENS_DEFAULT ) ).toBe( "." );
	} );

	it( "tolerates absent paragraphs or an absent sentences list", () => {
		expect( collectPromptContent( null, MAX_TOKENS_DEFAULT ) ).toBe( "." );
		expect( collectPromptContent( undefined, MAX_TOKENS_DEFAULT ) ).toBe( "." );
		expect( collectPromptContent( [ {} ], MAX_TOKENS_DEFAULT ) ).toBe( "." );
	} );

	it( "keeps the budgets the in-editor generator has always used", () => {
		expect( MAX_TOKENS_DEFAULT ).toBe( 300 );
		expect( MAX_TOKENS_IRREGULAR ).toBe( 150 );
	} );
} );
