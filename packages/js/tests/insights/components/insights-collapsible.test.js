import { useSelect } from "@wordpress/data";
import { enableFeatures } from "@yoast/feature-flag";
import { DIFFICULTY } from "yoastseo";
import InsightsCollapsible from "../../../src/insights/components/insights-collapsible";
import { fireEvent, render, screen, waitFor } from "../../test-utils";

jest.mock( "@wordpress/data", () => ( {
	// `registerStore` is used in WP components' Slot component, used in the TextFormality component.
	registerStore: jest.requireActual( "@wordpress/data" ).registerStore,
	useSelect: jest.fn(),
} ) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} shouldUpsell Whether to upsell.
 * @param {boolean} isProminentWordsAvailable Whether prominent words is available.
 * @param {boolean} isFleschReadingEaseAvailable Whether FRE is available.
 * @param {boolean} isFormalitySupported Whether text formality is supported.
 *
 * @returns {function} The mock.
 */
const mockSelect = ( shouldUpsell, isProminentWordsAvailable, isFleschReadingEaseAvailable, isFormalitySupported ) => {
	return useSelect.mockImplementation( select => select( () => ( {
		getPreference: ( preference, defaultValue ) => {
			switch ( preference ) {
				case "isProminentWordsAvailable":
					return isProminentWordsAvailable;
				case "shouldUpsell":
					return shouldUpsell;
				default:
					return defaultValue;
			}
		},
		getProminentWords: () => [],
		getFleschReadingEaseScore: () => 0,
		getFleschReadingEaseDifficulty: () => DIFFICULTY.NO_DATA,
		getEstimatedReadingTime: () => 0,
		getTextLength: () => ( { count: 0, unit: "word" } ),
		isFleschReadingEaseAvailable: () => isFleschReadingEaseAvailable,
		isFormalitySupported: () => isFormalitySupported,
	} ) ) );
};

describe( "InsightsCollapsible", () => {
	afterEach( () => {
		useSelect.mockRestore();
	} );

	it( "renders and opens the collapsible", async() => {
		enableFeatures( [ "TEXT_FORMALITY" ] );
		mockSelect( true, true, true, true );

		render( <InsightsCollapsible location={ "metabox" } /> );

		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button.textContent ).toBe( "Insights" );
		fireEvent.click( button );

		await waitFor( () => {
			expect( screen.getByText( "Prominent words" ) ).toBeInTheDocument();
			expect( screen.getByText( "Flesch reading ease" ) ).toBeInTheDocument();
			expect( screen.getByText( "Reading time" ) ).toBeInTheDocument();
			expect( screen.getByText( "Word count" ) ).toBeInTheDocument();
			expect( screen.getByText( "Text formality" ) ).toBeInTheDocument();
		} );
	} );
} );
