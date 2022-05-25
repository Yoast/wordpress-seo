/*
 * \u00d7 - multiplication sign
 * \u002b - plus sign
 * \u0026 - ampersand
 * \u2014 - em-dash
 * \u06d4 - Urdu full stop
 * \u061f - Arabic question mark
 * \u060C - Arabic comma
 * \u061B - Arabic semicolon
 */
/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
export default function( text ) {
	const punctuationRegexString = "\\–\\-\\(\\)_\\[\\]’“”〝〞〟‟„\"'.?!:;,¿¡«»‹›\u00d7\u002b\u0026\u06d4\u2014\u061f\u060C\u061B\u3002\uff61" +
		"\uff01\u203c\uff1f\u2047\u2049\u2048\u2025\u2026\u30fb\u30fc\u3001\u3003\u3004\u3006\u3007\u3008\u3009\u300a\u300b\u300c\u300d\u300e" +
		"\u300f\u3010\u3011\u3012\u3013\u3014\u3015\u3016\u3017\u3018\u3019\u301a\u301b\u301c\u301d\u301e\u301f\u3020\u3036\u303c\u303d\uff5b" +
		"\uff5d\uff5c\uff5e\uff5f\uff60\uff62\uff63\uff64\uff3b\uff3d\uff65\uffe5\uff04\uff05\uff20\uff06\uff07\uff08\uff09\uff0a\uff0f\uff1a" +
		"\uff1b\uff1c\uff1e\uff3c\\<>";

	const punctuationRegexStart = new RegExp( "^[" + punctuationRegexString + "]+" );
	const punctuationRegexEnd = new RegExp( "[" + punctuationRegexString +  "]+$" );

	text = text.replace( punctuationRegexStart, "" );
	text = text.replace( punctuationRegexEnd, "" );

	return text;
}
