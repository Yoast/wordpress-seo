import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import linkCount from "../../../src/languageProcessing/researches/getLinkStatistics.js";
import Paper from "../../../src/values/Paper.js";

let foundLinks;

describe( "Tests a string for anchors and its attributes", function() {
	const paperAttributes = {
		keyword: "link",
		permalink: "http://yoast.com",
	};

	it( "should detect internal links", function() {
		const mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 0 );
	} );

	it( "should detect external links", function() {
		const mockPaper = new Paper( "string <a href='http://yoast.com'>link</a>, <a href='http://example.com'>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 2 );
		expect( foundLinks.internalTotal ).toBe( 1 );
		expect( foundLinks.externalTotal ).toBe( 1 );
	} );

	it( "should detect nofollow as rel attribute", function() {
		let mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow'>link</a>", paperAttributes );
		let researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow '>link</a>", paperAttributes );
		researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow'>link</a>", paperAttributes );
		researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=' nofollow '>link</a>", paperAttributes );
		researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow with capitals", function() {
		const mockPaper = new Paper( "string <A HREF='http://example.com' REL='NOFOLLOW'>link</A>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow suffixed with some other argument in the rel tag", function() {
		let mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer'>link</a>", paperAttributes );
		let researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel='nofollow noreferrer noopener'>link</a>", paperAttributes );
		researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed with some other argument in the rel tag", function() {
		let mockPaper = new Paper( "string <a href='http://example.com' rel=\"noreferrer nofollow\">link</a>", paperAttributes );
		let researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );

		mockPaper = new Paper( "string <a href='http://example.com' rel=\"noopener noreferrer nofollow\">link</a>", paperAttributes );
		researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should detect nofollow prefixed and suffixed with some other argument in the rel tag", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' rel='external nofollow noreferrer'>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should allow nofollow as single argument without quotes", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' rel=nofollow>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 1 );
		expect( foundLinks.externalDofollow ).toBe( 0 );
	} );

	it( "should ignore single argument without quotes when starting with nofollow", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' rel=nofollowmoretext>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore tags ending in rel", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' horel=\"nofollow\">link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore nofollow outside of rel tag", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' rel=\"\" nofollow>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
		expect( foundLinks.externalDofollow ).toBe( 1 );
	} );

	it( "should ignore malformed rel tag", function() {
		const mockPaper = new Paper( "string <a href='http://example.com' rel=\"nofollow'>link</a>", paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );
		expect( foundLinks.total ).toBe( 1 );
		expect( foundLinks.externalNofollow ).toBe( 0 );
	} );

	it( "should return all special types", function() {
		const attributes = {
			keyword: "keyword",
			permalink: "http://example.org",
		};
		let mockPaper = new Paper( "hello", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks ).toEqual( {
			total: 0,
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

	it( "should match without a keyword", function() {
		const attributes = {
			keyword: "",
			permalink: "http://example.org/keyword#top",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword#top'>keyword</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		foundLinks = linkCount( mockPaper, researcher );

		expect( foundLinks ).toEqual( {
			total: 1,
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

