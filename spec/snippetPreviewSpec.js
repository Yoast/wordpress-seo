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

describe( "The SnippetPreview format functions", function(){
	it( "formats texts to use in the SnippetPreview", function(){
		// Makes lodash think this is a valid HTML element
		var mockElement = [];
		mockElement.nodeType = 1;

		var mockApp = {
			rawData: {
				snippetTitle: "<span>snippetTitle</span>",
				snippetCite: "",
				snippetMeta: "",
				keyword: "keyword"
			},
			pluggable: {
				loaded: true,
				_applyModifications: function(name, text){return text}
			}
		};

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect( snippetPreview.formatTitle() ).toBe( "snippetTitle" );
	});
} );
