import SchemaFields from "../../../src/helpers/fields/SchemaFields";

const createElement = ( id, value = "", dataDefault = "" ) => {
	const el = document.createElement( "input" );
	el.id = id;
	el.value = value;
	if ( dataDefault ) {
		el.setAttribute( "data-default", dataDefault );
	}
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
	it( "returns an empty string when the element is absent", () => {
		expect( SchemaFields.defaultArticleType ).toBe( "" );
	} );

	it( "returns the data-default attribute value", () => {
		createElement( "yoast_wpseo_schema_article_type", "", "Article" );
		expect( SchemaFields.defaultArticleType ).toBe( "Article" );
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
	it( "returns an empty string when the element is absent", () => {
		expect( SchemaFields.defaultPageType ).toBe( "" );
	} );

	it( "returns the data-default attribute value", () => {
		createElement( "yoast_wpseo_schema_page_type", "", "WebPage" );
		expect( SchemaFields.defaultPageType ).toBe( "WebPage" );
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
