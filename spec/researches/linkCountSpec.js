var linkCount = require( "../../js/researches/getLinkStatistics.js" );
var Paper = require( "../../js/values/Paper.js" );
var foundLinks;

describe("Tests a string for anchors and analyzes these", function(){
	it("returns an object with all linktypes found", function(){
		var attributes = {
			keyword: "test",
			url: "http://yoast.com"
		};
		var mockPaper = new Paper("string <a href='http://yoast.com'>link</a>", attributes );

		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 0 );
		expect( foundLinks.totalKeyword ).toBe( 0 );

		attributes = {
			keyword: "link",
			url: "http://yoast.com"
		};

		mockPaper = new Paper("string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
		expect( foundLinks.totalKeyword ).toBe( 2 );


		mockPaper = new Paper( "string <a href='ftp://yoast.com'>link</a>, <a href='http://example.com' rel='nofollow'>link</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.otherTotal ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
	});

	it( "should return all special types", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org"
		};
		var mockPaper = new Paper( "hello", attributes );

		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toEqual({
			total: 0,
			totalNaKeyword: 0,
			totalKeyword: 0,
			internalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 0,
			externalTotal: 0,
			externalDofollow: 0,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0
		});

		mockPaper = new Paper("<a href='http://example.org/test123'>test123</a>" +
			"<a href='http://example.org/test123' rel='nofollow'>test123</a>" +
			"<a href='http://example.org/test123'>keyword</a>" +
			"<a href='http://yoast.com' rel='nofollow'>test123</a>" +
			"<a href='http://yoast.com'>test123</a>" +
			"<a href='http://yoast.com'>keyword</a>" +
			"<a href='#blaat'>blaat</a>" +
			"<a href='#bar' rel='nofollow'>bar</a>'" +
			"" +
			"" +
			"", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toEqual({
			total: 8,
			totalNaKeyword: 0,
			totalKeyword: 2,
			internalTotal: 3,
			internalDofollow: 2,
			internalNofollow: 1,
			externalTotal: 3,
			externalDofollow: 2,
			externalNofollow: 1,
			otherTotal: 2,
			otherDofollow: 1,
			otherNofollow: 1
		});
	});
});
