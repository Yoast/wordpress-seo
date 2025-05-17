import TermDataCollector from "../../src/analysis/TermDataCollector";

describe( "a test for collecting data from a term", () => {
	afterEach( () => {
		jest.resetAllMocks();
	} );

	const args = {
		keyword: "keyword",
		title: "title",
		store: {
			getState: () => {
				return {
					analysisData: {
						snippet: {
							title: "title",
							description: "description",
						},
					},
				};
			},
		},
	};

	const termDataCollector = new TermDataCollector( args );
	it( "gets the base URL from wpseoScriptData", () => {
		window.wpseoScriptData = {
			metabox: {
				// eslint-disable-next-line camelcase
				base_url: "http://example.com",
			},
		};
		expect( termDataCollector.getBaseUrl() ).toBe( "http://example.com" );
	} );

	it( "gets the page title", () => {
		document.body.innerHTML = '<input type="hidden" id="hidden_wpseo_title" value="title" />';
		expect( termDataCollector.getSnippetTitle() ).toBe( "title" );
	} );

	it( "sets the data from the snippet to the hidden input field: 'hidden_wpseo_desc'", () => {
		document.body.innerHTML = '<input type="hidden" id="hidden_wpseo_desc" value="description" />';

		termDataCollector.setDataFromSnippet( "new description", "snippet_meta" );
		expect( document.getElementById( "hidden_wpseo_desc" ).value ).toBe( "new description" );
	} );

	it( "sets the data from the snippet to the hidden input field: 'slug'", () => {
		document.body.innerHTML = '<input type="hidden" id="slug" value="slug" />';
		termDataCollector.setDataFromSnippet( "new slug", "snippet_cite" );
		expect( document.getElementById( "slug" ).value ).toBe( "new slug" );
	} );

	it( "sets the data from the snippet to the hidden input field: 'hidden_wpseo_title'", () => {
		document.body.innerHTML = '<input type="hidden" id="hidden_wpseo_title" value="title" />';
		termDataCollector.setDataFromSnippet( "new title", "snippet_title" );
		expect( document.getElementById( "hidden_wpseo_title" ).value ).toBe( "new title" );
	} );

	it( "getKeyword: the element's value is not empty", () => {
		document.body.innerHTML = '<input type="hidden" id="hidden_wpseo_focuskw" value="cutest red panda" />';

		expect( termDataCollector.getKeyword() ).toBe( "cutest red panda" );
	} );

	it( "getKeyword: the element's value is empty", () => {
		document.body.innerHTML = '<input type="hidden" id="hidden_wpseo_focuskw" value="" />';

		expect( termDataCollector.getKeyword() ).toBe( "" );
	} );
} );
