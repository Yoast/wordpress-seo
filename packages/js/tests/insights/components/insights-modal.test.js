import { useSelect } from "@wordpress/data";
import { enableFeatures } from "@yoast/feature-flag";
import { useToggleState } from "@yoast/ui-library";
import { DIFFICULTY } from "yoastseo";
import EditorModal from "../../../src/components/modals/editorModals/EditorModal";
import InsightsModal from "../../../src/insights/components/insights-modal";
import { fireEvent, render, screen, waitFor } from "../../test-utils";

/**
 * Mocked EditorModal container.
 *
 * Circumvent the WP data withSelect and withDispatch mocking problems.
 * As `jest.requireActual` does not seem to work on WP data.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The element.
 */
const EditorModalMock = props => {
	const [ isOpen, , , open, close ] = useToggleState( false );

	return <EditorModal { ...props } postTypeName="mock" isOpen={ isOpen } open={ open } close={ close } />;
};

jest.mock( "../../../src/containers/EditorModal", () => EditorModalMock );

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
 * @param {boolean} isElementorEditor Whether the editor is the Elementor editor.
 *
 * @returns {function} The mock.
 */
const mockSelect = ( shouldUpsell, isProminentWordsAvailable, isFleschReadingEaseAvailable, isFormalitySupported, isElementorEditor ) => {
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
		getIsElementorEditor: () => isElementorEditor,
	} ) ) );
};

describe( "InsightsModal", () => {
	afterEach( () => {
		useSelect.mockRestore();
	} );

	it( "renders and opens the modal", async() => {
		enableFeatures( [ "TEXT_FORMALITY" ] );
		mockSelect( true, true, true, true, false );

		render( <InsightsModal location={ "sidebar" } /> );

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
