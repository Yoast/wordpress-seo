let singleWords = [ "aangezien", "al", "aldus", "allereerst", "als", "alsook", "anderzijds", "bijgevolg", "bijvoorbeeld", "bovendien",
	"concluderend",	"daardoor", "daarentegen", "daarmee", "daarna", "daarnaast", "daarom", "daartoe", "daarvoor", "dadelijk", "dan",
	"desondanks", "dienovereenkomstig", "dientegevolge", "doch", "doordat", "dus", "echter", "eerst", "evenals", "eveneens", "evenzeer",
	"hierom", "hoewel", "immers", "indien", "integendeel", "intussen", "kortom", "later", "maar", "mits", "nadat", "namelijk", "net als",
	"niettemin", "noch", "ofschoon", "omdat", "ondanks", "ondertussen", "ook", "opdat", "resumerend", "samengevat", "samenvattend",
	"tegenwoordig", "teneinde", "tenzij", "terwijl", "tevens", "toch", "toen", "uiteindelijk", "vanwege", "vervolgens", "voorafgaand",
	"vooralsnog", "voordat", "voorts", "vroeger", "waardoor", "waarmee", "waaronder", "wanneer", "want", "zoals", "zodat", "zodoende",
	"zodra" ];

let multipleWords = [ "aan de andere kant", "aan de ene kant", "aangenomen dat", "al met al", "alles afwegend", "alles bij elkaar",
	"alles in aanmerking nemend", "als gevolg van", "anders gezegd", "daar staat tegenover", "daarbij komt", "daaruit volgt",
	"dat betekent", "dat blijkt uit", "de oorzaak daarvan is", "de oorzaak hiervan is", "door middel van", "een voorbeeld hiervan",
	"een voorbeeld van", "gesteld dat", "hetzelfde als", "hieruit kunnen we afleiden", "hieruit volgt", "hoe het ook zij",
	"in de derde plaats", "in de eerste plaats", "in de tweede plaats", "in één woord", "in het bijzonder", "in het geval dat",
	"in plaats van", "in tegenstelling tot", "in vergelijking met", "maar ook", "met als doel", "met andere woorden", "met behulp van",
	"met de bedoeling", "neem nou", "net als", "om kort te gaan", "onder andere", "op dezelfde wijze", "stel dat", "te danken aan",
	"te wijten aan", "ten derde", "ten eerste", "ten gevolge van", "ten slotte", "ten tweede", "ter conclusie", "ter illustratie",
	"ter verduidelijking", "tot nog toe", "tot slot", "vandaar dat", "vergeleken met", "voor het geval dat" ];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};
