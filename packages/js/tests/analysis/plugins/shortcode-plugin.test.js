import YoastShortcodePlugin from "../../../src/analysis/plugins/shortcode-plugin";

// Mock the functions and objects needed for the class
const mockRegisterPlugin = jest.fn();
const mockRegisterModification = jest.fn();
const mockPluginReady = jest.fn();
const mockPluginReloaded = jest.fn();
const shortcodesToBeParsed = [ "caption", "wpseo_breadcrumb" ];

// Mock the global objects and functions used in the class
global.tinyMCE = {};
global.wpseoScriptData = { analysis: { plugins: { shortcodes: { wpseo_filter_shortcodes_nonce: "nonce" } } } };
global.ajaxurl = "http://example.com/ajax";
global._ = { debounce: jest.fn() };

describe( "YoastShortcodePlugin", () => {
	beforeEach( () => {
		mockRegisterPlugin.mockClear();
		mockRegisterModification.mockClear();
		mockPluginReady.mockClear();
		mockPluginReloaded.mockClear();
		global._.debounce.mockClear();
	} );

	it( "should initialize YoastShortcodePlugin and register with Yoast SEO", () => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);
		plugin.declareReady();

		expect( mockRegisterPlugin ).toHaveBeenCalledWith( "YoastShortcodePlugin", { status: "loading" } );
	} );

	it( "should declare ready with YoastSEO", () => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);

		plugin.declareReady();

		expect( mockPluginReady ).toHaveBeenCalledWith( "YoastShortcodePlugin" );
	} );

	it( "should return true if the shortcode is unparsed", () => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);
		expect( plugin.isUnparsedShortcode( "caption" ) ).toBeTruthy();
	} );

	it( "should return the unparsed shortcodes", () => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);
		expect( plugin.getUnparsedShortcodes( [ "caption", "wpseo_breadcrumb" ] ) ).toEqual( [ "caption", "wpseo_breadcrumb" ] );
	} );

	it( "should extract shortcodes from a given piece of text", () => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);

		// Test input text with shortcodes.
		const inputText = "This is a sample [wpseo_breadcrumb] text with an image with caption [caption id=\"attachment_8\" align=\"alignnone\"" +
			" width=\"230\"]<img class='size-medium wp-image-8' src='https://wacky-fowl.localsite.io/" +
			"95fa1-230x300.jpg' alt='A tortie cat, not wayang kulit' width='230' height='300'>" +
			"</img> A tortie cat, not a red panda.[/caption].";

		// Call the getShortcodes method.
		const shortcodes = plugin.getShortcodes( inputText );

		// Expect the extracted shortcodes.
		expect( shortcodes ).toEqual( [
			"[caption id=\"attachment_8\" align=\"alignnone\" " +
			"width=\"230\"]<img class='size-medium wp-image-8' src='https://wacky-fowl.localsite.io/" +
			"95fa1-230x300.jpg' alt='A tortie cat, not wayang kulit' width='230' height='300'>" +
			"</img> A tortie cat, not a red panda.[/caption]",
			"[wpseo_breadcrumb]" ] );
	} );

	it( "should parse shortcodes through AJAX and save parsed shortcodes", ( done ) => {
		const plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);

		// Mock the jQuery.post function.
		global.jQuery = {
			post: jest.fn( ( url, data, callback ) => {
				// Simulate an AJAX response with parsed shortcodes
				const shortcodeResults = JSON.stringify( [
					{ shortcode: "[shortcode1]", output: "Parsed Output 1" },
					{ shortcode: "[shortcode2]", output: "Parsed Output 2" },
				] );
				callback( shortcodeResults );
			} ),
		};

		// Mock the saveParsedShortcodes method for assertions.
		const saveParsedShortcodes = jest.spyOn( plugin, "saveParsedShortcodes" );

		// Call the parseShortcodes method.
		plugin.parseShortcodes( [ "[shortcode1]", "[shortcode2]" ], () => {
			// Expect that saveParsedShortcodes was called with the correct parsed shortcodes
			expect( saveParsedShortcodes ).toHaveBeenCalledWith( JSON.stringify( [
				{ shortcode: "[shortcode1]", output: "Parsed Output 1" },
				{ shortcode: "[shortcode2]", output: "Parsed Output 2" },
			] ), expect.any( Function ) );

			done();
		} );
	} );
} );

