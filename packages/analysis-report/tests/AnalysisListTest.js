import React from "react";
import renderer from "react-test-renderer";
import { AnalysisList } from "yoast-components";
import { AnalysisResult } from "../src";

describe( "The AnalysisList component", () => {
	it( "renders a list of analysis results", () => {
		const results = [
			{
				score: 9,
				rating: "good",
				hasMarks: false,
				id: "sentenceBeginnings",
				text: "<a href='https://yoa.st/35f?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Consecutive sentences</a>: " +
						"There is enough variety in your sentences. That's great!",
				markerId: "sentenceBeginnings",
			},
			{
				score: 6,
				rating: "OK",
				hasMarks: false,
				id: "imageKeyphrase",
				text: "<a href='https://yoa.st/4f7?" +
					  "php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
					  "&days_active=6-30&user_language=en_US' target='_blank'>Image Keyphrase</a>: " +
					  "Images on this page do not have alt attributes that reflect the topic of your text. " +
					  "<a href='https://yoa.st/4f6?" +
					  "php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11&" +
					  "days_active=6-30&user_language=en_US' target='_blank'>" +
					  "Add your keyphrase or synonyms to the alt tags of relevant images</a>!",
				markerId: "imageKeyphrase",
			},
			{
				score: 3,
				rating: "bad",
				hasMarks: false,
				id: "textTransitionWords",
				text: "<a href='https://yoa.st/34z?" +
					  "php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
					  "&days_active=6-30&user_language=en_US' target='_blank'>Transition words</a>: " +
					  "None of the sentences contain transition words. <a href='https://yoa.st/35a?php_version=7.4&" +
					  "platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
					  "&days_active=6-30&user_language=en_US' target='_blank'>Use some</a>.",
				markerId: "textTransitionWords",
			},
		];

		const render = renderer.create( <AnalysisList results={ results } /> );
		const analysisResults = render.root.findAllByType( AnalysisResult );

		expect( analysisResults ).toHaveLength( results.length );

		expect( analysisResults[ 0 ].props.bulletColor ).toEqual( "#7ad03a" );
		expect( analysisResults[ 0 ].props.text ).toEqual( results[ 0 ].text );

		expect( analysisResults[ 1 ].props.bulletColor ).toEqual( "#ee7c1b" );
		expect( analysisResults[ 1 ].props.text ).toEqual( results[ 1 ].text );

		expect( analysisResults[ 2 ].props.bulletColor ).toEqual( "#dc3232" );
		expect( analysisResults[ 2 ].props.text ).toEqual( results[ 2 ].text );
	} );

	it( "renders a list with the right aria-label when the mark buttons are disabled", () => {
		const results = [
			{
				score: 9,
				rating: "good",
				hasMarks: false,
				id: "sentenceBeginnings",
				text: "<a href='https://yoa.st/35f?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Consecutive sentences</a>: " +
						"There is enough variety in your sentences. That's great!",
				markerId: "sentenceBeginnings",
			},
		];

		const render = renderer.create( <AnalysisList results={ results } marksButtonStatus={ "disabled" } /> );
		const analysisResults = render.root.findAllByType( AnalysisResult );

		expect( analysisResults ).toHaveLength( results.length );

		expect( analysisResults[ 0 ].props.ariaLabel ).toEqual( "Marks are disabled in current view" );
	} );

	it( "renders a list of analysis results with one upsell result", () => {
		const results = [
			{
				score: 0,
				rating: "upsell",
				hasMarks: false,
				id: "someUpsell",
				text: "<span style='text-decoration: underline'>Keyphrase distribution</span>: " +
						"Have you evenly distributed your focus keyphrase throughout the whole text? Yoast SEO Premium will tell you!",
				markerId: "someUpsell",
			},
			{
				score: 9,
				rating: "good",
				hasMarks: false,
				id: "sentenceBeginnings",
				text: "<a href='https://yoa.st/35f?" +
						"php_version=7.4&platform=wordpress&platform_version=6.0&software=free&software_version=19.1-RC11" +
						"&days_active=6-30&user_language=en_US' target='_blank'>Consecutive sentences</a>: " +
						"There is enough variety in your sentences. That's great!",
				markerId: "sentenceBeginnings",
			},
		];

		const render = renderer.create( <AnalysisList results={ results } /> );
		const analysisResults = render.root.findAllByType( AnalysisResult );

		expect( analysisResults ).toHaveLength( results.length );

		expect( analysisResults[ 0 ].props.suppressedText ).toEqual( true );
	} );
} );
