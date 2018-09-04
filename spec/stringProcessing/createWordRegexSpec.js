/* eslint-disable no-irregular-whitespace */
import createWordRegex from '../../src/stringProcessing/createWordRegex.js';

describe( "creates regex from keyword", function() {
	it( "returns a regex", function() {
		expect( createWordRegex( "keyword" ) ).toEqual(
			/(^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])keyword($|([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
	it( "returns a regex - words with diacritics", function() {
		expect( createWordRegex( "maïs", "", false ) ).toEqual(
			/(^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])maïs($|([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
		expect( createWordRegex( "Slovníček pojmû", "", false ) ).toEqual(
			/(^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])Slovníček pojmû($|([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
	it( "returns a regex - words with characters that break regexes", function() {
		expect( createWordRegex( "keyword*" ) ).toEqual(
			/(^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])keyword\*($|([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
} );
