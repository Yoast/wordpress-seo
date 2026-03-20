import { renderHook } from "@testing-library/react-hooks";
import useCommandPaletteCommands from "../../src/hooks/use-command-palette-commands";

const mockOpenGeneralSidebar = jest.fn();
const mockOpenEditorModal = jest.fn();
const mockUseCommand = jest.fn();

jest.mock( "@wordpress/commands", () => ( {
	useCommand: ( ...args ) => mockUseCommand( ...args ),
} ) );

jest.mock( "@wordpress/data", () => ( {
	useDispatch: ( store ) => {
		if ( store === "core/edit-post" ) {
			return { openGeneralSidebar: mockOpenGeneralSidebar };
		}
		if ( store === "yoast-seo/editor" ) {
			return { openEditorModal: mockOpenEditorModal };
		}
		return {};
	},
} ) );

jest.mock( "@wordpress/i18n", () => ( {
	__: ( str ) => str,
} ) );

jest.mock( "@wordpress/element", () => ( {
	useCallback: ( fn ) => fn,
} ) );

const defaultConfig = {
	isKeywordAnalysisActive: true,
	useOpenGraphData: true,
};

describe( "useCommandPaletteCommands", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "registers all 6 commands with the correct names and labels", () => {
		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		expect( mockUseCommand ).toHaveBeenCalledTimes( 6 );

		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/set-focus-keyphrase",
				label: "Yoast SEO: Set focus keyphrase",
			} )
		);
		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/edit-seo-title",
				label: "Yoast SEO: Edit SEO title",
			} )
		);
		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/edit-seo-description",
				label: "Yoast SEO: Edit meta description",
			} )
		);
		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/edit-social-title",
				label: "Yoast SEO: Edit social title",
			} )
		);
		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/edit-social-description",
				label: "Yoast SEO: Edit social description",
			} )
		);
		expect( mockUseCommand ).toHaveBeenCalledWith(
			expect.objectContaining( {
				name: "yoast-seo/edit-slug",
				label: "Yoast SEO: Edit slug",
			} )
		);
	} );

	it( "opens the Yoast sidebar when the focus keyphrase command is invoked", () => {
		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/set-focus-keyphrase" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
	} );

	it( "closes the command palette when the focus keyphrase command is invoked", () => {
		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/set-focus-keyphrase" );
		const close = jest.fn();
		call[ 0 ].callback( { close } );

		expect( close ).toHaveBeenCalledTimes( 1 );
	} );

	it( "focuses the keyphrase input element after the focus keyphrase callback is invoked", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/set-focus-keyphrase" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( document.getElementById ).toHaveBeenCalledWith( "focus-keyword-input-sidebar" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "opens the search appearance modal and focuses the title input for the SEO title command", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-seo-title" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
		expect( mockOpenEditorModal ).toHaveBeenCalledWith( "yoast-search-appearance-modal" );
		expect( document.getElementById ).toHaveBeenCalledWith( "yoast-google-preview-title-modal" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "opens the search appearance modal and focuses the description input for the SEO description command", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-seo-description" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
		expect( mockOpenEditorModal ).toHaveBeenCalledWith( "yoast-search-appearance-modal" );
		expect( document.getElementById ).toHaveBeenCalledWith( "yoast-google-preview-description-modal" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "opens the social appearance modal and focuses the title input for the social title command", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-title" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
		expect( mockOpenEditorModal ).toHaveBeenCalledWith( "yoast-social-appearance-modal" );
		expect( document.getElementById ).toHaveBeenCalledWith( "social-title-input-modal" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "opens the social appearance modal and focuses the description input for the social description command", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-description" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
		expect( mockOpenEditorModal ).toHaveBeenCalledWith( "yoast-social-appearance-modal" );
		expect( document.getElementById ).toHaveBeenCalledWith( "social-description-input-modal" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "opens the search appearance modal and focuses the slug input for the slug command", () => {
		const mockInput = { focus: jest.fn() };
		jest.spyOn( document, "getElementById" ).mockReturnValue( mockInput );
		jest.spyOn( window, "requestAnimationFrame" ).mockImplementation( ( cb ) => cb() );

		renderHook( () => useCommandPaletteCommands( defaultConfig ) );

		const call = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-slug" );
		call[ 0 ].callback( { close: jest.fn() } );

		expect( mockOpenGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
		expect( mockOpenEditorModal ).toHaveBeenCalledWith( "yoast-search-appearance-modal" );
		expect( document.getElementById ).toHaveBeenCalledWith( "yoast-google-preview-slug-modal" );
		expect( mockInput.focus ).toHaveBeenCalledTimes( 1 );

		window.requestAnimationFrame.mockRestore();
		document.getElementById.mockRestore();
	} );

	it( "registers the slug command as always enabled", () => {
		renderHook( () => useCommandPaletteCommands( { isKeywordAnalysisActive: false, useOpenGraphData: false } ) );

		const slugCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-slug" );

		expect( slugCall[ 0 ] ).not.toHaveProperty( "enabled" );
	} );

	it( "disables keyword-analysis commands when isKeywordAnalysisActive is false", () => {
		renderHook( () => useCommandPaletteCommands( { isKeywordAnalysisActive: false, useOpenGraphData: true } ) );

		const keyphraseCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/set-focus-keyphrase" );
		const seoTitleCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-seo-title" );
		const seoDescCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-seo-description" );

		expect( keyphraseCall[ 0 ].enabled ).toBe( false );
		expect( seoTitleCall[ 0 ].enabled ).toBe( false );
		expect( seoDescCall[ 0 ].enabled ).toBe( false );

		// Social commands should still be enabled.
		const socialTitleCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-title" );
		const socialDescCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-description" );

		expect( socialTitleCall[ 0 ].enabled ).toBe( true );
		expect( socialDescCall[ 0 ].enabled ).toBe( true );
	} );

	it( "disables social commands when useOpenGraphData is false", () => {
		renderHook( () => useCommandPaletteCommands( { isKeywordAnalysisActive: true, useOpenGraphData: false } ) );

		const socialTitleCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-title" );
		const socialDescCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/edit-social-description" );

		expect( socialTitleCall[ 0 ].enabled ).toBe( false );
		expect( socialDescCall[ 0 ].enabled ).toBe( false );

		// Keyword analysis commands should still be enabled.
		const keyphraseCall = mockUseCommand.mock.calls.find( ( [ arg ] ) => arg.name === "yoast-seo/set-focus-keyphrase" );

		expect( keyphraseCall[ 0 ].enabled ).toBe( true );
	} );
} );
