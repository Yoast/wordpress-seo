import YoastShortcodePlugin from "../../../src/analysis/plugins/shortcode-plugin";

global._ = {
	debounce: ( fn ) => {
		fn.cancel = jest.fn();
		return fn;
	},
};

const mockRegisterPlugin = jest.fn();
const mockRegisterModification = jest.fn();
const mockPluginReady = jest.fn();
const mockPluginReload = jest.fn();
const shortcodesToBeParsed = [ "caption", "wpseo_breadcrumb" ];

const shortcodePlugin = new YoastShortcodePlugin( {
	registerPlugin: mockRegisterPlugin,
	registerModification: mockRegisterModification,
	pluginReady: mockPluginReady,
	pluginReload: mockPluginReload,
}, shortcodesToBeParsed );

describe( "A test for Yoast Shortcode Plugin", () => {
	it( "returns true if the shortcode is unparsed", () => {
		expect( shortcodePlugin.isUnparsedShortcode( "caption" ) ).toBeTruthy();
	} );
	it( "returns the unparsed shortcodes", () => {
		expect( shortcodePlugin.getUnparsedShortcodes( [ "caption", "wpseo_breadcrumb" ] ) ).toEqual( [ "caption", "wpseo_breadcrumb" ] );
	} );
} );
