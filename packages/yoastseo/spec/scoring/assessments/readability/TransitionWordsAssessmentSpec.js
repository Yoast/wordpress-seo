import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

const shortTextJapanese = "熱".repeat( 399 );
const longTextJapanese = "熱".repeat( 400 );

describe( "An assessment for transition word percentage", function() {
	it( "returns the score for 0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for a paper with text but no sentences (e.g. only images)", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 0,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 10.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 10% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 20.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 5,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 25.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 35.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 20,
			transitionWordSentences: 7 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 40% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 4 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 47% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 100,
			transitionWordSentences: 47 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 66.7% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 2 } ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "should match transition word in image caption", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
	} );

	it( "should return the same score for text with and without <strong> tags in English", function() {
		const paper = new Paper( "<p dir=\"auto\"><strong>Lorem however ipsum dolor sit amet, ex vel harum iisque, " +
			"cum nonumy vulputate dissentiet cu." +
			" Id mei feugait constituam scriptorem, posse labitur vis cu, ad mel rebum saepe. No vix diam dolores. " +
			"Eos id vidisse posidonium, veniam denique efficiendi te nec. Mea id legere prompta comprehensam. " +
			"Ex errem docendi detraxit quo. Dicit viris in cum, unum modus voluptaria no eam. Id nonumes accusata qui," +
			" blandit delectus cu sed. Ex saepe prodesset interesset vel, hence vel docendi percipit delicatissimi ad.</strong></p>" +
			"<p dir=\"auto\">His ut laudem reprimique, id vis nisl dicta argumentum, has aeque partem ea. " +
			"Nihil aliquam adipiscing has ex, ea atqui accusata reprimique sed, vix legimus accumsan salutatus in. " +
			"Ceteros ancillae sapientem ei eam, bonorum insolens salutandi ei sit, soleat voluptatibus eu est. " +
			"Cum porro dicit delicatissimi et, qui quis diam deleniti id, altera ornatus pericula usu ex." +
			" Debitis suscipit aliquando an vis. Nam clita ignota ut, errem fierent mea te, eu sit falli meliore perpetua. </p> " );
		const researcher = new EnglishResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 12.5% of the sentences " +
			"contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>." );
	} );

	it( "should return the same score for text with and without <strong> tags in English", function() {
		const paper = new Paper( "<p dir=\"auto\">Lorem however ipsum dolor sit amet, ex vel harum iisque, " +
			"cum nonumy vulputate dissentiet cu." +
			" Id mei feugait constituam scriptorem, posse labitur vis cu, ad mel rebum saepe. No vix diam dolores. " +
			"Eos id vidisse posidonium, veniam denique efficiendi te nec. Mea id legere prompta comprehensam. " +
			"Ex errem docendi detraxit quo. Dicit viris in cum, unum modus voluptaria no eam. Id nonumes accusata qui," +
			" blandit delectus cu sed. Ex saepe prodesset interesset vel, hence vel docendi percipit delicatissimi ad.</p>" +
			"<p dir=\"auto\">His ut laudem reprimique, id vis nisl dicta argumentum, has aeque partem ea. " +
			"Nihil aliquam adipiscing has ex, ea atqui accusata reprimique sed, vix legimus accumsan salutatus in. " +
			"Ceteros ancillae sapientem ei eam, bonorum insolens salutandi ei sit, soleat voluptatibus eu est. " +
			"Cum porro dicit delicatissimi et, qui quis diam deleniti id, altera ornatus pericula usu ex." +
			" Debitis suscipit aliquando an vis. Nam clita ignota ut, errem fierent mea te, eu sit falli meliore perpetua. </p> " );
		const researcher = new EnglishResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 12.5% of the sentences " +
			"contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>." );
	} );

	it( "should return the same score for text with and without <strong> tags in Japanese", function() {
		const paper = new Paper( "<p dir=\"auto\"><strong>しかし半数の7名は幼少時に様々な病気で死亡し 第一子（長男）のイージドールも早世しており、" +
			"グスタフはいわば長男として育てられた。そのなか心臓水腫に長期間苦しんだ弟エルンストは、少年期のグスタフにとって悲しい体験となった。" +
			"グスタフは盲目のエルンストを愛し、彼が死去するまで数ヶ月間ベッドから離れずに世話をしたという。</strong></p>" +
			"<p dir=\"auto\">母マリーもユダヤ人で、石鹸製造業者の娘だった。ベルンハルトとは20歳の時に結婚している。家柄は良かったが心臓が悪" +
			"く生まれつき片足が不自由であり、自分の望む結婚はできなかったという。アルマ・マーラーは「あきらめの心境でベルンハルトと愛のない結婚をし、" +
			"結婚生活は初日から不幸であった」と書き記している。その結婚自体は理想的な形で実現したとは言えないものの、夫妻の間には前述の通り多く" +
			"の子供が生まれている。ただし身体の不自由なマリーは、教育熱心な夫ベルンハルトと違い母親としての理想的な教育を子供たちに施すことができなかった。" +
			"グスタフは生涯この母親に対し「固定観念と言えるほど強い愛情」を持ち続けた。</p> " +
			"<p dir=\"auto\">ベルンハルトの母（グスタフの祖母）も、行商を生業とする剛毅な人間だった。18歳の頃から大きな籠を背に売り歩いていた。" +
			"晩年には、行商を規制したある法律に触れる事件を起こし、重刑を言い渡されたが、刑に服する気はなく、ただちにウィーンへ赴き皇帝フランツ・" +
			"ヨーゼフ1世に直訴する。皇帝は彼女の体力と80歳という高齢に感動し、特赦した。グスタフ・マーラーの一徹な性格はこの祖母譲りだとアルマは語っている。</p>" );
		const researcher = new JapaneseResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
	} );

	it( "should match transition word in image caption", function() {
		const paper = new Paper( "<p dir=\"auto\">しかし半数の7名は幼少時に様々な病気で死亡し 第一子（長男）のイージドールも早世しており、" +
			"グスタフはいわば長男として育てられた。そのなか心臓水腫に長期間苦しんだ弟エルンストは、少年期のグスタフにとって悲しい体験となった。" +
			"グスタフは盲目のエルンストを愛し、彼が死去するまで数ヶ月間ベッドから離れずに世話をしたという。</p>" +
			"<p dir=\"auto\">母マリーもユダヤ人で、石鹸製造業者の娘だった。ベルンハルトとは20歳の時に結婚している。家柄は良かったが心臓が悪" +
			"く生まれつき片足が不自由であり、自分の望む結婚はできなかったという。アルマ・マーラーは「あきらめの心境でベルンハルトと愛のない結婚をし、" +
			"結婚生活は初日から不幸であった」と書き記している。その結婚自体は理想的な形で実現したとは言えないものの、夫妻の間には前述の通り多く" +
			"の子供が生まれている。ただし身体の不自由なマリーは、教育熱心な夫ベルンハルトと違い母親としての理想的な教育を子供たちに施すことができなかった。" +
			"グスタフは生涯この母親に対し「固定観念と言えるほど強い愛情」を持ち続けた。</p> " +
			"<p dir=\"auto\">ベルンハルトの母（グスタフの祖母）も、行商を生業とする剛毅な人間だった。18歳の頃から大きな籠を背に売り歩いていた。" +
			"晩年には、行商を規制したある法律に触れる事件を起こし、重刑を言い渡されたが、刑に服する気はなく、ただちにウィーンへ赴き皇帝フランツ・" +
			"ヨーゼフ1世に直訴する。皇帝は彼女の体力と80歳という高齢に感動し、特赦した。グスタフ・マーラーの一徹な性格はこの祖母譲りだとアルマは語っている。</p>" );
		const researcher = new JapaneseResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
	} );
	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable when the text is less than 200 words", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum. Eos percipit singulis no. No scripta graecis cum. " +
			"Ut vim eius porro labore. Id quem civibus sit. Sed no primis urbanitas, aperiri laboramus voluptatibus ei per. Esse consul possim " +
			"duo eu, eu duo natum ferri libris. Tritani percipit interpretaris ne ius. Mel prima definitionem eu, partem labores vim at. " +
			"Prompta vivendum usu te. Indoctum philosophia definitiones usu ad, cum quodsi alienum et. " );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable when used with a supported researcher, e.g. the English researcher", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum. Eos percipit singulis no. No scripta graecis cum. " +
			"Ut vim eius porro labore. Id quem civibus sit. Sed no primis urbanitas, aperiri laboramus voluptatibus ei per. Esse consul possim " +
			"duo eu, eu duo natum ferri libris. Tritani percipit interpretaris ne ius. Mel prima definitionem eu, partem labores vim at. " +
			"Prompta vivendum usu te. Indoctum philosophia definitiones usu ad, cum quodsi alienum et. Sumo civibus appareat est ea, " +
			"in iriure euismod dolores mel. Mea scripta senserit maluisset ei. Vel id mollis delicata constituam, laoreet scriptorem his cu, " +
			"facilis accusam quaerendum nam in. Adversarium philosophia deterruisset duo at, augue postulant ut eos, usu ne iuvaret docendi. " +
			"Iudicabit eloquentiam usu no. Vide volumus pri ne. Eos ignota timeam ponderum ei, an postea principes prodesset sit, " +
			"purto blandit offendit pro an. Ei vim ludus veniam mnesarchum. Ne modus consul dolorem his, solum alienum eu nec. " +
			"Mea legendos deserunt quaerendum te, fierent fabellas eu per. Ei sea accumsan fabellas signiferumque. Veri ludus aperiri his at, " +
			"meis dicant impedit an qui. Est error offendit ex, at affert mediocrem interpretaris nam. Percipit persecuti et mel, persecuti " +
			"inciderint signiferumque cu usu, an sit nemore nusquam. Brute iracundia sea ei, ad esse dictas aliquam est, prompta ceteros " +
			"aliquando ne vix. Fabulas voluptua eu vel. Ceteros euripidis has cu. Pro ea esse ignota perfecto, ius noluisse liberavisse ei. " +
			"Has possim mediocritatem in. Paulo alienum accusamus pro cu, magna labore sit ad. Sumo paulo sea in, cum te latine " +
			"labores inciderint.", { locale: "en_US" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when used with a non-supported researcher, e.g. the default researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "xx_YY" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new DefaultResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable when the text is less than 400 characters in Japanese", function() {
		const mockPaper = new Paper( shortTextJapanese );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable when the text is 400 characters or longer in Japanese", function() {
		const mockPaper = new Paper( longTextJapanese );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );
} );

describe( "A test for marking sentences containing a transition word", function() {
	it( "returns markers for sentences containing transition words", function() {
		const paper = new Paper( "This sentence is marked, because it contains a transition word." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ { sentence: "This sentence is marked, " +
					"because it contains a transition word.", transitionWords: [ "because" ] } ] } );
		const expected = [
			new Mark( { original: "This sentence is marked, because it contains a transition word.", marked: "<yoastmark " +
					"class='yoast-text-mark'>This sentence is marked, because it contains a transition word.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences contain a transition word", function() {
		const paper = new Paper( "This sentence is not marked." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ ] } );
		const expected = [];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns markers for an image caption containing transition words", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const expected = [
			new Mark( {
				original: "However, a cat with the toy looks happier.",
				marked: "<yoastmark class='yoast-text-mark'>However, a cat with the toy looks happier.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( expected );
	} );
} );
