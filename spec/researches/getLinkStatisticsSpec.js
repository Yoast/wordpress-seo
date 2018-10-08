import Researcher from "../../src/researcher";
import morphologyData from "../../src/morphology/morphologyData.json";
import linkCount from "../../src/researches/getLinkStatistics.js";
import Paper from "../../src/values/Paper.js";
var foundLinks;

describe( "Tests a string for anchors and its attributes", function() {
	const paperAttributes = {
		keyword: "link",
		url: "http://yoast.com",
		permalink: "http://yoast.com",
	};

	it( "should detect internal links", function() {
		var mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 0 );
	} );

	it( "should detect external links", function() {
		var mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 1 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [ "<a href='http://example.com'>link</a>" ] );
	} );

	it( "should detect no keyword in link text", function() {
		var attributes = {
			keyword: "test",
			url: "http://yoast.com",
			permalink: "http://yoast.com",
		};

		var mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>link</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.keyword.totalKeyword ).toBe( 0 );
	} );

	it( "should detect nofollow as rel attribute", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow'>link</a>", paperAttributes );
		let researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow '>link</a>", paperAttributes );
		researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow'>link</a>", paperAttributes );
		researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow '>link</a>", paperAttributes );
		researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow with capitals", function() {
		var mockPaper = new Paper( "string <A HREF='http://example.com' REL='NOFOLLOW'>link</A>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow suffixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer'>link</a>", paperAttributes );
		let researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer noopener'>link</a>", paperAttributes );
		researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"noreferrer nofollow\">link</a>", paperAttributes );
		let researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=\"noopener noreferrer nofollow\">link</a>", paperAttributes );
		researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed and suffixed with some other argument in the rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel='external nofollow noreferrer'>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should allow nofollow as single argument without quotes", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=nofollow>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should ignore single argument without quotes when starting with nofollow", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=nofollowmoretext>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore tags ending in rel", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' horel=\"nofollow\">link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore nofollow outside of rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"\" nofollow>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore malformed rel tag", function() {
		var mockPaper = new Paper( "string <a href='http://example.com' rel=\"nofollow'>link</a>", paperAttributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );
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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		foundLinks = linkCount( mockPaper, researcher );
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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

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

	it( "should match different keyword forms in a url ", function() {
		var attributes = {
			keyword: "keyword",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keywords</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks.total ).toEqual( 1 );
		expect( foundLinks.totalNaKeyword ).toEqual( 0 );
		expect( foundLinks.keyword.totalKeyword ).toEqual( 1 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [ "<a href='http://example.com/keyword'>keywords</a>" ] );
	} );

	it( "should match all words from keyphrase in the link text and vice versa ", function() {
		var attributes = {
			keyword: "key word and key phrase",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keys wording phrased</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks.total ).toEqual( 1 );
		expect( foundLinks.totalNaKeyword ).toEqual( 0 );
		expect( foundLinks.keyword.totalKeyword ).toEqual( 1 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [ "<a href='http://example.com/keyword'>keys wording phrased</a>" ] );
	} );

	it( "should match all words from keyphrase in the link text and vice versa (including synonyms)", function() {
		var attributes = {
			keyword: "key word and key phrase",
			synonyms: "interesting article, and another exciting paper",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keys wording phrased</a>" +
			" as  well as the lovely <a href='http://example.com/keyword'>articles which are interesting</a>, " +
			"and <a href='http://example.com/keyword'>excited papers</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks.total ).toEqual( 3 );
		expect( foundLinks.totalNaKeyword ).toEqual( 0 );
		expect( foundLinks.keyword.totalKeyword ).toEqual( 3 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [
			"<a href='http://example.com/keyword'>keys wording phrased</a>",
			"<a href='http://example.com/keyword'>articles which are interesting</a>",
			"<a href='http://example.com/keyword'>excited papers</a>",
		] );
	} );

	it( "should not match partial overlap", function() {
		var attributes = {
			keyword: "key word and key phrase",
			synonyms: "interesting article, and another exciting paper",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
		};

		var mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keys wording </a>" +
			" as  well as the lovely <a href='http://example.com/keyword'>articles which are </a>, " +
			"and <a href='http://example.com/keyword'>excited papers</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks.total ).toEqual( 3 );
		expect( foundLinks.totalNaKeyword ).toEqual( 0 );
		expect( foundLinks.keyword.totalKeyword ).toEqual( 1 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [
			"<a href='http://example.com/keyword'>excited papers</a>",
		] );
	} );

	it( "for languages with function words but without morphology should filter the function words out", function() {
		var attributes = {
			keyword: "se promener dans la nature avantages",
			synonyms: "cycler nature",
			url: "http://example.org/keyword",
			permalink: "http://example.org/keyword",
			locale: "fr_FR",
		};

		var mockPaper = new Paper( "bonjour, c'est mon link pour  <a href='http://example.com/keyword'>promener avantages nature</a>" +
			" et un merveilleux <a href='http://example.com/keyword'>dans nature cycler </a>, " +
			" et aussi <a href='http://example.com/keyword'>qqch</a>", attributes );
		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks.total ).toEqual( 3 );
		expect( foundLinks.totalNaKeyword ).toEqual( 0 );
		expect( foundLinks.keyword.totalKeyword ).toEqual( 2 );
		expect( foundLinks.keyword.matchedAnchors ).toEqual( [
			"<a href='http://example.com/keyword'>promener avantages nature</a>",
			"<a href='http://example.com/keyword'>dans nature cycler </a>",
		] );
	} );
} );
