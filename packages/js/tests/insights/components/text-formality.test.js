import TextFormality from "../../../src/insights/components/text-formality";
import React from "react";
import { shallow } from "enzyme";
import TextFormalityUpsell from "../../../src/insights/components/text-formality-upsell";
import { useSelect } from "@wordpress/data";

window.wpseoAdminL10n = {
	"shortlinks-insights-text_formality_info_free": "https://yoa.st/formality-free",
	"shortlinks-insights-text_formality_info_premium": "https://yoa.st/formality",
};

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFormalitySupported    Whether Formality feature is available.
 *
 * @returns {void}
 */
function mockSelect( isFormalitySupported ) {
	const select = jest.fn(
		() => (
			{
				isFormalitySupported: jest.fn( () => isFormalitySupported ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "a test for TextFormality component", () => {
	it( "should not render the component if the locale is non-English", () => {
		mockSelect( false );
		window.wpseoScriptData = {
			metabox: {
				isPremium: false,
			},
		};
		const render = shallow( <TextFormality location="sidebar" name="YoastTextFormalitySidebar" /> );

		expect( render.find( TextFormalityUpsell ) ).toHaveLength( 0 );
	} );
	it( "renders the component in sidebar in Free when the locale is English", () => {
		mockSelect( true );

		window.wpseoScriptData = {
			metabox: {
				isPremium: false,
			},
		};
		const render = shallow( <TextFormality location="sidebar" name="YoastTextFormalitySidebar" /> );

		expect( render.find( TextFormalityUpsell ) ).toHaveLength( 1 );
	} );
} );
