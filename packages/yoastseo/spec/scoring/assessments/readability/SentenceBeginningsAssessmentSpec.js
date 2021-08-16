import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import FrenchResearcher from "../../../../src/languageProcessing/languages/fr/Researcher";
import GermanResearcher from "../../../../src/languageProcessing/languages/de/Researcher";
import SpanishResearcher from "../../../../src/languageProcessing/languages/es/Researcher";
import ItalianResearcher from "../../../../src/languageProcessing/languages/it/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import DutchResearcher from "../../../../src/languageProcessing/languages/nl/Researcher";
import PolishResearcher from "../../../../src/languageProcessing/languages/pl/Researcher";
import SwedishResearcher from "../../../../src/languageProcessing/languages/sv/Researcher";
import IndonesianResearcher from "../../../../src/languageProcessing/languages/id/Researcher";
import RussianResearcher from "../../../../src/languageProcessing/languages/ru/Researcher";
import HungarianResearcher from "../../../../src/languageProcessing/languages/hu/Researcher";
import TurkishResearcher from "../../../../src/languageProcessing/languages/tr/Researcher";

import SentenceBeginningsAssessment from "../../../../src/scoring/assessments/readability/SentenceBeginningsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();
import Mark from "../../../../src/values/Mark.js";

let paper = new Paper();
// eslint-disable-next-line max-statements
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores one instance with 4 consecutive English sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 },
			{ word: "cup", count: 2 },
			{ word: "laptop", count: 1 },
			{ word: "table", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>:" +
			" The text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive English sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 },
			{ word: "banana", count: 6 }, { word: "pencil", count: 1 },
			{ word: "bottle", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive English sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 1 },
			{ word: "telephone", count: 2 }, { word: "towel", count: 2 },
			{ word: "couch", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "scores one instance with 4 consecutive German sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 2 },
			{ word: "Stuhl", count: 2 }, { word: "Banane", count: 1 },
			{ word: "Tafel", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: T" +
			"he text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive German sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 2 },
			{ word: "Banane", count: 6 }, { word: "Blatt", count: 1 },
			{ word: "Schloss", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive German sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 1 },
			{ word: "Telefon", count: 2 }, { word: "Hund", count: 2 },
			{ word: "Haus", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "scores one instance with 4 consecutive Indonesian sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "halo", count: 2 },
			{ word: "cangkir", count: 2 }, { word: "pisang", count: 1 },
			{ word: "meja", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive Indonesian sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "halo", count: 2 },
			{ word: "cangkir", count: 6 }, { word: "pisang", count: 1 },
			{ word: "botol", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive Indonesian sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "halo", count: 1 },
			{ word: "pensil", count: 2 }, { word: "kopi", count: 2 },
			{ word: "sofa", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "scores one instance with 4 consecutive Hungarian sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hé", count: 2 },
			{ word: "csésze", count: 2 }, { word: "laptop", count: 1 },
			{ word: "asztal", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive Hungarian sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hé", count: 2 },
			{ word: "banán", count: 6 }, { word: "ceruza", count: 1 },
			{ word: "üveg", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive Hungarian sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "helló", count: 1 },
			{ word: "ceruza", count: 2 }, { word: "kávé", count: 2 },
			{ word: "kanapé", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "scores one instance with 4 consecutive Turkish sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "merhaba", count: 2 },
			{ word: "bilgisayar", count: 2 }, { word: "köpek", count: 1 },
			{ word: "kedi", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 4 consecutive sentences starting with the same word." +
			" <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores two instance with too many consecutive Turkish sentences starting with the same word, 5 being the lowest count.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hayvan", count: 2 },
			{ word: "muz", count: 6 }, { word: "makyaj", count: 1 },
			{ word: "çay", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 2 instances where 5 or more consecutive sentences start with the same word. <a href='https://yoa.st/35g' " +
			"target='_blank'>Try to mix things up</a>!" );
	} );

	it( "scores zero instance with too many consecutive Turkish sentences starting with the same word.", function() {
		const assessment = new SentenceBeginningsAssessment().getResult( paper, Factory.buildMockResearcher( [ { word: "hoşgeldiniz", count: 1 },
			{ word: "ayakkabı", count: 2 }, { word: "kayıt", count: 2 },
			{ word: "ceket", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There is enough variety in your sentences. That's great!" );
	} );

	it( "is not applicable for a paper without text.", function() {
		const assessment = new SentenceBeginningsAssessment().isApplicable( new Paper( "" ), new EnglishResearcher( new Paper( "" ) ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable for a German paper without text.", function() {
		paper = new Paper( "", { locale: "de_DE" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new GermanResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a German paper with text.", function() {
		paper = new Paper( "hallo", { locale: "de_DE" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new GermanResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a French paper without text.", function() {
		paper = new Paper( "", { locale: "fr_FR" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new FrenchResearcher( paper )  );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a French paper with text.", function() {
		paper = new Paper( "bonjour", { locale: "fr_FR" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new FrenchResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Spanish paper without text.", function() {
		paper = new Paper( "", { locale: "es_ES" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new SpanishResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Spanish paper with text.", function() {
		paper = new Paper( "hola", { locale: "es_ES" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new SpanishResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Dutch paper without text.", function() {
		paper =  new Paper( "", { locale: "nl_NL" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new DutchResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Dutch paper with text.", function() {
		paper = new Paper( "hallo", { locale: "nl_NL" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new DutchResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for an Italian paper without text.", function() {
		paper = new Paper( "", { locale: "it_IT" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new ItalianResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for an Italian paper with text.", function() {
		paper = new Paper( "ciao", { locale: "it_IT" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new ItalianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Russian paper without text.", function() {
		paper = new Paper( "", { locale: "ru_RU" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new RussianResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Russian paper with text.", function() {
		paper = new Paper( "почему", { locale: "ru_RU" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new RussianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Polish paper without text.", function() {
		paper = new Paper( "", { locale: "pl_PL" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new PolishResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Polish paper with text.", function() {
		paper = new Paper( "cześć", { locale: "pl_PL" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new PolishResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Swedish paper without text.", function() {
		paper = new Paper( "", { locale: "sv_SE" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new SwedishResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Swedish paper with text.", function() {
		paper = new Paper( "hej", { locale: "sv_SE" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new SwedishResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for an Indonesian paper without text.", function() {
		paper = new Paper( "", { locale: "id_ID" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new IndonesianResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for an Indonesian paper with text.", function() {
		paper = new Paper( "hai", { locale: "id_ID" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new IndonesianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Hungarian paper without text.", function() {
		paper = new Paper( "", { locale: "hu_HU" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new HungarianResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Hungarian paper with text.", function() {
		paper = new Paper( "magyar", { locale: "hu_HU" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new HungarianResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Turkish paper without text.", function() {
		paper = new Paper( "", { locale: "tr_TR" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new TurkishResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Turkish paper with text.", function() {
		paper = new Paper( "türk", { locale: "tr_TR" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new TurkishResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a paper with text and a locale without sentence beginning support.", function() {
		paper = new Paper( "hello", { locale: "jv_ID" } );
		const assessment = new SentenceBeginningsAssessment().isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 4,
			sentences: [ "Hey, hello.", "Hey, hey.", "Hey you.", "Hey." ] } ] );
		const expected = [
			new Mark( { original: "Hey, hello.", marked: "<yoastmark class='yoast-text-mark'>Hey, hello.</yoastmark>" } ),
			new Mark( { original: "Hey, hey.", marked: "<yoastmark class='yoast-text-mark'>Hey, hey.</yoastmark>" } ),
			new Mark( { original: "Hey you.", marked: "<yoastmark class='yoast-text-mark'>Hey you.</yoastmark>" } ),
			new Mark( { original: "Hey.", marked: "<yoastmark class='yoast-text-mark'>Hey.</yoastmark>" } ),
		];
		expect( new SentenceBeginningsAssessment().getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 2, sentences: [ "Hey, hello.", "Hey, hey." ] } ] );
		const expected = [];
		expect( new SentenceBeginningsAssessment().getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );
} );
