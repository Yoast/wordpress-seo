import SchemaFields from "../../../src/helpers/fields/SchemaFields";
import { mockWindow } from "../../test-utils";

const createElement = ( id, value = "" ) => {
	const el = document.createElement( "input" );
	el.id = id;
	el.value = value;
	document.body.appendChild( el );
	return el;
};

afterEach( () => {
	document.body.innerHTML = "";
} );

describe( "articleTypeInput", () => {
	it( "returns null when the element is absent", () => {
		expect( SchemaFields.articleTypeInput ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createElement( "yoast_wpseo_schema_article_type" );
		expect( SchemaFields.articleTypeInput ).toBe( el );
	} );
} );

describe( "defaultArticleType", () => {
	it( "returns an empty string when wpseoScriptData is absent", () => {
		expect( SchemaFields.defaultArticleType ).toBe( "" );
	} );

	it( "returns the value from wpseoScriptData", () => {
		const spy = mockWindow( { wpseoScriptData: { metabox: { schema: { defaultArticleType: "Article" } } } } );
		expect( SchemaFields.defaultArticleType ).toBe( "Article" );
		spy.mockRestore();
	} );
} );

describe( "articleType getter", () => {
	it( "returns an empty string when the element is absent", () => {
		expect( SchemaFields.articleType ).toBe( "" );
	} );

	it( "returns the element value", () => {
		createElement( "yoast_wpseo_schema_article_type", "BlogPosting" );
		expect( SchemaFields.articleType ).toBe( "BlogPosting" );
	} );
} );

describe( "articleType setter", () => {
	it( "does nothing when the element is absent", () => {
		expect( () => {
			SchemaFields.articleType = "Article";
		} ).not.toThrow();
	} );

	it( "sets the element value", () => {
		createElement( "yoast_wpseo_schema_article_type" );
		SchemaFields.articleType = "NewsArticle";
		expect( SchemaFields.articleType ).toBe( "NewsArticle" );
	} );
} );

describe( "pageTypeInput", () => {
	it( "returns null when the element is absent", () => {
		expect( SchemaFields.pageTypeInput ).toBeNull();
	} );

	it( "returns the element when present", () => {
		const el = createElement( "yoast_wpseo_schema_page_type" );
		expect( SchemaFields.pageTypeInput ).toBe( el );
	} );
} );

describe( "defaultPageType", () => {
	it( "returns an empty string when wpseoScriptData is absent", () => {
		expect( SchemaFields.defaultPageType ).toBe( "" );
	} );

	it( "returns the value from wpseoScriptData", () => {
		const spy = mockWindow( { wpseoScriptData: { metabox: { schema: { defaultPageType: "WebPage" } } } } );
		expect( SchemaFields.defaultPageType ).toBe( "WebPage" );
		spy.mockRestore();
	} );
} );

describe( "pageType getter", () => {
	it( "returns an empty string when the element is absent", () => {
		expect( SchemaFields.pageType ).toBe( "" );
	} );

	it( "returns the element value", () => {
		createElement( "yoast_wpseo_schema_page_type", "AboutPage" );
		expect( SchemaFields.pageType ).toBe( "AboutPage" );
	} );
} );

describe( "pageType setter", () => {
	it( "does nothing when the element is absent", () => {
		expect( () => {
			SchemaFields.pageType = "WebPage";
		} ).not.toThrow();
	} );

	it( "sets the element value", () => {
		createElement( "yoast_wpseo_schema_page_type" );
		SchemaFields.pageType = "CollectionPage";
		expect( SchemaFields.pageType ).toBe( "CollectionPage" );
	} );
} );
