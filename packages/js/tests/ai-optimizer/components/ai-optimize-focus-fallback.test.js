import { render, act } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import AIOptimizeFocusFallback from "../../../src/ai-optimizer/components/ai-optimize-focus-fallback";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn(),
		useSelect: jest.fn(),
		combineReducers: jest.fn(),
		registerStore: jest.fn(),
	};
} );

jest.mock( "../../../src/ai-generator/hooks/use-location", () => ( {
	useLocation: jest.fn( () => "sidebar" ),
} ) );

describe( "AIOptimizeFocusFallback", () => {
	let setFocusAIFixesButtonId;

	beforeEach( () => {
		jest.useFakeTimers();
		setFocusAIFixesButtonId = jest.fn();
		useDispatch.mockReturnValue( { setFocusAIFixesButtonId } );
	} );

	afterEach( () => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	} );

	it( "does nothing when focusAIButtonId is null", () => {
		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => null } ) )
		);

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "keyphraseInIntroduction" } ] }
				fallbackElementId="yoast-seo-analysis-collapsible-sidebar"
			/>
		);

		act( () => jest.advanceTimersByTime( 200 ) );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "does nothing when focusAIButtonId targets a different location", () => {
		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => "keyphraseInIntroductionAIFixes-metabox" } ) )
		);

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "keyphraseInIntroduction" } ] }
				fallbackElementId="yoast-seo-analysis-collapsible-sidebar"
			/>
		);

		act( () => jest.advanceTimersByTime( 200 ) );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "does nothing when the assessment is not in this section's results", () => {
		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => "sentenceLengthAIFixes-sidebar" } ) )
		);

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "keyphraseInIntroduction" } ] }
				fallbackElementId="yoast-seo-analysis-collapsible-sidebar"
			/>
		);

		act( () => jest.advanceTimersByTime( 200 ) );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "focuses the fallback element when the AI button is not in the DOM", () => {
		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => "keyphraseInIntroductionAIFixes-sidebar" } ) )
		);

		const fallbackElement = document.createElement( "button" );
		fallbackElement.id = "yoast-seo-analysis-collapsible-sidebar";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "keyphraseInIntroduction" } ] }
				fallbackElementId="yoast-seo-analysis-collapsible-sidebar"
			/>
		);

		act( () => jest.advanceTimersByTime( 1000 ) );
		expect( focusSpy ).toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).toHaveBeenCalledWith( null );

		document.body.removeChild( fallbackElement );
	} );

	it( "does not focus fallback when the AI button is present in the DOM", () => {
		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => "keyphraseInIntroductionAIFixes-sidebar" } ) )
		);

		// Create the AI button in the DOM so fallback is not needed.
		const aiButton = document.createElement( "button" );
		aiButton.id = "keyphraseInIntroductionAIFixes-sidebar";
		document.body.appendChild( aiButton );

		const fallbackElement = document.createElement( "button" );
		fallbackElement.id = "yoast-seo-analysis-collapsible-sidebar";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "keyphraseInIntroduction" } ] }
				fallbackElementId="yoast-seo-analysis-collapsible-sidebar"
			/>
		);

		act( () => jest.advanceTimersByTime( 1000 ) );
		expect( focusSpy ).not.toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();

		document.body.removeChild( aiButton );
		document.body.removeChild( fallbackElement );
	} );

	it( "focuses the metabox readability tab for metabox location", () => {
		// Override useLocation to return metabox for this test.
		const useLocationModule = require( "../../../src/ai-generator/hooks/use-location" );
		useLocationModule.useLocation.mockReturnValue( "metabox" );

		useSelect.mockImplementation( ( fn ) =>
			fn( () => ( { getFocusAIFixesButtonId: () => "sentenceLengthAIFixes-metabox" } ) )
		);

		const fallbackElement = document.createElement( "a" );
		fallbackElement.id = "wpseo-meta-tab-readability";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		render(
			<AIOptimizeFocusFallback
				results={ [ { getIdentifier: () => "sentenceLength" } ] }
				fallbackElementId="wpseo-meta-tab-readability"
			/>
		);

		act( () => jest.advanceTimersByTime( 1000 ) );
		expect( focusSpy ).toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).toHaveBeenCalledWith( null );

		document.body.removeChild( fallbackElement );
		useLocationModule.useLocation.mockReturnValue( "sidebar" );
	} );
} );
