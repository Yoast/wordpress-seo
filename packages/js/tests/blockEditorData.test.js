// Mock the jQuery global before importing data.
global.jQuery = {};

import BlockEditorData from "../src/analysis/blockEditorData.js";

const refresh = () => {
	return true;
};
const store = {
	dispatch: jest.fn(),
};

// Mocks the getEditedPostAttribute/getBlocks functions.
const mockGetEditedPostAttribute = jest.fn().mockImplementation( value => value );
const mockGetBlocks = jest.fn().mockImplementation( value => value );

jest.mock( "@wordpress/data", () => {
	return {
		select: () => {
			return {
				getEditedPostAttribute: mockGetEditedPostAttribute,
				getEditedPostContent: jest.fn().mockReturnValue( "test block test" ),
				getActiveMarker: () => null,
				getPermalinkParts: jest.fn().mockReturnValue( { prefix: "https://www.yoast.com/", postName: "", suffix: "/" } ),
				isEditedPostNew: jest.fn().mockReturnValue( false ),
				getBlocks: mockGetBlocks,
			};
		},
		subscribe: () => {},
		combineReducers: jest.requireActual( "@wordpress/data" ).combineReducers,
	};
} );

jest.mock( "@wordpress/blocks", () => {
	return {
		getBlockContent: jest.fn().mockReturnValue( "test classic test" ),
	};
} );

const data = new BlockEditorData( refresh, store );

describe( "setRefresh", () => {
	it( "sets the refresh function", () => {
		const expected = () => {
			return "refresh";
		};
		data.setRefresh( expected );

		const actual = data._refresh;
		expect( actual ).toBe( expected );
	} );
} );

describe( "isShallowEqual", () => {
	it( "returns true if two objects contain the same key value pairs", () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key2: "value2",
			key1: "value1",
		};
		const actual = data.isShallowEqual( object1, object2 );
		expect( actual ).toBe( true );
	} );
	it( "returns false if two objects contain the same keys but 1 value differs", () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key2: "value2b",
			key1: "value1",
		};
		const actual = data.isShallowEqual( object1, object2 );
		expect( actual ).toBe( false );
	} );
	it( "returns false if two objects don't contain the same keys value pairs", () => {
		const object1 = {
			key1: "value1",
			key2: "value2",
		};
		const object2 = {
			key3: "value2",
			key1: "value1",
		};
		const actual = data.isShallowEqual( object1, object2 );
		expect( actual ).toBe( false );
	} );
} );

describe( "getPostAttribute", () => {
	it( "gets the post attribute", () => {
		data.getPostAttribute( "content" );
		expect( mockGetEditedPostAttribute ).toBeCalledWith( "content" );
	} );
} );

describe( "collectGutenbergData", () => {
	it( "collects the GutenbergData", () => {
		const expected = {
			content: "test block test",
			contentImage: "",
			title: "title",
			slug: "slug",
			excerpt: "excerpt",
			// eslint-disable-next-line camelcase
			excerpt_only: "excerpt",
			snippetPreviewImageURL: "featured-image",
			baseUrl: "https://www.yoast.com/",
		};

		const mockGetFeaturedImage = jest.fn();
		mockGetFeaturedImage.mockReturnValue( "featured-image" );
		data.getFeaturedImage = mockGetFeaturedImage;

		mockGetBlocks.mockReturnValueOnce( [ { name: "core/paragraph" } ] );

		const actual = data.collectGutenbergData();
		expect( actual ).toEqual( expected );
	} );

	it( "collects the GutenbergData when the post has been converted from the Classic editor", () => {
		const expected = {
			content: "test classic test",
			contentImage: "",
			title: "title",
			slug: "slug",
			excerpt: "excerpt",
			// eslint-disable-next-line camelcase
			excerpt_only: "excerpt",
			snippetPreviewImageURL: "featured-image",
			baseUrl: "https://www.yoast.com/",
		};

		mockGetBlocks.mockReturnValueOnce( [ { name: "core/freeform" } ] );

		const actual = data.collectGutenbergData();
		expect( actual ).toEqual( expected );
	} );
} );

describe( "refreshYoastSEO", () => {
	beforeEach( () =>
		mockGetBlocks.mockReturnValueOnce( [ { name: "core/paragraph" } ] )
	);

	/*
		After the first call of collectGutenbergData in refreshYoastSEO, the Gutenberg data is always dirty,
		because data is initially an empty object.
	*/
	it( "refreshes YoastSEO when the Gutenberg data is dirty", () => {
		const mockRefresh = jest.fn();
		data._refresh = mockRefresh;
		data.refreshYoastSEO();
		expect( mockRefresh ).toBeCalled();
	} );

	/*
		After collectGutenbergData is called a second time, and nothing has changed,
		the data isn't dirty and the refresh function shouldn't be called.
	*/
	it( "doesn't refresh YoastSEO when the Gutenberg data is not dirty", () => {
		const mockRefresh2 = jest.fn();
		data._refresh = mockRefresh2;
		data.refreshYoastSEO();
		expect( mockRefresh2 ).not.toBeCalled();
	} );
} );

describe( "getData", () => {
	it( "returns the data", () => {
		data._data = { content: "this is the content" };
		const actual = data.getData();
		const expected = { content: "this is the content" };
		expect( actual ).toEqual( expected );
	} );
} );
