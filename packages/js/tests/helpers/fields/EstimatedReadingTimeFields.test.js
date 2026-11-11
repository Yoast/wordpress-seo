import EstimatedReadingTimeFields from "../../../src/helpers/fields/EstimatedReadingTimeFields";
import { createInputElement } from "../../test-utils";
import { addFilter } from "@wordpress/hooks";
import { metaKeyEstimatedReadingTime } from "../../../src/shared-admin/constants";

const ELEMENT_ID = "yoast_wpseo_estimated-reading-time-minutes";

const mockGetEditedPostAttribute = jest.fn();
const mockEditPost = jest.fn();
const mockEditEntityRecord = jest.fn();

jest.mock( "@wordpress/hooks", () => ( {
	addFilter: jest.fn(),
} ) );

jest.mock( "@wordpress/data", () => ( {
	select: ( store ) => {
		if ( store === "core/editor" ) {
			return { getEditedPostAttribute: mockGetEditedPostAttribute };
		}
		return {};
	},
	dispatch: ( store ) => {
		if ( store === "core/editor" ) {
			return { editPost: mockEditPost };
		}
		if ( store === "core" ) {
			return { editEntityRecord: mockEditEntityRecord };
		}
		return {};
	},
	subscribe: jest.fn( () => jest.fn() ),
} ) );

afterEach( () => {
	document.body.innerHTML = "";
	delete window.wpseoScriptData;
	mockEditPost.mockClear();
	mockEditEntityRecord.mockClear();
} );

describe( "estimatedReadingTimeElement", () => {
	it( "returns null when the element is absent", () => {
		expect( EstimatedReadingTimeFields.estimatedReadingTimeElement ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createInputElement( ELEMENT_ID );
		expect( EstimatedReadingTimeFields.estimatedReadingTimeElement ).toBe( el );
	} );
} );

describe( "estimatedReadingTime getter", () => {
	it( "returns an empty string when the element is absent", () => {
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "" );
	} );

	it( "returns the element value", () => {
		createInputElement( ELEMENT_ID, "5" );
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "5" );
	} );
} );

describe( "estimatedReadingTime setter", () => {
	it( "does nothing when the element is absent", () => {
		expect( () => {
			EstimatedReadingTimeFields.estimatedReadingTime = "5";
		} ).not.toThrow();
	} );

	it( "sets the element value", () => {
		createInputElement( ELEMENT_ID );
		EstimatedReadingTimeFields.estimatedReadingTime = "7";
		expect( EstimatedReadingTimeFields.estimatedReadingTime ).toBe( "7" );
	} );
} );

describe( "estimatedReadingTime REST meta mode", () => {
	const getScoreFilter = () =>
		addFilter.mock.calls.find( ( [ , namespace ] ) => namespace === "yoast/analysis-scores" )?.[ 2 ];

	const drainBuffer = () => getScoreFilter()?.( { meta: {} }, {} );

	beforeEach( () => {
		window.wpseoScriptData = { disableMetaboxInBlockEditor: true };
		mockGetEditedPostAttribute.mockReturnValue( {} );
		drainBuffer();
	} );

	it( "buffers the write without dispatching to core/editor", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyEstimatedReadingTime ]: "3" } );
		EstimatedReadingTimeFields.estimatedReadingTime = "5";

		expect( mockEditPost ).not.toHaveBeenCalled();
		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
	} );

	it( "injects the value into the save edits via the preSavePost filter", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyEstimatedReadingTime ]: "3" } );
		EstimatedReadingTimeFields.estimatedReadingTime = "5";

		const result = getScoreFilter()( { meta: {} }, {} );

		expect( result.meta[ metaKeyEstimatedReadingTime ] ).toBe( "5" );
	} );
} );
