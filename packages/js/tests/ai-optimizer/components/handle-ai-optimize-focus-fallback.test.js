/**
 * @jest-environment jsdom
 */
import { dispatch } from "@wordpress/data";
import handleAIOptimizeFocusFallback from "../../../src/helpers/handle-ai-optimize-focus-fallback";

jest.mock( "@wordpress/data", () => {
	return {
		dispatch: jest.fn(),
		combineReducers: jest.fn(),
		registerStore: jest.fn(),
	};
} );

describe( "handleAIOptimizeFocusFallback", () => {
	let setFocusAIFixesButtonId;
	let timerRef;

	beforeEach( () => {
		jest.useFakeTimers();
		setFocusAIFixesButtonId = jest.fn();
		dispatch.mockReturnValue( { setFocusAIFixesButtonId } );
		timerRef = { current: null };
	} );

	afterEach( () => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	} );

	it( "does nothing when focusAIButtonId is null", () => {
		handleAIOptimizeFocusFallback( {
			focusAIButtonId: null,
			locationContext: "sidebar",
			results: [ { getIdentifier: () => "keyphraseInIntroduction" } ],
			fallbackElementId: "yoast-seo-analysis-collapsible-sidebar",
			timerRef,
		} );

		jest.advanceTimersByTime( 200 );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "does nothing when focusAIButtonId targets a different location", () => {
		handleAIOptimizeFocusFallback( {
			focusAIButtonId: "keyphraseInIntroductionAIFixes-metabox",
			locationContext: "sidebar",
			results: [ { getIdentifier: () => "keyphraseInIntroduction" } ],
			fallbackElementId: "yoast-seo-analysis-collapsible-sidebar",
			timerRef,
		} );

		jest.advanceTimersByTime( 200 );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "does nothing when the assessment is not in this section's results", () => {
		handleAIOptimizeFocusFallback( {
			focusAIButtonId: "sentenceLengthAIFixes-sidebar",
			locationContext: "sidebar",
			results: [ { getIdentifier: () => "keyphraseInIntroduction" } ],
			fallbackElementId: "yoast-seo-analysis-collapsible-sidebar",
			timerRef,
		} );

		jest.advanceTimersByTime( 200 );
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();
	} );

	it( "focuses the fallback element when the AI button is not in the DOM", () => {
		const fallbackElement = document.createElement( "button" );
		fallbackElement.id = "yoast-seo-analysis-collapsible-sidebar";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		handleAIOptimizeFocusFallback( {
			focusAIButtonId: "keyphraseInIntroductionAIFixes-sidebar",
			locationContext: "sidebar",
			results: [ { getIdentifier: () => "keyphraseInIntroduction" } ],
			fallbackElementId: "yoast-seo-analysis-collapsible-sidebar",
			timerRef,
		} );

		jest.advanceTimersByTime( 100 );
		expect( focusSpy ).toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).toHaveBeenCalledWith( null );

		document.body.removeChild( fallbackElement );
	} );

	it( "does not focus fallback when the AI button is present in the DOM", () => {
		const aiButton = document.createElement( "button" );
		aiButton.id = "keyphraseInIntroductionAIFixes-sidebar";
		document.body.appendChild( aiButton );

		const fallbackElement = document.createElement( "button" );
		fallbackElement.id = "yoast-seo-analysis-collapsible-sidebar";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		handleAIOptimizeFocusFallback( {
			focusAIButtonId: "keyphraseInIntroductionAIFixes-sidebar",
			locationContext: "sidebar",
			results: [ { getIdentifier: () => "keyphraseInIntroduction" } ],
			fallbackElementId: "yoast-seo-analysis-collapsible-sidebar",
			timerRef,
		} );

		jest.advanceTimersByTime( 100 );
		expect( focusSpy ).not.toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).not.toHaveBeenCalled();

		document.body.removeChild( aiButton );
		document.body.removeChild( fallbackElement );
	} );

	it( "focuses the metabox readability tab for metabox location", () => {
		const fallbackElement = document.createElement( "a" );
		fallbackElement.id = "wpseo-meta-tab-readability";
		document.body.appendChild( fallbackElement );
		const focusSpy = jest.spyOn( fallbackElement, "focus" );

		handleAIOptimizeFocusFallback( {
			focusAIButtonId: "sentenceLengthAIFixes-metabox",
			locationContext: "metabox",
			results: [ { getIdentifier: () => "sentenceLength" } ],
			fallbackElementId: "wpseo-meta-tab-readability",
			timerRef,
		} );

		jest.advanceTimersByTime( 100 );
		expect( focusSpy ).toHaveBeenCalled();
		expect( setFocusAIFixesButtonId ).toHaveBeenCalledWith( null );

		document.body.removeChild( fallbackElement );
	} );
} );
