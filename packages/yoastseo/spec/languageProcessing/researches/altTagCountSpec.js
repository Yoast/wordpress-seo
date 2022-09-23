/* eslint-disable capitalized-comments, spaced-comment */
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import altTagCountFunction from "../../../src/languageProcessing/researches/altTagCount";
import Paper from "../../../src/values/Paper";

const morphologyData = getMorphologyData( "en" );

describe( "Counts images in a text", function() {
	it( "returns an empty object with all alt-counts as zero", function() {
		const paper = new Paper( "string", { keyword: "keyword", synonyms: "synonym, another synonym" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	 it( "returns object with the withAltKeyword as 1 when the keyword is set and present (1-word keyword)", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "keyword", synonyms: "synonym, another synonym" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltKeyword as 1 when the keyword is set and present by 50% (2-word keyword)", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "keyword keyphrase",
			synonyms: "synonym, another synonym" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltKeyword as 0 when the keyword is set and present by 33% (3-word keyword)", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "keyword keyphrase synonym",
			synonyms: "synonym, another synonym" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "returns object with the withAlt as 1 when there's an alt-tag, but no keyword is set", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 1 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltNonKeyword as 1 when the keyword is set, but not present in the alt-tag", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' />", { keyword: "sample" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "returns object with the noAlt as 1 when the alt-tag is empty", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the noAlt as 1 when the alt-tag is missing", function() {
		const paper = new Paper( "string <img src='http://plaatje' />", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 0 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with a combination of present and missing alt-tags", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='' />", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with the withAltKeyword as 1 when the keyword is set and present and has a $", function() {
		const paper = new Paper( "string <img src='http://img' alt='$keyword' />", { keyword: "$keyword" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "returns object with a combination of present and missing alt-tags with keyphrase and synonym words in it", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='something empty' /> " +
			"string <img src='http://plaatje' alt='synonym' /> <img src='http://plaatje' alt='' /> " +
			"string <img src='http://plaatje' alt='test' /> <img src='http://plaatje' alt='' /> " +
			"string <img src='http://plaatje' alt='paper interesting' /> <img src='http://plaatje' alt='paper' />", {
			keyword: "keyword",
			synonyms: "synonym, test, interesting paper",
		} );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 2 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 5 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "returns object with a combination of present and missing alt-tags with \"keyphrase\" and synonym words in it", function() {
		const paper = new Paper(
			"string <img src='http://plaatje' alt='keyword' /> <img src='http://plaatje' alt='something empty' /> " +
			"string <img src='http://plaatje' alt='synonym' /> <img src='http://plaatje' alt='' /> " +
			"string <img src='http://plaatje' alt='keyword in quotes' /> <img src='http://plaatje' alt='' /> " +
			"string <img src='http://plaatje' alt='paper interesting' /> <img src='http://plaatje' alt='paper' />", {
				keyword: "\"keyword in quotes\"",
				synonyms: "synonym, test, interesting paper",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 2 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 4 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 2 );
	} );

	it( "returns object with a combination of present and missing alt-tags with \"keyphrase\" and synonym words in it", function() {
		const paper = new Paper(
			"string <img src='http://plaatje' alt='keyword' /> " +
			"<img src='http://plaatje' alt='synonym and test' /> " +
			"string <img src='http://plaatje' alt='synonyms' /> " +
			"<img src='http://plaatje' alt='' /> " +
			"string <img src='http://plaatje' alt='keyword in quotes' /> " +
			"<img src='http://plaatje' alt='interestingly enough, it is a paper' /> " +
			"string <img src='http://plaatje' alt='paper interesting test synonyms' /> " +
			"<img src='http://plaatje' alt='papering' />", {
				keyword: "\"keyword in quotes\"",
				synonyms: "synonym, test, interesting paper",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 1 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 6 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "Applied English morphology", function() {
		const paper = new Paper(
			"<div class=\"floatright\">" +
			"<a class=\"image\" " +
			"title=\"Vue du Kibo depuis le sud en juin 2009.\" " +
			"href=\"https://commons.wikimedia.org/wiki/File:Mount_Kilimanjaro.jpg?uselang=fr\">" +
			"<img class=\"alignnone\" src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg" +
			"/150px-Mount_Kilimanjaro.jpg\" alt=\"Vue du Kilimandjaros depuis le sud en juin 2009.\" width=\"150\" height=\"67\" " +
			"data-file-width=\"2673\" data-file-height=\"1200\" />" +
			"</a>" +
			"</div>\n" +
			"\tLe <b><a title=\"Kilimandjaro\" href=\"https://fr.wikipedia.org/wiki/Kilimandjaro\">Kilimandjaro</a>" +
			"</b> ou <b>Kilimanjaro</b> est une <a title=\"Montagne\" href=\"https://fr.wikipedia.org/wiki/Montagne\">montagne" +
			"</a> située dans le Nord-Est de la <a title=\"Tanzanie\" href=\"https://fr.wikipedia.org/wiki/Tanzanie\">" +
			"Tanzanie</a>et composée de trois <a title=\"Volcan\" href=\"https://fr.wikipedia.org/wiki/Volcan\">volcans</a> éteints :" +
			" le Shira à l'ouest, culminant à 3 962 mètres d'altitude, le Mawenzi à l'est, s'élevant à 5 149 mètres d'altitude, " +
			"et le Kibo, le plus récent <a title=\"Géologie\" href=\"https://fr.wikipedia.org/wiki/G%C3%A9ologie\">géologiquement</a>, " +
			"situé entre les deux autres et dont le pic Uhuru à 5 891,8 mètres d'altitude constitue le <a title=\"Point culminant\" " +
			"href=\"https://fr.wikipedia.org/wiki/Point_culminant\">point culminant</a> de l'<a title=\"Afrique\" " +
			"href=\"https://fr.wikipedia.org/wiki/Afrique\">Afrique</a>. Outre cette caractéristique, le Kilimandjaro est connu pour sa " +
			"<a title=\"Calotte glaciaire\" href=\"https://fr.wikipedia.org/wiki/Calotte_glaciaire\">calotte glaciaire</a> sommitale en " +
			"<a title=\"Recul des glaciers depuis 1850\" href=\"https://fr.wikipedia.org/\n", {
				keyword: "Kilimandjaro",
			}
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 0 );
	} );

	it( "Tests for multi-word keyphrases", function() {
		const paper = new Paper(
			"<img src='http://plaatje' alt='keyword and keyphrase' /> " +
			"<img src='http://plaatje' alt='keyword' /> " +
			"<img src='http://plaatje' alt='keyphrase' /> " +
			"<img src='http://plaatje' alt='keyword and keyphrase and more' /> " +
			"<img src='http://plaatje' alt='key' /> ",
			{ keyword: "keyword keyphrase" }
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 4 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );

	it( "Tests for multi-word keyphrases", function() {
		const paper = new Paper(
			"<img src='http://plaatje' alt='keyword and keyphrase' /> " +
			"<img src='http://plaatje' alt='keyword' /> " +
			"<img src='http://plaatje' alt='keyphrase' /> " +
			"<img src='http://plaatje' alt='keyword and keyphrase and more' /> " +
			"<img src='http://plaatje' alt='key' /> ",
			{ keyword: "keyword keyphrase synonym" }
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 2 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 3 );
	} );

	it( "Tests for multi-word keyphrases with morphology", function() {
		const paper = new Paper(
			"<img src='http://plaatje' alt='keywords and keyphrases' /> " +
			"<img src='http://plaatje' alt='keyword' /> " +
			"<img src='http://plaatje' alt='keyphrase' /> " +
			"<img src='http://plaatje' alt='keyword and keyphrases and more' /> " +
			"<img src='http://plaatje' alt='key' /> ",
			{ keyword: "keyword keyphrase synonym" }
		);
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 2 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 3 );
	} );
} );

/*describe( "test for alt tag attributes in Japanese", () => {
	it( "returns result when no morphology data is supplied", () => {
		const paper = new Paper( "<img src=\"http://basic.wordpress.test/wp-content/uploads/2021/10/images.jpeg\" alt=\"会えるトイレ\"> " +
			"<img src=\"http://basic.wordpress.test/wp-content/uploads/2021/10/images.jpeg\" alt=\"我が家はみんな元気じゃないです\">",
		{ keyword: "会える" } );
		const researcher = new JapaneseResearcher( paper );
		const stringToCheck = altTagCountFunction( paper, researcher );

		expect( stringToCheck.noAlt ).toBe( 0 );
		expect( stringToCheck.withAlt ).toBe( 0 );
		expect( stringToCheck.withAltKeyword ).toBe( 1 );
		expect( stringToCheck.withAltNonKeyword ).toBe( 1 );
	} );
} );*/
