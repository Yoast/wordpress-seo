import TextFormality from "../../../src/insights/components/text-formality";
import React from "react";
import { shallow } from "enzyme";
import TextFormalityUpsell from "../../../src/insights/components/text-formality-upsell";

window.wpseoAdminL10n = {
	"shortlinks-insights-text_formality_info_free": "https://yoa.st/formality-free",
	"shortlinks-insights-text_formality_info_premium": "https://yoa.st/formality",
};

describe( "a test for TextFormality component", () => {
	it( "should not render the component if the locale is non-English", () => {
		window.wpseoScriptData = {
			metabox: {
				contentLocale: "nl_NL",
				isPremium: false,
			},
		};
		const render = shallow( <TextFormality location="sidebar" /> );

		expect( render.find( TextFormalityUpsell ) ).toHaveLength( 0 );
	} );
	it( "renders the component in sidebar in Free when the locale is English", () => {
		window.wpseoScriptData = {
			metabox: {
				contentLocale: "en_US",
				isPremium: false,
			},
		};
		const render = shallow( <TextFormality location="sidebar" /> );

		expect( render.find( TextFormalityUpsell ) ).toHaveLength( 1 );
	} );
} );
