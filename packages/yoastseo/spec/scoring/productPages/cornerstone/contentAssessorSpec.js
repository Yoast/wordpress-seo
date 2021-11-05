import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import ContentAssessor from "../../../../src/scoring/productPages/cornerstone/contentAssessor";
import Paper from "../../../../src/values/Paper";

const options = {
	subheadingUrlTitle: "https://yoast.com/1",
	subheadingCTAUrl: "https://yoast.com/2",
	paragraphUrlTitle: "https://yoast.com/3",
	paragraphCTAUrl: "https://yoast.com/4",
	sentenceLengthUrlTitle: "https://yoast.com/5",
	sentenceLengthCTAUrl: "https://yoast.com/6",
	transitionWordsUrlTitle: "https://yoast.com/7",
	transitionWordsCTAUrl: "https://yoast.com/8",
	passiveVoiceUrlTitle: "https://yoast.com/9",
	passiveVoiceCTAUrl: "https://yoast.com/10",
	textPresenceUrlTitle: "https://yoast.com/11",
	textPresenceCTAUrl: "https://yoast.com/12",
	listsUrlTitle: "https://yoast.com/13",
	listsCTAUrl: "https://yoast.com/14",
};

describe( "A cornerstone product page content assessor", function() {
	describe( "Checks the applicable assessments for text that contains less than 300 words", function() {
		const paper = new Paper( "Lorem ipsum dolor sit amet, voluptua probatus ullamcorper id vis, ceteros consetetur qui ea, " +
			"nam movet populo aliquam te. His eu debitis fastidii. Pri ea amet dicant. Ut his suas corpora, eu reformidans " +
			"signiferumque duo. At erant expetenda patrioque quo, rebum atqui nam ad, tempor elaboraret interpretaris pri ad. " +
			"Novum postea sea in. Placerat recteque cu usu. Cu nam sadipscing disputationi, sed labitur elaboraret et. Eu sed " +
			"accumsan prodesset. Posse integre et nec, usu assum audiam erroribus eu. Ei viris eirmod interesset usu, " +
			"usu homero liberavisse in, solet disputando ea vim. Mei eu inani nonumes consulatu, ea alterum menandri ius, " +
			"ne euismod neglegentur sed. Vis te deleniti suscipit, fabellas laboramus pri ei. Te quo aliquip offendit. " +
			"Vero paulo regione ei eum, sed at atqui meliore copiosae. Has et vocent vivendum. Mundi graeco latine cum ne, " +
			"no cum laoreet alienum. Quo cu vero utinam constituto. Vis omnium vivendum ea. Eum lorem ludus possim ut. Eu has eius " +
			"munere explicari, atqui ullamcorper eos no, harum epicuri per ut. Utamur volumus minimum ea vel, duo eu praesent " +
			"accommodare. Mutat gloriatur ex cum, rebum salutandi ei his, vis delenit quaestio ne. Iisque qualisque duo ei. " +
			"Splendide tincidunt te sit, commune oporteat quo id. Sumo recusabo suscipiantur duo an, no eum malis vulputate " +
			"consectetuer. Mel te noster invenire, nec ad vidisse constituto. Eos ut quod." );
		it( "Should have 6 available assessments for a fully supported language", function() {
			const contentAssessor = new ContentAssessor( new EnglishResearcher( paper ), options );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 6;
			expect( actual ).toBe( expected );
		} );

		it( "Should have 4 available assessments for a basic supported language", function() {
			const contentAssessor = new ContentAssessor( new DefaultResearcher( paper ), options );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 4;
			expect( actual ).toBe( expected );
		} );
	} );

	describe( "Checks the applicable assessments for text that contains more than 300 words", function() {
		const paper = new Paper( "a tortie cat ".repeat( 150 ) );
		it( "Should have 7 available assessments for a fully supported language", function() {
			const contentAssessor = new ContentAssessor( new EnglishResearcher( paper ), options );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 7;
			expect( actual ).toBe( expected );
		} );

		it( "Should have 5 available assessments for a basic supported language", function() {
			const contentAssessor = new ContentAssessor( new DefaultResearcher( paper ), options );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 5;
			expect( actual ).toBe( expected );
		} );
	} );

	describe( "has configuration overrides", () => {
		const paper = new Paper( "a tortie cat ".repeat( 150 ) );
		const assessor = new ContentAssessor( new DefaultResearcher( paper ), {
			subheadingUrlTitle: "https://yoast.com/1",
			subheadingCTAUrl: "https://yoast.com/2",
			paragraphUrlTitle: "https://yoast.com/3",
			paragraphCTAUrl: "https://yoast.com/4",
			sentenceLengthUrlTitle: "https://yoast.com/5",
			sentenceLengthCTAUrl: "https://yoast.com/6",
			transitionWordsUrlTitle: "https://yoast.com/7",
			transitionWordsCTAUrl: "https://yoast.com/8",
			passiveVoiceUrlTitle: "https://yoast.com/9",
			passiveVoiceCTAUrl: "https://yoast.com/10",
			textPresenceUrlTitle: "https://yoast.com/11",
			textPresenceCTAUrl: "https://yoast.com/12",
			listsUrlTitle: "https://yoast.com/13",
			listsCTAUrl: "https://yoast.com/14",
		} );

		test( "SubheadingsDistributionTooLong", () => {
			const assessment = assessor.getAssessment( "subheadingsTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.shouldNotAppearInShortText ).toBeDefined();
			expect( assessment._config.shouldNotAppearInShortText ).toBe( true );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/1' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/2' target='_blank'>" );
		} );

		test( "SentenceLengthAssessment", () => {
			const assessment = assessor.getAssessment( "textSentenceLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.slightlyTooMany ).toBe( 15 );
			expect( assessment._config.farTooMany ).toBe( 20 );
			expect( assessment._isCornerstone ).toBe( true );
			expect( assessment._isProduct ).toBe( true );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/5' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/6' target='_blank'>" );
		} );

		test( "ParagraphTooLong", () => {
			const assessment = assessor.getAssessment( "textParagraphTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.parameters.recommendedLength ).toBe( 70 );
			expect( assessment._config.parameters.maximumRecommendedLength ).toBe( 100 );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/3' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/4' target='_blank'>" );
		} );

		test( "TransitionWords", () => {
			const assessment = assessor.getAssessment( "textTransitionWords" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/7' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/8' target='_blank'>" );
		} );

		test( "PassiveVoice", () => {
			const assessment = assessor.getAssessment( "passiveVoice" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/9' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/10' target='_blank'>" );
		} );

		test( "TextPresence", () => {
			const assessment = assessor.getAssessment( "textPresence" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/11' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/12' target='_blank'>" );
		} );

		test( "ListsPresence", () => {
			const assessment = assessor.getAssessment( "listsPresence" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/13' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/14' target='_blank'>" );
		} );
	} );
} );
