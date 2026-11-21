/* global elementor */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// @wordpress/data is a third-party module — its factory is called lazily after variable
// initialization, so const mock-prefixed variables work safely here.
const mockSetEditorDataContent = jest.fn();
const mockSetEditorDataTitle = jest.fn();
const mockSetEditorDataExcerpt = jest.fn();
const mockSetEditorDataImageUrl = jest.fn();
const mockSetContentImage = jest.fn();
const mockUpdateData = jest.fn();
const mockUpdateReplacementVariable = jest.fn();
const mockGetActiveMarker = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	dispatch: () => ( {
		setEditorDataContent: mockSetEditorDataContent,
		setEditorDataTitle: mockSetEditorDataTitle,
		setEditorDataExcerpt: mockSetEditorDataExcerpt,
		setEditorDataImageUrl: mockSetEditorDataImageUrl,
		setContentImage: mockSetContentImage,
		updateData: mockUpdateData,
		updateReplacementVariable: mockUpdateReplacementVariable,
	} ),
	select: () => ( {
		getActiveMarker: mockGetActiveMarker,
	} ),
} ) );

// Local modules — auto-mock only; import gives a reference to the jest.fn().
jest.mock( "../../src/elementor/helpers/is-form-id" );
jest.mock( "../../src/elementor-v4/editor-data" );

import { isFormIdEqualToDocumentId } from "../../src/elementor/helpers/is-form-id";
import { getEditorData } from "../../src/elementor-v4/editor-data";
import { handleEditorChange } from "../../src/elementor-v4/change-handler";

const makeCurrentDocument = ( type = "wp-post" ) => ( { config: { type } } );

const makeData = ( overrides = {} ) => ( {
	content: "",
	title: "",
	excerpt: "",
	excerptOnly: "",
	imageUrl: "",
	featuredImage: "",
	contentImage: "",
	...overrides,
} );

global.elementor = {
	documents: { getCurrent: jest.fn().mockReturnValue( makeCurrentDocument() ) },
};

beforeEach( () => {
	jest.clearAllMocks();
	mockGetActiveMarker.mockReturnValue( null );
	isFormIdEqualToDocumentId.mockReturnValue( true );
	elementor.documents.getCurrent.mockReturnValue( makeCurrentDocument() );
	getEditorData.mockReturnValue( makeData() );
} );

describe( "handleEditorChange — early exits", () => {
	it( "does nothing when the form ID does not match the document ID", () => {
		isFormIdEqualToDocumentId.mockReturnValue( false );

		handleEditorChange();

		expect( getEditorData ).not.toHaveBeenCalled();
		expect( mockSetEditorDataContent ).not.toHaveBeenCalled();
	} );

	it( "does nothing when the document type is not wp-post or wp-page", () => {
		elementor.documents.getCurrent.mockReturnValue( makeCurrentDocument( "landing-page" ) );

		handleEditorChange();

		expect( getEditorData ).not.toHaveBeenCalled();
	} );

	it( "does nothing when an active marker is set", () => {
		mockGetActiveMarker.mockReturnValue( "some-marker" );

		handleEditorChange();

		expect( getEditorData ).not.toHaveBeenCalled();
	} );

	it( "runs for wp-page document type", () => {
		elementor.documents.getCurrent.mockReturnValue( makeCurrentDocument( "wp-page" ) );
		getEditorData.mockReturnValue( makeData( { content: "page content" } ) );

		handleEditorChange();

		expect( getEditorData ).toHaveBeenCalled();
	} );
} );

describe( "handleEditorChange — dispatches changed fields", () => {
	it( "dispatches content when it changes", () => {
		getEditorData.mockReturnValue( makeData( { content: "<h1>Initial</h1>" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { content: "<h1>Updated</h1>" } ) );
		handleEditorChange();

		expect( mockSetEditorDataContent ).toHaveBeenCalledWith( "<h1>Updated</h1>" );
	} );

	it( "dispatches title when it changes", () => {
		getEditorData.mockReturnValue( makeData( { title: "Original" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { title: "Revised" } ) );
		handleEditorChange();

		expect( mockSetEditorDataTitle ).toHaveBeenCalledWith( "Revised" );
	} );

	it( "dispatches excerpt and both replacement variables when excerpt changes", () => {
		getEditorData.mockReturnValue( makeData( { excerpt: "First", excerptOnly: "First" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { excerpt: "Updated", excerptOnly: "Updated only" } ) );
		handleEditorChange();

		expect( mockSetEditorDataExcerpt ).toHaveBeenCalledWith( "Updated" );
		expect( mockUpdateReplacementVariable ).toHaveBeenCalledWith( "excerpt", "Updated" );
		expect( mockUpdateReplacementVariable ).toHaveBeenCalledWith( "excerpt_only", "Updated only" );
	} );

	it( "dispatches imageUrl when it changes", () => {
		getEditorData.mockReturnValue( makeData( { imageUrl: "https://example.com/old.jpg" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { imageUrl: "https://example.com/new.jpg" } ) );
		handleEditorChange();

		expect( mockSetEditorDataImageUrl ).toHaveBeenCalledWith( "https://example.com/new.jpg" );
	} );

	it( "dispatches contentImage when it changes", () => {
		getEditorData.mockReturnValue( makeData( { contentImage: "https://example.com/old.jpg" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { contentImage: "https://example.com/new.jpg" } ) );
		handleEditorChange();

		expect( mockSetContentImage ).toHaveBeenCalledWith( "https://example.com/new.jpg" );
	} );

	it( "dispatches featuredImage via updateData when it changes", () => {
		getEditorData.mockReturnValue( makeData( { featuredImage: "https://example.com/old.jpg" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { featuredImage: "https://example.com/new.jpg" } ) );
		handleEditorChange();

		expect( mockUpdateData ).toHaveBeenCalledWith( { snippetPreviewImageURL: "https://example.com/new.jpg" } );
	} );
} );

describe( "handleEditorChange — does not re-dispatch unchanged fields", () => {
	it( "does not dispatch any action when no field has changed", () => {
		const data = makeData( { content: "Same content", title: "Same title" } );
		getEditorData.mockReturnValue( data );

		handleEditorChange();
		jest.clearAllMocks();
		handleEditorChange();

		expect( mockSetEditorDataContent ).not.toHaveBeenCalled();
		expect( mockSetEditorDataTitle ).not.toHaveBeenCalled();
		expect( mockSetEditorDataExcerpt ).not.toHaveBeenCalled();
		expect( mockSetEditorDataImageUrl ).not.toHaveBeenCalled();
		expect( mockSetContentImage ).not.toHaveBeenCalled();
		expect( mockUpdateData ).not.toHaveBeenCalled();
	} );

	it( "dispatches only the field that changed, not unchanged siblings", () => {
		getEditorData.mockReturnValue( makeData( { content: "Content A", title: "Title A" } ) );
		handleEditorChange();

		jest.clearAllMocks();
		getEditorData.mockReturnValue( makeData( { content: "Content B", title: "Title A" } ) );
		handleEditorChange();

		expect( mockSetEditorDataContent ).toHaveBeenCalled();
		expect( mockSetEditorDataTitle ).not.toHaveBeenCalled();
	} );
} );
