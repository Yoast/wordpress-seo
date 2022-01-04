import MetaDescriptionLengthAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";

const descriptionLengthAssessment = new MetaDescriptionLengthAssessment();

describe( "a test for assessing the meta description length", function() {
	it( "assesses an empty description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ) );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length" +
			"</a>:  No meta description has been specified. Search engines will display copy from the page instead. " +
			"<a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!" );
	} );

	it( "assesses a short description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is too short (under 120 characters). Up to 156 characters are available. " +
			"<a href='https://yoa.st/34e' target='_blank'>Use the space</a>!" );
	} );

	it( "assesses a too long description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 400 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( descriptionLengthAssessment.getMaximumLength( "en" ) ).toEqual( 156 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is over 156 characters. To ensure the entire description will be visible, " +
			"<a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!" );
	} );

	it( "assesses a good description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 140 ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!" );
	} );
} );

describe( "a test for assessing the meta description length in Japanese", function() {
	describe( "a test in a regular content", () => {
		it( "assesses an empty description", function() {
			const mockPaper = new Paper( "" );
			const researcher = new JapaneseResearcher( mockPaper );

			const assessment = descriptionLengthAssessment.getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 1 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length" +
				"</a>:  No meta description has been specified. Search engines will display copy from the page instead. " +
				"<a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!" );
		} );

		it( "assesses a short description where the text is less than 60 characters", function() {
			const mockPaper = new Paper( "", { description: "塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネ綸乾んみ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const assessment = descriptionLengthAssessment.getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 6 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
				"The meta description is too short (under 60 characters). Up to 80 characters are available. " +
				"<a href='https://yoa.st/34e' target='_blank'>Use the space</a>!" );
		} );

		it( "assesses a too long description where the text contains more than 80 characters", function() {
			const mockPaper = new Paper( "", { description: "治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地" +
					"部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネキロフ殺佐ず持容フ" +
					"よ並道ネホル長英ツヤ第野ヒソア問適チホレ番参び給財がをざイ同綸乾んみ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const assessment = descriptionLengthAssessment.getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 6 );
			expect( descriptionLengthAssessment.getMaximumLength( "ja" ) ).toEqual( 80 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
				"The meta description is over 80 characters. To ensure the entire description will be visible, " +
				"<a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!" );
		} );

		it( "assesses a good description where the text is between 60-80 characters", function() {
			const mockPaper = new Paper( "", { description: "治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部" +
					"れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const assessment = descriptionLengthAssessment.getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!" );
		} );
	} );
	describe( "a test in a cornerstone content", () => {
		it( "assesses an empty description", function() {
			const mockPaper = new Paper( "" );
			const researcher = new JapaneseResearcher( mockPaper );

			const metaDescriptionLengthResult = new MetaDescriptionLengthAssessment( {
				scores:	{
					tooLong: 3,
					tooShort: 3,
				},
			} ).getResult( mockPaper, researcher );

			expect( metaDescriptionLengthResult.getScore() ).toEqual( 1 );
			expect( metaDescriptionLengthResult.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length" +
				"</a>:  No meta description has been specified. Search engines will display copy from the page instead. " +
				"<a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!" );
		} );

		it( "assesses a short description where the text is less than 60 characters", function() {
			const mockPaper = new Paper( "", { description: "塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネ綸乾んみ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const metaDescriptionLengthResult = new MetaDescriptionLengthAssessment( {
				scores:	{
					tooLong: 3,
					tooShort: 3,
				},
			} ).getResult( mockPaper, researcher );

			expect( metaDescriptionLengthResult.getScore() ).toEqual( 3 );
			expect( metaDescriptionLengthResult.getText() ).toEqual(   "<a href='https://yoa.st/34d' target='_blank'>" +
				"Meta description length</a>: The meta description is too short (under 60 characters). Up to 80 characters are available." +
				" <a href='https://yoa.st/34e' target='_blank'>Use the space</a>!"
			);
		} );

		it( "assesses a too long description where the text contains more than 80 characters", function() {
			const mockPaper = new Paper( "", { description: "治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地" +
					"部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネキロフ殺佐ず持容フ" +
					"よ並道ネホル長英ツヤ第野ヒソア問適チホレ番参び給財がをざイ同綸乾んみ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const metaDescriptionLengthResult = new MetaDescriptionLengthAssessment( {
				scores:	{
					tooLong: 3,
					tooShort: 3,
				},
			} ).getResult( mockPaper, researcher );

			expect( metaDescriptionLengthResult.getScore() ).toEqual( 3 );
			expect( metaDescriptionLengthResult.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>" +
				"Meta description length</a>: The meta description is over 80 characters. To ensure the entire description will be visible," +
				" <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!" );
		} );

		it( "assesses a good description where the text is between 60-80 characters", function() {
			const mockPaper = new Paper( "", { description: "治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部" +
					"れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。" } );
			const researcher = new JapaneseResearcher( mockPaper );

			const metaDescriptionLengthResult = new MetaDescriptionLengthAssessment( {
				scores:	{
					tooLong: 3,
					tooShort: 3,
				},
			} ).getResult( mockPaper, researcher );

			expect( metaDescriptionLengthResult.getScore() ).toEqual( 9 );
			expect( metaDescriptionLengthResult.getText() ).toEqual(  "<a href='https://yoa.st/34d' target='_blank'>" +
				"Meta description length</a>: Well done!" );
		} );
	} );
} );
