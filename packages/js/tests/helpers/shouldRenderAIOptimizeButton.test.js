// Import the function to test
import { shouldRenderAIOptimizeButton } from "../../src/helpers/shouldRenderAIOptimizeButton";

describe( "shouldRenderAIOptimizeButton", () => {
	beforeEach( () => {
		// Reset the document body class list before each test
		document.body.className = "";
	} );

	it( "should return true when hasAIFixes is true, isElementor is false, isTerm is false, and not on an Elementor editor page", () => {
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( true );
	} );

	it( "should return false when hasAIFixes is false, regardless of other conditions", () => {
		const hasAIFixes = false;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when isElementor is true, regardless of other conditions", () => {
		const hasAIFixes = true;
		const isElementor = true;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when isTerm is true, regardless of other conditions", () => {
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = true;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when on an Elementor editor page, regardless of other conditions", () => {
		document.body.classList.add( "elementor-editor-active" );
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when all conditions are false", () => {
		const hasAIFixes = false;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );
} );
