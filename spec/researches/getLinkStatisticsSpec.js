import linkCount from '../../src/researches/getLinkStatistics.js';
import Paper from '../../src/values/Paper.js';
var foundLinks;

describe( "Tests a string for anchors and its attributes", function() {
	const paperAttributes = {
		keyword: "link",
		url: "http://yoast.com",
		permalink: "http://yoast.com",
	};

	it( "should detect internal links", function() {
		var mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 0 );
	} );

	it( "should detect external links", function() {
		var mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 1 );
	} );

	it( "should detect no keyword in link text", function() {
		var attributes = {
			keyword: "test",
			url: "http://yoast.com",
			permalink: "http://yoast.com",
		};

		var mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>link</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 0 );
	} );

	it( "should detect the keyword in internal link text", function() {
		var attributes = {
			keyword: "focuskeyword",
			url: "http://yoast.com",
			permalink: "http://yoast.com",
		};

		var mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>focuskeyword</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 1 );
	} );

	it( "should detect the keyword in external link text", function() {
		var attributes = {
			keyword: "focuskeyword",
			url: "http://yoast.com",
			permalink: "http://yoast.com",
		};

		var mockPaper = new Paper( "string <a href='http://example.com/some-page/'>focuskeyword</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 1 );
	} );

	it( "should not detect the keyword in link text which links to itself", function() {
		var attributes = {
			keyword: "focuskeyword",
			url: "http://yoast.com/this-page/",
			permalink: "http://yoast.com/this-page/",
		};

		var mockPaper = new Paper( "string <a href='http://yoast.com/this-page/'>focuskeyword</a>", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 0 );
	} );

	it( "should detect nofollow as rel attribute", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow '>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow '>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow with capitals", function() {
		var mockPaper = new Paper( "string <A HREF='http://example.com' REL='NOFOLLOW'>link</A>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow suffixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer noopener'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"noreferrer nofollow\">link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=\"noopener noreferrer nofollow\">link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed and suffixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='external nofollow noreferrer'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should allow nofollow as single argument without quotes", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=nofollow>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should ignore single argument without quotes when starting with nofollow", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=nofollowmoretext>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore tags ending in rel", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' horel=\"nofollow\">link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore nofollow outside of rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"\" nofollow>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore malformed rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"nofollow'>link</a>", paperAttributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
	} );

	it( "should return all special types", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org",
			permalink: "http://example.org",
		};
		var mockPaper = new Paper( "hello", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 0,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 0,
			externalTotal: 0,
			externalDofollow: 0,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );

		mockPaper = new Paper( "<a href='http://example.org/test123'>test123</a>" +
							   "<a href='http://example.org/test123' rel='nofollow'>test123</a>" +
							   "<a href='http://example.org/test123'>keyword</a>" +
							   "<a href='http://yoast.com' rel='nofollow'>test123</a>" +
							   "<a href='http://yoast.com'>test123</a>" +
							   "<a href='http://yoast.com'>keyword</a>" +
							   "<a href='#foo'>foo</a>" +
							   "<a href='#bar' rel='nofollow'>bar</a>'" +
							   "" +
							   "" +
							   "", attributes );
		foundLinks = linkCount( mockPaper );
		expect( foundLinks ).toEqual( {
			total: 8,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 2,
				matchedAnchors: [
					"<a href='http://example.org/test123'>keyword</a>",
					"<a href='http://yoast.com'>keyword</a>",
				],
			},
			internalTotal: 3,
			internalDofollow: 2,
			internalNofollow: 1,
			externalTotal: 3,
			externalDofollow: 2,
			externalNofollow: 1,
			otherTotal: 2,
			otherDofollow: 1,
			otherNofollow: 1,
		} );
	} );

	it( "should ignore the keyword in an url when referencing to the current url", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.org/keyword'>Keyword</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 1,
			internalDofollow: 1,
			internalNofollow: 0,
			externalTotal: 0,
			externalDofollow: 0,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );

	it( "should ignore the keyword in an url when referencing to the current url with a hash", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword#top",
			permalink: "http://example.org/keyword#top",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.org/keyword'>Keyword</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 1,
			internalDofollow: 1,
			internalNofollow: 0,
			externalTotal: 0,
			externalDofollow: 0,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );

	it( "should ignore the keyword in an url with a hash when referencing to the current url", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.org/keyword#top'>resume</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 1,
			internalDofollow: 1,
			internalNofollow: 0,
			externalTotal: 0,
			externalDofollow: 0,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );

	it( "should match the keyword in an url with a hash", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword#top'>resume</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 0,
			externalTotal: 1,
			externalDofollow: 1,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );

	it( "should match the keyword in an url with a hash in the current url", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword#top",
			permalink: "http://example.org/keyword#top",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword#top'>keyword</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 1,
				matchedAnchors: [ "<a href='http://example.com/keyword#top'>keyword</a>" ],
			},
			internalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 0,
			externalTotal: 1,
			externalDofollow: 1,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );

	it( "should match without a keyword", function() {
		var attributes = {
			keyword: "",
			url: "http://example.org/keyword#top",
			permalink: "http://example.org/keyword#top",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword#top'>keyword</a>", attributes );

		foundLinks = linkCount( mockPaper );

		expect( foundLinks ).toEqual( {
			total: 1,
			totalNaKeyword: 0,
			keyword: {
				totalKeyword: 0,
				matchedAnchors: [],
			},
			internalTotal: 0,
			internalDofollow: 0,
			internalNofollow: 0,
			externalTotal: 1,
			externalDofollow: 1,
			externalNofollow: 0,
			otherTotal: 0,
			otherDofollow: 0,
			otherNofollow: 0,
		} );
	} );
} );
