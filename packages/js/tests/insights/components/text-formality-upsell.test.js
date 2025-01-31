import TextFormalityUpsell from "../../../src/insights/components/text-formality-upsell";
import renderer from "react-test-renderer";

window.wpseoAdminL10n = {
	"shortlinks-insights-upsell-sidebar-text_formality": "https://yoa.st/formality-upsell-sidebar",
	"shortlinks-insights-upsell-metabox-text_formality": "https://yoa.st/formality-upsell-metabox",
	"shortlinks-insights-upsell-elementor-text_formality": "https://yoa.st/formality-upsell-elementor",
};

describe( "a test for TextFormalityUpsell component", () => {
	it( "renders the component in sidebar", () => {
		const render = renderer.create( <TextFormalityUpsell location="sidebar" /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
	it( "renders the component in metabox", () => {
		const render = renderer.create( <TextFormalityUpsell location="metabox" /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
	it( "renders the component in Elementor", () => {
		const render = renderer.create( <TextFormalityUpsell location="elementor" /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
