import renderer from "react-test-renderer";
import { AnalysisList } from "yoast-components";
import { AnalysisResult } from "../src";

describe( "The AnalysisList component", () => {
	it( "renders a list of analysis results", () => {
		const results = [
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "passiveVoice",
				"text": "<a href='https://yoa.st/34t?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Passive voice</a>: " +
						"You're using enough active voice. That's great!",
				"markerId": "passiveVoice",
			},
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "sentenceBeginnings",
				"text": "<a href='https://yoa.st/35f?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Consecutive sentences</a>: " +
						"There is enough variety in your sentences. That's great!",
				"markerId": "sentenceBeginnings",
			},
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "subheadingsTooLong",
				"text": "<a href='https://yoa.st/34x?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Subheading distribution</a>: " +
						"You are not using any subheadings, but your text is short enough and probably doesn't need them.",
				"markerId": "subheadingsTooLong",
			},
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "textParagraphTooLong",
				"text": "<a href='https://yoa.st/35d?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Paragraph length</a>: " +
						"None of the paragraphs are too long. Great job!",
				"markerId": "textParagraphTooLong",
			},
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "textSentenceLength",
				"text": "<a href='https://yoa.st/34v?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Sentence length</a>: Great!",
				"markerId": "textSentenceLength",
			},
		];

		const render = renderer.create( <AnalysisList results={ results }/> );
		const analysisResults = render.root.findAllByType( AnalysisResult );

		expect( analysisResults ).toHaveLength( results.length );

		analysisResults.forEach( ( result, index ) => {
			expect( result.props.bulletColor ).toEqual( "#7ad03a" );
			expect( result.props.text ).toEqual( results[ index ].text );
		} );
	} );

	it( "renders a list of analysis results with one upsell result", () => {
		const results = [
			{
				"score": 0,
				"rating": "upsell",
				"hasMarks": false,
				"id": "someUpsell",
				"text": "<span style='text-decoration: underline'>Keyphrase distribution</span>: " +
						"Have you evenly distributed your focus keyphrase throughout the whole text? Yoast SEO Premium will tell you!",
				"markerId": "someUpsell",
			},
			{
				"score": 9,
				"rating": "good",
				"hasMarks": false,
				"id": "sentenceBeginnings",
				"text": "<a href='https://yoa.st/35f?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Consecutive sentences</a>: " +
						"There is enough variety in your sentences. That's great!",
				"markerId": "sentenceBeginnings",
			},
		];

		const render = renderer.create( <AnalysisList results={ results }/> );
		const analysisResults = render.root.findAllByType( AnalysisResult );

		expect( analysisResults ).toHaveLength( results.length );

		expect( analysisResults[ 0 ].props.suppressedText ).toEqual( true );
	} );
} );
