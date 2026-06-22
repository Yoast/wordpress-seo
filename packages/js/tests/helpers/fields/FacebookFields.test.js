import FacebookFields from "../../../src/helpers/fields/FacebookFields";
import { mockWindow, createElement } from "../../test-utils";

beforeEach( () => {
	window.wpseoScriptData = { isPost: true };
} );

afterEach( () => {
	document.body.innerHTML = "";
	delete window.wpseoScriptData;
} );

describe( "titleElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createElement( "yoast_wpseo_opengraph-title" );
		expect( FacebookFields.titleElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_opengraph-title" );
		expect( FacebookFields.titleElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "descriptionElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createElement( "yoast_wpseo_opengraph-description" );
		expect( FacebookFields.descriptionElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_opengraph-description" );
		expect( FacebookFields.descriptionElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "imageIdElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createElement( "yoast_wpseo_opengraph-image-id" );
		expect( FacebookFields.imageIdElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_opengraph-image-id" );
		expect( FacebookFields.imageIdElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "imageUrlElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createElement( "yoast_wpseo_opengraph-image" );
		expect( FacebookFields.imageUrlElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_opengraph-image" );
		expect( FacebookFields.imageUrlElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "title", () => {
	it( "returns an empty string when element is absent", () => {
		expect( FacebookFields.title ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_opengraph-title", "OG Title" );
		expect( FacebookFields.title ).toBe( "OG Title" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_opengraph-title" );
		FacebookFields.title = "New OG Title";
		expect( el.value ).toBe( "New OG Title" );
	} );
} );

describe( "description", () => {
	it( "returns an empty string when element is absent", () => {
		expect( FacebookFields.description ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_opengraph-description", "OG description" );
		expect( FacebookFields.description ).toBe( "OG description" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_opengraph-description" );
		FacebookFields.description = "New OG description";
		expect( el.value ).toBe( "New OG description" );
	} );
} );

describe( "imageId", () => {
	it( "returns an empty string when element is absent", () => {
		expect( FacebookFields.imageId ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_opengraph-image-id", "42" );
		expect( FacebookFields.imageId ).toBe( "42" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_opengraph-image-id" );
		FacebookFields.imageId = "99";
		expect( el.value ).toBe( "99" );
	} );
} );

describe( "imageUrl", () => {
	it( "returns an empty string when element is absent", () => {
		expect( FacebookFields.imageUrl ).toBe( "" );
	} );

	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_opengraph-image", "https://example.com/img.jpg" );
		expect( FacebookFields.imageUrl ).toBe( "https://example.com/img.jpg" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_opengraph-image" );
		FacebookFields.imageUrl = "https://example.com/new.jpg";
		expect( el.value ).toBe( "https://example.com/new.jpg" );
	} );
} );
