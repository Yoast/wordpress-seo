import { applyPluggableReplacementVariables } from "../../../src/ai-generator/helpers";
import { mockWindow } from "../../test-utils";
import { EDIT_TYPE } from "../../../src/ai-generator/constants";

jest.mock( "yoastseo", () => ( {
	languageProcessing: {
		stripHTMLTags: jest.fn(),
		stripSpaces: jest.fn(),
	},
} ) );
import { languageProcessing } from "yoastseo";

describe( "applyPluggableReplacementVariables", () => {
	beforeEach( () => {
		// Reset all mocks before each test
		jest.resetAllMocks();
	} );

	it( "should apply replacements for title", () => {
		const mockContent = "   <h1>Title with spaces and HTML</h1>   ";
		const expectedContent = "Title with spaces and HTML";
		const mockApplyReplaceUsingPlugin = jest.fn( ()=> ( { title: expectedContent, description: "" } ) );
		const stripSpaces = jest.fn( () => expectedContent );

		const windowSpy = mockWindow( { yoast: {
			editorModules: {
				helpers: {
					replacementVariableHelpers: {
						applyReplaceUsingPlugin: mockApplyReplaceUsingPlugin,
					},
				} } } }
		);

		jest.spyOn( languageProcessing, "stripSpaces" ).mockImplementation( stripSpaces );

		const result = applyPluggableReplacementVariables( mockContent, EDIT_TYPE.title );

		expect( result ).toEqual( expectedContent );
		expect( stripSpaces ).toHaveBeenCalledWith( mockContent );
		expect( mockApplyReplaceUsingPlugin ).toHaveBeenCalledWith( { title: "", description: "", [ EDIT_TYPE.title ]: expectedContent } );

		windowSpy.mockRestore();
	} );

	it( "should apply replacements for description", () => {
		const mockContent = "   <p>Description with spaces and HTML</p>   ";
		const expectedContent = "Description with spaces and HTML";
		const mockApplyReplaceUsingPlugin = jest.fn( ()=> ( { title: "", description: expectedContent } ) );
		const stripSpaces = jest.fn( () => expectedContent );

		const windowSpy = mockWindow( { yoast: {
			editorModules: {
				helpers: {
					replacementVariableHelpers: {
						applyReplaceUsingPlugin: mockApplyReplaceUsingPlugin,
					},
				} } } }
		);

		jest.spyOn( languageProcessing, "stripSpaces" ).mockImplementation( stripSpaces );

		const result = applyPluggableReplacementVariables( mockContent, EDIT_TYPE.description );

		expect( result ).toEqual( expectedContent );
		expect( stripSpaces ).toHaveBeenCalledWith( mockContent );
		expect( mockApplyReplaceUsingPlugin ).toHaveBeenCalledWith( { title: "", description: "", [ EDIT_TYPE.description ]: expectedContent } );

		windowSpy.mockRestore();
	} );

	it( "should apply replacements for title with out adding editType to the function", () => {
		const mockContent = "   <h1>Title with spaces and HTML</h1>   ";
		const expectedContent = "Title with spaces and HTML";
		const mockApplyReplaceUsingPlugin = jest.fn( ()=> ( { title: expectedContent, description: "" } ) );
		const stripSpaces = jest.fn( () => expectedContent );

		const windowSpy = mockWindow( { yoast: {
			editorModules: {
				helpers: {
					replacementVariableHelpers: {
						applyReplaceUsingPlugin: mockApplyReplaceUsingPlugin,
					},
				} } } }
		);

		jest.spyOn( languageProcessing, "stripSpaces" ).mockImplementation( stripSpaces );

		const result = applyPluggableReplacementVariables( mockContent );

		expect( result ).toEqual( expectedContent );
		expect( stripSpaces ).toHaveBeenCalledWith( mockContent );
		expect( mockApplyReplaceUsingPlugin ).toHaveBeenCalledWith( { title: "", description: "", [ EDIT_TYPE.title ]: expectedContent } );

		windowSpy.mockRestore();
	} );
} );
