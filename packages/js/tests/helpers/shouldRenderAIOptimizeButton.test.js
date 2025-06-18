import { select } from "@wordpress/data";
import { shouldRenderAIOptimizeButton } from "../../src/helpers/shouldRenderAIOptimizeButton";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

describe( "shouldRenderAIOptimizeButton", () => {
	beforeEach( () => {
		// Reset the document body class list before each test
		document.body.className = "";
	} );
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "should return false when editor type is classicEditor, regardless of other conditions", () => {
		select.mockReturnValue( {
			getEditorType: () => "classicEditor",
		} );

		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return true when hasAIFixes is true, isElementor is false, isTerm is false, not on an Elementor editor or Classic editor page", () => {
		select.mockReturnValue( {
			getEditorType: () => "blockEditor",
		} );
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( true );
	} );

	it( "should return false when hasAIFixes is false, regardless of other conditions", () => {
		select.mockReturnValue( {
			getEditorType: () => "blockEditor",
		} );
		const hasAIFixes = false;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when isElementor is true, regardless of other conditions", () => {
		select.mockReturnValue( {
			getEditorType: () => "blockEditor",
		} );
		const hasAIFixes = true;
		const isElementor = true;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when isTerm is true, regardless of other conditions", () => {
		select.mockReturnValue( {
			getEditorType: () => "blockEditor",
		} );
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = true;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );

	it( "should return false when on an Elementor editor page, regardless of other conditions", () => {
		select.mockReturnValue( {
			getEditorType: () => "blockEditor",
		} );
		document.body.classList.add( "elementor-editor-active" );
		const hasAIFixes = true;
		const isElementor = false;
		const isTerm = false;

		expect( shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm ) ).toBe( false );
	} );
} );
