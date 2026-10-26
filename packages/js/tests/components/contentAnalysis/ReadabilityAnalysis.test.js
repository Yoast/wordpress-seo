import getL10nObject from "../../../src/analysis/getL10nObject";
import ReadabilityAnalysis from "../../../src/components/contentAnalysis/ReadabilityAnalysis";
import { render, screen } from "../../test-utils";

jest.mock( "../../../src/analysis/getL10nObject", () => jest.fn() );

// Make the default export the bare component, so its methods can be called directly.
jest.mock( "@wordpress/data", () => ( {
	withSelect: () => component => component,
} ) );
jest.mock( "../../../src/containers/Results", () => () => null );

jest.mock( "../../../src/ai-optimizer/components/ai-optimize-button", () => {
	const { createElement } = require( "@wordpress/element" );
	return {
		__esModule: true,
		"default": ( { id, isPremium } ) => createElement( "button", {
			"data-testid": "ai-optimize-button",
			"data-id": id,
			"data-premium": String( isPremium ),
		} ),
	};
} );

/**
 * Renders the output of `renderAIOptimizeButton` for the given props and assessment.
 *
 * The props are merged over `defaultProps`, which constructing the class directly does not apply.
 *
 * @param {boolean} isPremium Whether Yoast SEO Premium is active.
 * @param {Object} props The props to construct the component with, merged over the component's default props.
 * @param {string} id The assessment ID to render the button for.
 *
 * @returns {import("@testing-library/react").RenderResult} The render result.
 */
const renderResultButton = ( isPremium, props, id = "sentenceLength" ) => {
	getL10nObject.mockReturnValue( { isPremium } );
	const button = new ReadabilityAnalysis( { ...ReadabilityAnalysis.defaultProps, ...props } ).renderAIOptimizeButton( true, id );
	return render( <div>{ button }</div> );
};

describe( "ReadabilityAnalysis.renderAIOptimizeButton", () => {
	it( "renders the AI Optimize button when the AI feature is enabled in Premium", () => {
		renderResultButton( true, { isAiFeatureEnabled: true } );

		expect( screen.getByTestId( "ai-optimize-button" ) ).toHaveAttribute( "data-premium", "true" );
	} );

	it( "does not render the AI Optimize button when the AI feature is disabled in Premium", () => {
		renderResultButton( true, { isAiFeatureEnabled: false } );

		expect( screen.queryByTestId( "ai-optimize-button" ) ).not.toBeInTheDocument();
	} );

	it( "renders the AI Optimize button when the AI feature is enabled in Free", () => {
		renderResultButton( false, { isAiFeatureEnabled: true } );

		expect( screen.getByTestId( "ai-optimize-button" ) ).toHaveAttribute( "data-premium", "false" );
	} );

	it( "does not render the AI Optimize button when the AI feature is disabled in Free", () => {
		renderResultButton( false, { isAiFeatureEnabled: false } );

		expect( screen.queryByTestId( "ai-optimize-button" ) ).not.toBeInTheDocument();
	} );
} );
