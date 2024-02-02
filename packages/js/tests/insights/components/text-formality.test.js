import { useSelect } from "@wordpress/data";
import TextFormality from "../../../src/insights/components/text-formality";
import { render, screen } from "../../test-utils";

jest.mock( "@wordpress/data", () => ( {
	// `registerStore` is used in WP components' Slot component, used in the TextFormality component.
	registerStore: jest.requireActual( "@wordpress/data" ).registerStore,
	useSelect: jest.fn(),
} ) );

beforeAll( () => {
	global.wpseoAdminL10n = {
		"shortlinks-insights-text_formality_info_free": "https://yoa.st/formality-free",
		"shortlinks-insights-text_formality_info_premium": "https://yoa.st/formality",
	};
	global.wpseoScriptData = {
		metabox: {
			isPremium: false,
		},
	};
} );
afterAll( () => {
	delete global.wpseoAdminL10n;
	delete global.wpseoScriptData;
} );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFormalitySupported Whether Formality feature is available.
 *
 * @returns {function} The mock.
 */
const mockSelect = isFormalitySupported => useSelect.mockImplementation( select => select( () => ( {
	isFormalitySupported: () => isFormalitySupported,
} ) ) );

describe( "TextFormality", () => {
	it( "should not render the component if the locale is non-English", () => {
		mockSelect( false );

		render( <TextFormality location="sidebar" name="YoastTextFormalitySidebar" /> );

		expect( screen.queryByText( "will help you assess the formality level of your text." ) ).not.toBeInTheDocument();
	} );

	it( "renders the component in sidebar in Free when the locale is English", () => {
		mockSelect( true );

		render( <TextFormality location="sidebar" name="YoastTextFormalitySidebar" /> );

		expect( screen.getByText( "will help you assess the formality level of your text." ) ).toBeInTheDocument();
	} );
} );
