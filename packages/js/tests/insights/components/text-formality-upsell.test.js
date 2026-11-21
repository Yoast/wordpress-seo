import TextFormalityUpsell from "../../../src/insights/components/text-formality-upsell";
import { render } from "@testing-library/react";

window.wpseoAdminL10n = {
	"shortlinks-insights-upsell-sidebar-text_formality": "https://yoa.st/formality-upsell-sidebar",
	"shortlinks-insights-upsell-metabox-text_formality": "https://yoa.st/formality-upsell-metabox",
	"shortlinks-insights-upsell-elementor-text_formality": "https://yoa.st/formality-upsell-elementor",
};

describe( "a test for TextFormalityUpsell component", () => {
	it( "renders the component in sidebar", () => {
		const { container } = render( <TextFormalityUpsell location="sidebar" /> );

		expect( container.firstChild ).toMatchSnapshot();
	} );
	it( "renders the component in metabox", () => {
		const { container } = render( <TextFormalityUpsell location="metabox" /> );

		expect( container.firstChild ).toMatchSnapshot();
	} );
	it( "renders the component in Elementor", () => {
		const { container } = render( <TextFormalityUpsell location="elementor" /> );

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
