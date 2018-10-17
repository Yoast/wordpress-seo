import "../src/wp-seo-shortcode-plugin";

const { YoastShortcodePlugin } = window;
const { removeUnknownShortCodes } = YoastShortcodePlugin.prototype;

describe( "removeUnknownShortcodes", () => {
	it( "filters undefined shortcodes", () => {
		const input = "[shortcode]Hello[/shortcode]";
		const expected = "Hello";

		const actual = removeUnknownShortCodes( input );

		expect( actual ).toBe( expected );
	} );

	it( "filters shortcodes with special characters", () => {
		const input = "<p>" +
			"[vc_row]" +
				"[vc_column]" +
					"[vc_column_text" +
						' css_animation="bounceInLeft"' +
						' el_class="tøüst123"' +
						' css=".vc_custom_1482153765626{margin-right: 4px !important;}"]' +
						"This is the text that needs to be preserved." +
					"[/vc_column_text]" +
				"[/vc_column]" +
			"[/vc_row]" +
		"</p>";
		const expected = "<p>This is the text that needs to be preserved.</p>";

		const actual = removeUnknownShortCodes( input );

		expect( actual ).toBe( expected );
	} );
} );
