import SearchMetadataFields from "../../../src/helpers/fields/SearchMetadataFields";
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
		const el = createElement( "yoast_wpseo_title" );
		expect( SearchMetadataFields.titleElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_title" );
		expect( SearchMetadataFields.titleElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "descriptionElement", () => {
	it( "uses the post element ID when isPost is true", () => {
		const el = createElement( "yoast_wpseo_metadesc" );
		expect( SearchMetadataFields.descriptionElement ).toBe( el );
	} );

	it( "uses the term element ID when isPost is false", () => {
		const spy = mockWindow( { wpseoScriptData: { isPost: false } } );
		const el = createElement( "hidden_wpseo_desc" );
		expect( SearchMetadataFields.descriptionElement ).toBe( el );
		spy.mockRestore();
	} );
} );

describe( "slugElement", () => {
	it( "returns null when absent", () => {
		expect( SearchMetadataFields.slugElement ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createElement( "yoast_wpseo_slug" );
		expect( SearchMetadataFields.slugElement ).toBe( el );
	} );
} );

describe( "title", () => {
	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_title", "My Title" );
		expect( SearchMetadataFields.title ).toBe( "My Title" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_title" );
		SearchMetadataFields.title = "New Title";
		expect( el.value ).toBe( "New Title" );
	} );
} );

describe( "description", () => {
	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_metadesc", "My description" );
		expect( SearchMetadataFields.description ).toBe( "My description" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_metadesc" );
		SearchMetadataFields.description = "New description";
		expect( el.value ).toBe( "New description" );
	} );
} );

describe( "slug", () => {
	it( "gets the value from the element", () => {
		createElement( "yoast_wpseo_slug", "my-post" );
		expect( SearchMetadataFields.slug ).toBe( "my-post" );
	} );

	it( "sets the element value", () => {
		const el = createElement( "yoast_wpseo_slug" );
		SearchMetadataFields.slug = "new-slug";
		expect( el.value ).toBe( "new-slug" );
	} );
} );
