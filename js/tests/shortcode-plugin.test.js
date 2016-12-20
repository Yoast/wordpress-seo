import shortCodePlugin from "../src/wp-seo-shortcode-plugin";

const { YoastShortcodePlugin } = window;
const { removeUnknownShortCodes } = YoastShortcodePlugin.prototype;

describe( 'removeUnknownShortcodes', () => {
	it( 'filters undefined shortcodes', () => {
		const input = "[shortcode]Hello[/shortcode]";
		const expected = "Hello";

		const actual = removeUnknownShortCodes( input );

		expect( actual ).toBe( expected );
	} );

	it( 'filters shortcodes with special characters', () => {
		const input = '<p>[vc_row][vc_column][vc_column_text css_animation="bounceInLeft" el_class="tøüst123" css=".vc_custom_1482153765626{margin-right: 4px !important;border-right-width: 2px !important;padding-right: 1px !important;background-color: #777777 !important;border-right-style: dashed !important;border-radius: 10px !important;}"]I am text blöck. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.[/vc_column_text][/vc_column][/vc_row]</p>';
		const expected = "<p>I am text blöck. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>";

		const actual = removeUnknownShortCodes( input );

		expect( actual ).toBe( expected );
	} );
});
