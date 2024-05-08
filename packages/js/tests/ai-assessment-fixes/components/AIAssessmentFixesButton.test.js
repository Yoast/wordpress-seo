import React from "react";
import { render, screen } from "../../test-utils";
import AIAssessmentFixesButton from "../../../src/ai-assessment-fixes/components/AIAssessmentFixesButton";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn( () => {
			return {
				setActiveAIFixesButton: jest.fn(),
			};
		} ),
		useSelect: jest.fn(),
	};
} );

describe( "AIAssessmentFixesButton", () => {
	test( "should find the correct aria-label in the document when hasAIFixes is true", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" hasAIFixes={ true } isPremium={ false } isBlockEditor={ true } /> );

		const labelText = document.querySelector( 'button[aria-label="Fix with AI"]' );
		expect( labelText ).toBeInTheDocument();
	} );

	test( "should find the correct button id in the document when hasAIFixes is true", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" hasAIFixes={ true } isPremium={ false } isBlockEditor={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
	} );

	test( "should NOT find the button id and the aria-label in the document when hasAIFixes is false", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" hasAIFixes={ false } isPremium={ false } isBlockEditor={ true } /> );

		const button = document.getElementById( "keyphraseDensityAIFixes" );
		const labelText = document.querySelector( 'button[aria-label="Fix with AI"]' );
		expect( labelText ).not.toBeInTheDocument();
		expect( button ).not.toBeInTheDocument();
	} );
} );

