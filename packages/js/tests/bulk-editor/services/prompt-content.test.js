import Researcher from "yoastseo/src/languageProcessing/languages/en/Researcher";
import { preparePromptContent } from "../../../src/bulk-editor/services/prompt-content";
import { resetResearcher } from "../../../src/bulk-editor/services/researcher";

/**
 * Puts the real English researcher on the window, the way the page's analysis bundle does.
 *
 * @returns {void}
 */
const mockResearcherGlobal = () => {
	window.yoast = { ...window.yoast, Researcher: { "default": Researcher } };
};

/**
 * Sets the localized analysis data the service reads.
 *
 * @param {Object} analysis The analysis data.
 *
 * @returns {void}
 */
const mockAnalysisData = ( analysis ) => {
	window.wpseoBulkEditorData = { analysis };
};

describe( "preparePromptContent", () => {
	beforeEach( () => {
		resetResearcher();
		mockResearcherGlobal();
		mockAnalysisData( { contentLocale: "en_US" } );
	} );

	afterEach( () => {
		delete window.wpseoBulkEditorData;
	} );

	it( "collects the sentences of the parsed content", async() => {
		const content = "<p>The first sentence. The second sentence.</p>";

		expect( await preparePromptContent( content ) ).toBe( "The first sentence. The second sentence." );
	} );

	it( "separates paragraphs with a space", async() => {
		const content = "<p>First paragraph.</p><p>Second paragraph.</p>";

		expect( await preparePromptContent( content ) ).toBe( "First paragraph. Second paragraph." );
	} );

	it( "strips markup, keeping the text it wraps", async() => {
		const content = "<p>A <strong>bold</strong> claim about <a href=\"https://example.test\">things</a>.</p>";

		expect( await preparePromptContent( content ) ).toBe( "A bold claim about things." );
	} );

	it( "cuts on a sentence boundary rather than mid-sentence", async() => {
		// Each sentence is 5 words plus a full stop; with a 12 token budget only whole sentences fit.
		const content = "<p>One two three four five. Six seven eight nine ten. Eleven twelve.</p>";

		const result = await preparePromptContent( content, { maxTokens: 12 } );

		expect( result ).toBe( "One two three four five." );
		expect( result.endsWith( "." ) ).toBe( true );
	} );

	it( "applies the given token budget", async() => {
		// Many short sentences, so each budget stops at a different one.
		const content = `<p>${ "One two three. ".repeat( 100 ) }</p>`;

		const generous = await preparePromptContent( content, { maxTokens: 300 } );
		const tight = await preparePromptContent( content, { maxTokens: 150 } );

		expect( tight.length ).toBeLessThan( generous.length );
		// Both stop on a sentence boundary rather than mid-sentence.
		expect( tight.endsWith( "." ) ).toBe( true );
		expect( generous.endsWith( "." ) ).toBe( true );
	} );

	it( "keeps the text enclosed by a registered shortcode while dropping the brackets", async() => {
		mockAnalysisData( { contentLocale: "en_US", shortcodes: [ "caption" ] } );
		const content = "<p>[caption]Enclosed wording stays.[/caption]</p>";

		const result = await preparePromptContent( content );

		expect( result ).toContain( "Enclosed wording stays." );
		expect( result ).not.toContain( "[caption]" );
	} );

	it( "falls back to a single full stop for content with no sentences", async() => {
		expect( await preparePromptContent( "" ) ).toBe( "." );
		expect( await preparePromptContent( "<p></p>" ) ).toBe( "." );
	} );

	it( "tolerates a nullish content", async() => {
		expect( await preparePromptContent( null ) ).toBe( "." );
		expect( await preparePromptContent( undefined ) ).toBe( "." );
	} );

	it( "caps how much raw content is parsed, without affecting the collected sentences", async() => {
		// The budget is reached long before the 20k cap, so a much larger post yields the same content.
		const opening = "<p>The opening sentence. ";
		const short = `${ opening }${ "filler word. ".repeat( 40 ) }</p>`;
		const huge = `${ opening }${ "filler word. ".repeat( 40 ) }${ "tail word. ".repeat( 5000 ) }</p>`;

		expect( await preparePromptContent( huge, { maxTokens: 20 } ) )
			.toBe( await preparePromptContent( short, { maxTokens: 20 } ) );
	} );

	it( "reuses one researcher across calls", async() => {
		const constructor = jest.fn( () => new Researcher() );
		window.yoast = { ...window.yoast, Researcher: { "default": constructor } };
		resetResearcher();

		await preparePromptContent( "<p>One.</p>" );
		await preparePromptContent( "<p>Two.</p>" );

		expect( constructor ).toHaveBeenCalledTimes( 1 );
	} );
} );
