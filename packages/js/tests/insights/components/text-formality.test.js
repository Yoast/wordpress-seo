import { useSelect } from "@wordpress/data";
import TextFormality from "../../../src/insights/components/text-formality";
import React from "react";
import renderer from "react-test-renderer";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

window.wpseoAdminL10n = {
	"shortlinks-insights-upsell-sidebar-text_formality": "https://yoa.st/formality-upsell-sidebar",
	"shortlinks-insights-upsell-metabox-text_formality": "https://yoa.st/formality-upsell-metabox",
	"shortlinks-insights-upsell-elementor-text_formality": "https://yoa.st/formality-upsell-elementor",
	"shortlinks-insights-text_formality_info_free": "https://yoa.st/formality-sidebar-free",
	"shortlinks-insights-text_formality_info_premium": "https://yoa.st/formality-sidebar",
};

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {object} shouldUpsell     Whether the upsell whould be shown or not.
 * @param {string} formalityLevel   The formality level of the text.
 * @param{object} textLength        The object that contains information on the text length.
 *
 * @returns {void}
 */
function mockSelect( shouldUpsell, formalityLevel, textLength ) {
	const select = jest.fn(
		() => (
			{
				getPreference: jest.fn( () => shouldUpsell ),
				getTextFormalityLevel: jest.fn( () => formalityLevel ),
				getTextLength: jest.fn( () => textLength ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "a test for TextFormality component", () => {
	it( "renders the component in sidebar in Free ", () => {
		mockSelect( true, "formal", { count: 0 } );
		const render = renderer.create( <TextFormality location={ "sidebar" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in metabox in Free ", () => {
		mockSelect( true, "formal", { count: 0 } );
		const render = renderer.create( <TextFormality location={ "metabox" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in sidebar in Premium ", () => {
		mockSelect( false, "formal", { count: 100 } );
		const render = renderer.create( <TextFormality location={ "sidebar" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in sidebar in Premium ", () => {
		mockSelect( false, "informal", { count: 0 } );
		const render = renderer.create( <TextFormality location={ "sidebar" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in metabox in Premium ", () => {
		mockSelect( false, "formal", { count: 0 } );
		const render = renderer.create( <TextFormality location={ "metabox" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in elementor in Free ", () => {
		mockSelect( true, "formal", { count: 0 } );
		const render = renderer.create( <TextFormality location={ "elementor" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the component in elementor in Premium ", () => {
		mockSelect( false, "informal", { count: 1000 } );
		const render = renderer.create( <TextFormality location={ "elementor" } /> );

		const tree = render.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
