import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import Factory from "../../../specHelpers/factory.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import paragraphLengthJapanese from "../../../../src/languageProcessing/languages/ja/config/paragraphLength";

const paragraphTooLongAssessment = new ParagraphTooLongAssessment();
const shortTextJapanese = "は".repeat( 300 );
const longTextJapanese = "は".repeat( 360 );
const veryLongTextJapanese = "は".repeat( 410 );

describe( "An assessment for scoring too long paragraphs.", function() {
	const paper = new Paper( "" );
	it( "should score 1 paragraph with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "should score 1 slightly too long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 160, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should score 1 extremely long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 6000, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should score 3 paragraphs with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 83, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "should score 3 paragraphs, one of which is too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should score 3 paragraphs, two of which are too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 191, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should return an empty assessment result for a paper without paragraphs.", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ) );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
} );

describe( "An assessment for scoring too long paragraphs in Japanese in which character length is used " +
	"in the calculation instead of word length", function() {
	it( "should score 1 slightly too long paragraph", function() {
		const paper = new Paper( longTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should score 1 too long paragraph", function() {
		const paper = new Paper( veryLongTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "should score 2 slightly too long paragraphs", function() {
		const paper = new Paper( `${shortTextJapanese}<p>${longTextJapanese}</p><p>${longTextJapanese}</p>`  );
		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "Applicability of the assessment.", function() {
	it( "should return true for isApplicable on a paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper. With at least fifty characters." );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( true );
	} );
	it( "should return false for isApplicable on a paper without text.", function() {
		const paper = new Paper( "" );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( false );
	} );
	it( "should return false for isApplicable for a paper with only an image.", function() {
		const paper = new Paper( "<img src='https://example.com/image.png' alt='test'>" );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( false );
	} );
	it( "should return false for isApplicable for a paper with only spaces.", function() {
		const paper = new Paper( "        " );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( false );
	} );
	it( "returns false if the text is too short", function() {
		const paper = new Paper( "hallo" );
		expect( paragraphTooLongAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "should return markers for a default text", function() {
		const assessment = new ParagraphTooLongAssessment();
		const paper = new Paper( "You just got Yoast SEO, and you are ready to get the most out of it! Or, have you already been using it for a " +
			"while and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its best. " +
			"That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the right way! Read " +
			"on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the top of your general " +
			"WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link takes you to the Workouts " +
			"screen, where you can find and access the Configuration workout by clicking the Start workout button. If you’ve finished the workout " +
			"but want to revise some steps, you can find it in the Workouts menu item of the SEO menu (see bottom of image). Now, let’s go through " +
			"the workout’s steps. Choose Organization if you have a professional or a company website. For example, if we were filling in the data " +
			"for yoast.com, we would choose Organization. You’ll then need to add the Organization’s name, logo, and tagline." );
		const paragraphTooLong = new EnglishResearcher( paper );
		const expected = [
			new Mark( { original: "You just got Yoast SEO, and you are ready to get the most out of it! Or, have you already been using it for a " +
					"while and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its " +
					"best. That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the " +
					"right way! Read on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the " +
					"top of your general WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link" +
					" takes you to the Workouts screen, where you can find and access the Configuration workout by clicking the Start workout " +
					"button. If you’ve finished the workout but want to revise some steps, you can find it in the Workouts menu item of the SEO " +
					"menu (see bottom of image). Now, let’s go through the workout’s steps. Choose Organization if you have a professional or a " +
					"company website. For example, if we were filling in the data for yoast.com, we would choose Organization. You’ll then need to" +
					" add the Organization’s name, logo, and tagline.", marked: "<yoastmark class='yoast-text-mark'>You just got Yoast SEO, and " +
					"you are ready to get the most out of it! Or, have you already been using it for a while " +
					"and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its best. " +
					"That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the right way!" +
					" Read on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the top of your" +
					" general WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link takes you " +
					"to the Workouts screen, where you can find and access the Configuration workout by clicking the Start workout button. If " +
					"you’ve finished the workout but want to revise some steps, you can find it in the Workouts menu item of the SEO menu (see " +
					"bottom of image). Now, let’s go through the workout’s steps. Choose Organization if you have a professional or a company " +
					"website. For example, if we were filling in the data for yoast.com, we would choose Organization. You’ll then need to add " +
					"the Organization’s name, logo, and tagline.</yoastmark>" } ),
		];
		expect( assessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
	it( "should return markers for a default text where the text contains <br> tags with attribute," +
		" where <br> has a closing tag", function() {
		const assessment = new ParagraphTooLongAssessment();
		const paper = new Paper( "<p>Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, duis aliquid perfecto ius ea, ad pri " +
			"corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti ut eam, " +
			"eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima accumsan " +
			"signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens vituperatoribus, " +
			"at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, dissentiunt " +
			"liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium facilis mea an. " +
			"Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, convenire adversarium " +
			"efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. Wisi nusquam pri no, putent menandri " +
			"ad duo. Nullam nostrum salutandi eum id, per agam exerci an.<br data-mce-fragment=\"1\"></br><br data-mce-fragment=\"1\"></br>" +
			"Sadipscing neglegentur in vim. Et vero zril nec. Utinam sententiae percipitur ius no, pri ornatus facilisi vulputate ut. " +
			"Velit tractatos consequat ea duo, ad duo sanctus vituperata, eos cu augue delenit liberavisse. Sit ut viris " +
			"vocibus rationibus, ex eruditi copiosae evertitur nam. Mei veniam mentitum definitiones ex, harum maluisset " +
			"cu usu.<br data-mce-fragment=\"1\"></br><br data-mce-fragment=\"1\"></br>Ne mel consetetur incorrupte, id habemus omittantur " +
			"efficiantur est. Delenit facilisi neglegentur est cu, eam ut viris vocent aliquam. Copiosae senserit ut vix, " +
			"epicuri perfecto eam ne. Vis summo delicatissimi in, cu porro facete phaedrum nam. <br data-mce-fragment=\"1\"></br>" +
			"<br data-mce-fragment=\"1\"></br>Utamur discere phaedrum eu nam. Ne quidam placerat per, qui inani diceret cu, " +
			"at nec quot petentium efficiendi. Sea te persius vulputate. Docendi temporibus et quo. Ad duo appareat lobortis definitionem.!</p>" );
		const paragraphTooLong = new EnglishResearcher( paper );
		const expected = [
			new Mark( {
				original: "Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, duis aliquid perfecto ius ea, " +
					"ad pri corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti " +
					"ut eam, eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima " +
					"accumsan signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens " +
					"vituperatoribus, at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, " +
					"dissentiunt liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium " +
					"facilis mea an. Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, " +
					"convenire adversarium efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. " +
					"Wisi nusquam pri no, putent menandri ad duo. Nullam nostrum salutandi eum id, per agam exerci an.",
				marked: "<yoastmark class='yoast-text-mark'>Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, " +
					"duis aliquid perfecto ius ea, " +
					"ad pri corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti " +
					"ut eam, eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima " +
					"accumsan signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens " +
					"vituperatoribus, at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, " +
					"dissentiunt liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium " +
					"facilis mea an. Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, " +
					"convenire adversarium efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. " +
					"Wisi nusquam pri no, putent menandri ad duo. Nullam nostrum salutandi eum id, per agam exerci an.</yoastmark>" } ),
		];
		expect( assessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
	it( "should return markers for a default text where the text contains <br> tags with attribute," +
		" where <br> doesn't have a closing tag", function() {
		const assessment = new ParagraphTooLongAssessment();
		const paper = new Paper( "<p>Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, duis aliquid perfecto ius ea, ad pri " +
			"corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti ut eam, " +
			"eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima accumsan " +
			"signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens vituperatoribus, " +
			"at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, dissentiunt " +
			"liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium facilis mea an. " +
			"Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, convenire adversarium " +
			"efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. Wisi nusquam pri no, putent menandri " +
			"ad duo. Nullam nostrum salutandi eum id, per agam exerci an.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">" +
			"Sadipscing neglegentur in vim. Et vero zril nec. Utinam sententiae percipitur ius no, pri ornatus facilisi vulputate ut. " +
			"Velit tractatos consequat ea duo, ad duo sanctus vituperata, eos cu augue delenit liberavisse. Sit ut viris " +
			"vocibus rationibus, ex eruditi copiosae evertitur nam. Mei veniam mentitum definitiones ex, harum maluisset " +
			"cu usu.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">Ne mel consetetur incorrupte, id habemus omittantur " +
			"efficiantur est. Delenit facilisi neglegentur est cu, eam ut viris vocent aliquam. Copiosae senserit ut vix, " +
			"epicuri perfecto eam ne. Vis summo delicatissimi in, cu porro facete phaedrum nam. <br data-mce-fragment=\"1\">" +
			"<br data-mce-fragment=\"1\">Utamur discere phaedrum eu nam. Ne quidam placerat per, qui inani diceret cu, " +
			"at nec quot petentium efficiendi. Sea te persius vulputate. Docendi temporibus et quo. Ad duo appareat lobortis definitionem.!</p>" );
		const paragraphTooLong = new EnglishResearcher( paper );
		const expected = [
			new Mark( {
				original: "Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, duis aliquid perfecto ius ea, " +
					"ad pri corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti " +
					"ut eam, eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima " +
					"accumsan signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens " +
					"vituperatoribus, at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, " +
					"dissentiunt liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium " +
					"facilis mea an. Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, " +
					"convenire adversarium efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. " +
					"Wisi nusquam pri no, putent menandri ad duo. Nullam nostrum salutandi eum id, per agam exerci an.",
				marked: "<yoastmark class='yoast-text-mark'>Lorem ipsum dolor sit amet, in magna dolor voluptaria vel, " +
					"duis aliquid perfecto ius ea, " +
					"ad pri corpora petentium torquatos. Eu vidit rationibus vel. No vis partem nominavi neglegentur. Omnis dicat everti " +
					"ut eam, eos ne atqui facer antiopam. Et pri vivendo sensibus perpetua, aperiam epicurei menandri an vix, sea prima " +
					"accumsan signiferumque ad. Nisl commune ei est, ut eum stet cibo, duo malis veniam ut. Cu est veritus adolescens " +
					"vituperatoribus, at eam movet perfecto. Magna consequat at cum. Vel ad fabellas accusata, vel ea erat lorem mediocritatem, " +
					"dissentiunt liberavisse per ex. Duo putant vituperata eu, sit at tota etiam deseruisse. Sed in autem mucius. Errem omnium " +
					"facilis mea an. Eu usu eripuit dissentiet, duo ei perfecto argumentum. Diceret forensibus cu has, quo alia nihil et, " +
					"convenire adversarium efficiantur per id. His mazim virtute ornatus ei, has id vocibus docendi percipitur. " +
					"Wisi nusquam pri no, putent menandri ad duo. Nullam nostrum salutandi eum id, per agam exerci an.</yoastmark>" } ),
		];
		expect( assessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
	it( "should return markers for a text in Japanese", function() {
		const paper = new Paper( "接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。学校文法では、接続詞は文の成分" +
			"としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、山田文法では副詞の一類として接続副詞" +
			"としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。つまり、接続詞は前文を受けて、後文の文末まで" +
			"係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。このように接続詞は前文の内容を後文へと持ち込んで、" +
			"どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。後文への修飾語的性格を持っています。" );
		const paragraphTooLong = new JapaneseResearcher( paper );
		const expected = [
			new Mark( { original: "接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。学校文法では、接続詞は文の成分" +
					"としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、山田文法では副詞の一類として接続副詞" +
					"としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。つまり、接続詞は前文を受けて、後文の文末まで" +
					"係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。このように接続詞は前文の内容を後文へと持ち込んで、" +
					"どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。後文への修飾語的性格を持っています。", marked:
					"<yoastmark class='yoast-text-mark'>接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。" +
					"学校文法では、接続詞は文の成分としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、" +
					"山田文法では副詞の一類として接続副詞としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。" +
					"つまり、接続詞は前文を受けて、後文の文末まで係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。" +
					"このように接続詞は前文の内容を後文へと持ち込んで、どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。" +
					"後文への修飾語的性格を持っています。</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
	it( "should return no markers when no paragraph is too long", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { countLength: 60, text: "" }, { countLength: 11, text: "" },
			{ countLength: 13, text: "" } ] );
		const expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );

describe( "test for paragraph too long assessment when is used in product page analysis", function() {
	it( "should assess a paper on a product page with paragraphs that contain less than 70 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, Factory.buildMockResearcher( [
			{ countLength: 60, text: "" },
			{ countLength: 11, text: "" },
			{ countLength: 13, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
			"None of the paragraphs are too long. Great job!" );
	} );
	it( "should assess a paper on a product page with paragraphs that contain more than 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, Factory.buildMockResearcher( [
			{ countLength: 110, text: "" },
			{ countLength: 150, text: "" },
			{ countLength: 150, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain" +
			" more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
	it( "should assess a paper on a product page with paragraphs that contain between 70 and 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, Factory.buildMockResearcher( [
			{ countLength: 90, text: "" },
			{ countLength: 75, text: "" },
			{ countLength: 80, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
			"more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
} );

describe( "test for paragraph too long assessment for languages that have language-specific config", () => {
	// Japanese has a language specific config for paragraph length. The config is used for the unit tests below.
	describe( "test for non-product pages", () => {
		it( "should assess a paper with paragraphs that contain less than 300 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 200, text: "" },
				{ countLength: 260, text: "" },
				{ countLength: 100, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "should assess a paper with two paragraphs that contain more than 400 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "should assess a paper with paragraphs that contain 300-400 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 350, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 390, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
	describe( "test for product pages", () => {
		it( "should assess a paper with paragraphs that contain less than 140 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 100, text: "" },
				{ countLength: 120, text: "" },
				{ countLength: 90, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "should assess a paper with three paragraphs that contain more than 200 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "should assess a paper with all paragraphs that contain 140-200 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = Factory.buildMockResearcher( [
				{ countLength: 150, text: "" },
				{ countLength: 170, text: "" },
				{ countLength: 200, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
} );

