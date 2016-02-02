var SnippetPreview = require("../js/snippetPreview.js");
require("../js/app.js");

describe("The snippet preview constructor", function() {
	it("accepts an App object as an opts property", function() {
		var mockApp = {
			rawData: {
				snippetTitle: "",
				snippetCite: "",
				snippetMeta: ""
			}
		};
		// Makes lodash think this is a valid HTML element
		var mockElement = [];
		mockElement.nodeType = 1;

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect(snippetPreview.refObj).toBe(mockApp);
	})
});

describe( "Adds dashes to the keyword for highlighting in the snippet", function() {
	it( "returns a keyword with strong tags", function() {
		var mockApp = {
			rawData: {
				keyword: "keyword"
			}
		};
		var mockElement = [];
		mockElement.nodeType = 1;

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect(snippetPreview.formatKeyword( "this is a keyword" ) ).toBe( "this is a<strong> keyword</strong>" );
	});
});

describe( "Adds dashes to the keyword for highlighting in the snippet", function() {
	it( "returns a keyword with strong tags", function() {
		var mockApp = {
			rawData: {
				keyword: "key-word"
			}
		};
		var mockElement = [];
		mockElement.nodeType = 1;

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect(snippetPreview.formatKeyword( "this is a key-word with dash" ) ).toBe( "this is a<strong> key-word </strong>with dash" );
	});
});