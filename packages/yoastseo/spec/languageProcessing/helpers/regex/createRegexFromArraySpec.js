/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-useless-escape */
import arrayToRegex from "../../../../src/languageProcessing/helpers/regex/createRegexFromArray.js";

describe( "a test creating a regex from an array with strings", function() {
	it( "adds start and end boundaries by default", function() {
		expect( arrayToRegex( [ "a", "b", "c" ] ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])a($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])b($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])c($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))/gi
		);
	} );

	it( "adds start and end boundaries when explicitly asked to not disable them", function() {
		expect( arrayToRegex( [ "a", "b", "c" ], false ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])a($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])b($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])c($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))/gi
		);
	} );

	it( "does not add start and end boundaries when explicitly asked to disable them", function() {
		expect( arrayToRegex( [ "a", "b", "c" ], true ) ).toEqual( /(a)|(b)|(c)/gi );
	} );

	it( "does well with regexifying words containing symbols that break regexes", function() {
		expect( arrayToRegex( [ "keyword*" ], false ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])keyword*($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))/gi
		);
	} );

	it( "adds a new word boundary", function() {
		expect( arrayToRegex( [ "a", "b", "c" ], false, "#" ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>'‘’‛`])a($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>'‘’‛`])b($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>'‘’‛`])c($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›#<>]))))/gi
		);
	} );

	it( "by default does not transliterate input words", function() {
		expect( arrayToRegex( [ "ä", "ß", "ç" ], false ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])ä($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])ß($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])ç($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))/gi
		);
	} );

	it( "transliterates input words on request", function() {
		expect( arrayToRegex( [ "ä", "ß", "ç" ], false, "", true ) ).toEqual(
			// eslint-disable-next-line max-len
			/((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])a($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])s($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))|((^|[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>'‘’‛`])c($|((?=[ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))|((['‘’‛`])([ \u00a0\u2014\u06d4\u061f\u060C\u061B\n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:/»«‹›<>]))))/gi
		);
	} );
} );
