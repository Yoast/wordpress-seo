import addWordBoundary from "../../../../src/languageProcessing/helpers/word/addWordboundary";
import { wordBoundariesStringForRegex } from "../../../../src/config/punctuation";

describe( "a test adding word boundaries to a string", function() {
	// const wordBoundary = "(^|[\\ \\\\    \\\\ \\\"\\»\\«\\”\\“\\〝\\〞\\〟\\‟\\„\\『\\』\\‘\\’\\‛\\`\\.\\,\\(\\)\\+\\;\\!\\?\\:\\/\\<\\>\\¡\\¿\\—\\۔\\؟\\،\\؛\\ '‘’‛`])keyword($|([\\ \\\\    \\\\ \\\"\\»\\«\\”\\“\\〝\\〞\\〟\\‟\\„\\『\\』\\‘\\’\\‛\\`\\.\\,\\(\\)\\+\\;\\!\\?\\:\\/\\<\\>\\¡\\¿\\—\\۔\\؟\\،\\؛\\ ])|((['‘’‛`])([\\ \\\\    \\\\ \\\"\\»\\«\\”\\“\\〝\\〞\\〟\\‟\\„\\『\\』\\‘\\’\\‛\\`\\.\\,\\(\\)\\+\\;\\!\\?\\:\\/\\<\\>\\¡\\¿\\—\\۔\\؟\\،\\؛\\
	const wordBoundary = wordBoundariesStringForRegex;
	it( "adds start and end boundaries", function() {
		expect( addWordBoundary( "keyword" ) ).toEqual(
			"(^|[" + wordBoundary + "'‘’‛`])" +
			"keyword($|([" + wordBoundary + "])|((['‘’‛`])" +
			"([" + wordBoundary + "])))"
		);
	} );
	it( "adds start and end boundaries and an extra boundary", function() {
		expect( addWordBoundary( "keyword", false, "#" ) ).toEqual(
			"(^|[" + wordBoundary + "#'‘’‛`])" +
			"keyword($|([" + wordBoundary + "#])|((['‘’‛`])" +
			"([" + wordBoundary + "#])))"
		);
	} );
	it( "adds start boundaries, and end boundaries with positive lookahead", function() {
		expect( addWordBoundary( "keyword", true, "" ) ).toEqual(
			"(^|[" + wordBoundary + "'‘’‛`])" +
			"keyword($|((?=[" + wordBoundary + "]))|((['‘’‛`])" +
			"([" + wordBoundary + "])))"
		);
	} );
	it( "adds start boundaries with an extra boundary, and end boundaries with positive lookahead and an extra boundary", function() {
		expect( addWordBoundary( "keyword", true, "#" ) ).toEqual(
			"(^|[" + wordBoundary + "#'‘’‛`])" +
			"keyword($|((?=[" + wordBoundary + "#]))|((['‘’‛`])" +
			"([" + wordBoundary + "#])))"
		);
	} );
	it( "uses a word boundary excluding - when the locale is Indonesian", function() {
		const idWordBoundary = wordBoundariesStringForRegex;
		expect( addWordBoundary( "keyword", false, "", "id_ID" ) ).toEqual(
			"(^|[" + idWordBoundary + "'‘’‛`])" +
			"keyword($|([" + idWordBoundary + "])|((['‘’‛`])" +
			"([" + idWordBoundary + "])))"
		);
	} );
} );
