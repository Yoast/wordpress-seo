import Data from "../src/analysis/data.js";

let wpData = {};
let refresh =  () => {
	return true;
};
let data = new Data( wpData, refresh );

// Mocks the select function and .
const mockSelect = jest.fn();

// Mocks the getEditedPostAttribute function.
const mockGetEditedPostAttribute = jest.fn();

// Ensures mockSelect.getEditedPostAttribute is a function.
mockSelect.mockReturnValue( { getEditedPostAttribute: mockGetEditedPostAttribute } );

data._wpData.select = mockSelect;

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
		const retriever = ( attribute ) => {
			return attribute;
		};
		const expected = {
			content: "content",
			title: "title",
			slug: "slug",
			excerpt: "excerpt",
		};

		const actual = data.collectGutenbergData( retriever );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "refreshYoastSEO", () => {
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
