import TwitterFields from "../../../src/helpers/fields/TwitterFields";
import { mockWindow, createInputElement } from "../../test-utils";

beforeEach( () => {
	window.wpseoScriptData = { isPost: true };
} );

afterEach( () => {
	document.body.innerHTML = "";
	delete window.wpseoScriptData;
} );

describe( "titleElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_twitter-title" );
		expect( TwitterFields.titleElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createInputElement( "hidden_wpseo_twitter-title" );
		expect( TwitterFields.titleElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "descriptionElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_twitter-description" );
		expect( TwitterFields.descriptionElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createInputElement( "hidden_wpseo_twitter-description" );
		expect( TwitterFields.descriptionElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "imageIdElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_twitter-image-id" );
		expect( TwitterFields.imageIdElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createInputElement( "hidden_wpseo_twitter-image-id" );
		expect( TwitterFields.imageIdElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "imageUrlElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createInputElement( "yoast_wpseo_twitter-image" );
		expect( TwitterFields.imageUrlElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createInputElement( "hidden_wpseo_twitter-image" );
		expect( TwitterFields.imageUrlElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "title", () => {
	it( "returns an empty string when element is absent", () => {
		expect( TwitterFields.title ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_twitter-title", "Twitter Title" );
		expect( TwitterFields.title ).toBe( "Twitter Title" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_twitter-title" );
		TwitterFields.title = "New Twitter Title";
		expect( el.value ).toBe( "New Twitter Title" );
	} );
} );

describe( "description", () => {
	it( "returns an empty string when element is absent", () => {
		expect( TwitterFields.description ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_twitter-description", "Twitter description" );
		expect( TwitterFields.description ).toBe( "Twitter description" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_twitter-description" );
		TwitterFields.description = "New Twitter description";
		expect( el.value ).toBe( "New Twitter description" );
	} );
} );

describe( "imageId", () => {
	it( "returns an empty string when element is absent", () => {
		expect( TwitterFields.imageId ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_twitter-image-id", "42" );
		expect( TwitterFields.imageId ).toBe( "42" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_twitter-image-id" );
		TwitterFields.imageId = "99";
		expect( el.value ).toBe( "99" );
	} );
} );

describe( "imageUrl", () => {
	it( "returns an empty string when element is absent", () => {
		expect( TwitterFields.imageUrl ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createInputElement( "yoast_wpseo_twitter-image", "https://example.com/img.jpg" );
		expect( TwitterFields.imageUrl ).toBe( "https://example.com/img.jpg" );
	} );

	it( "sets the element value", () => {
		const el = createInputElement( "yoast_wpseo_twitter-image" );
		TwitterFields.imageUrl = "https://example.com/new.jpg";
		expect( el.value ).toBe( "https://example.com/new.jpg" );
	} );
} );
