import YoastShortcodePlugin from "../../../src/analysis/plugins/shortcode-plugin";

describe( "YoastShortcodePlugin", () => {
	let plugin;
	// Mock the functions and objects needed for the class
	const mockRegisterPlugin = jest.fn();
	const mockRegisterModification = jest.fn();
	const mockPluginReady = jest.fn();
	const mockPluginReloaded = jest.fn();
	const shortcodesToBeParsed = [ "caption", "wpseo_breadcrumb" ];

	// Mock the global objects and functions used in the class
	global.tinyMCE = {};
	// eslint-disable-next-line camelcase
	global.wpseoScriptData = { analysis: { plugins: { shortcodes: { wpseo_filter_shortcodes_nonce: "nonce" } } } };
	global.ajaxurl = "http://example.com/ajax";
	global._ = { debounce: jest.fn() };

	beforeEach( () => {
		plugin = new YoastShortcodePlugin(
			{
				registerPlugin: mockRegisterPlugin,
				registerModification: mockRegisterModification,
				pluginReady: mockPluginReady,
				pluginReloaded: mockPluginReloaded,
			},
			shortcodesToBeParsed
		);
	} );

	afterEach( () => {
		mockRegisterPlugin.mockClear();
		mockRegisterModification.mockClear();
		mockPluginReady.mockClear();
		mockPluginReloaded.mockClear();
		global._.debounce.mockClear();
	} );

	it( "should initialize YoastShortcodePlugin and register it", () => {
		plugin.declareReady();

		expect( mockRegisterPlugin ).toHaveBeenCalledWith( "YoastShortcodePlugin", { status: "loading" } );
	} );

	it( "should declare the YoastShortcodePlugin ready", () => {
		plugin.declareReady();

		expect( mockPluginReady ).toHaveBeenCalledWith( "YoastShortcodePlugin" );
	} );

	it( "should return true if the shortcode is unparsed", () => {
		expect( plugin.isUnparsedShortcode( "caption" ) ).toBeTruthy();
	} );

	it( "should return the unparsed shortcodes", () => {
		expect( plugin.getUnparsedShortcodes( [ "caption", "wpseo_breadcrumb" ] ) ).toEqual( [ "caption", "wpseo_breadcrumb" ] );
	} );

	it( "should extract shortcodes from a given piece of text", () => {
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
		// Simulate an AJAX response with parsed shortcodes
		const shortcodeResults = JSON.stringify( [
			{ shortcode: "[shortcode1]", output: "Parsed Output 1" },
			{ shortcode: "[shortcode2]", output: "Parsed Output 2" },
		] );
		// Mock the jQuery.post function.
		global.jQuery = {
			post: jest.fn( ( url, data, callback ) => {
				callback( shortcodeResults );
			} ),
		};

		// Mock the saveParsedShortcodes method for assertions.
		const saveParsedShortcodes = jest.spyOn( plugin, "saveParsedShortcodes" );

		// Call the parseShortcodes method.
		plugin.parseShortcodes( [ "[shortcode1]", "[shortcode2]" ], () => {
			// Expect that saveParsedShortcodes was called with the correct parsed shortcodes.
			expect( saveParsedShortcodes ).toHaveBeenCalledWith( shortcodeResults, expect.any( Function ) );

			done();
		} );
	} );
} );

