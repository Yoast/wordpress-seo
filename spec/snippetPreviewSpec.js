var SnippetPreview = require("../js/snippetPreview.js");
require("../js/app.js");
require("./helpers/i18n.js");

describe("The snippet preview constructor", function() {
	// Test for backwards compatibility
	it("accepts an App object as it's argument", function() {
		var app = Factory.buildApp({});

		var snippetPreview = new SnippetPreview(app);

		expect(snippetPreview.refObj).toBe(app);
	});

	it("accepts an App object as an opts property", function() {
		var app = Factory.buildApp({});

		var snippetPreview = new SnippetPreview({
			analyzerApp: app
		});
		expect(snippetPreview.refObj).toBe(app);
	})
});
