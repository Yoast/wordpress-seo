import { Fill, SlotFillProvider } from "@wordpress/components";
import { LocationProvider } from "@yoast/externals/contexts";
import { getImageAltTagsButtonSlotName } from "../../../src/analysis/constants";
import { SeoAnalysis } from "../../../src/components/contentAnalysis/SeoAnalysis";
import { render, screen } from "../../test-utils";

jest.mock( "../../../src/ai-optimizer/components/ai-optimize-button", () => {
	const { createElement } = require( "@wordpress/element" );
	return {
		__esModule: true,
		"default": ( { id } ) => createElement( "button", { "data-testid": "ai-optimize-button", "data-id": id } ),
	};
} );

/**
 * Renders the output of `renderAIOptimizeButton` for the given props and assessment.
 *
 * A fill for the metabox slot is always present, so a rendered slot is visible as its button.
 *
 * The props are merged over `defaultProps`, which constructing the class directly does not apply. Without that,
 * `isElementor` and `isTerm` would arrive as `undefined` rather than `false`.
 *
 * @param {Object} props The props to construct the component with, merged over the component's default props.
 * @param {string} id The assessment ID to render the button for.
 * @param {boolean} [hasAIFixes] Whether the assessment can be fixed through Yoast AI Optimize.
 *
 * @returns {import("@testing-library/react").RenderResult} The render result.
 */
const renderResultButton = ( props, id, hasAIFixes = true ) => render(
	<SlotFillProvider>
		<Fill name={ getImageAltTagsButtonSlotName( "metabox" ) }>
			<button>Generate with AI</button>
		</Fill>
		<LocationProvider value="metabox">
			{ new SeoAnalysis( { ...SeoAnalysis.defaultProps, ...props } ).renderAIOptimizeButton( hasAIFixes, id ) }
		</LocationProvider>
	</SlotFillProvider>
);

describe( "SeoAnalysis.renderAIOptimizeButton", () => {
	it( "renders the image alt tags slot for the Image alt attributes assessment", () => {
		renderResultButton( { isPremium: true, isAiFeatureEnabled: true }, "imageAltTags" );

		expect( screen.getByRole( "button", { name: "Generate with AI" } ) ).toBeInTheDocument();
		expect( screen.queryByTestId( "ai-optimize-button" ) ).not.toBeInTheDocument();
	} );

	it( "renders the image alt tags slot even when the AI feature is disabled", () => {
		// The alt text button is not part of Yoast AI Optimize, so the AI Optimize gates must not suppress it.
		renderResultButton( { isPremium: true, isAiFeatureEnabled: false }, "imageAltTags", false );

		expect( screen.getByRole( "button", { name: "Generate with AI" } ) ).toBeInTheDocument();
	} );

	it( "still renders the AI Optimize button for the other assessments", () => {
		renderResultButton( { isPremium: true, isAiFeatureEnabled: true }, "keyphraseDensity" );

		expect( screen.getByTestId( "ai-optimize-button" ) ).toHaveAttribute( "data-id", "keyphraseDensity" );
		expect( screen.queryByRole( "button", { name: "Generate with AI" } ) ).not.toBeInTheDocument();
	} );

	it( "does not render the AI Optimize button when the AI feature is disabled in Premium", () => {
		renderResultButton( { isPremium: true, isAiFeatureEnabled: false }, "keyphraseDensity" );

		expect( screen.queryByTestId( "ai-optimize-button" ) ).not.toBeInTheDocument();
	} );
} );
