import { render, StrictMode } from "@wordpress/element";
import registerAnalysisStore from "@yoast/seo-store";
import App from "./app";
import "./index.css";
import registerReplacementVariables from "./replacement-variables";
import registerSeoTitleWidth from "./seo-title-width";

registerReplacementVariables();
registerSeoTitleWidth();
registerAnalysisStore( {
	analyze: async ( paper, keyphrases, config ) => {
		console.log( "analyze", paper, keyphrases, config );
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		return {
			seo: {
				focus: {
					score: 10,
					results: [
						{
							score: -10,
							rating: "bad",
							hasMarks: false,
							marker: [],
							id: "test",
							text: "Bad result text",
							markerId: "testMarker",
						},
					],
				},
			},
			readability: {
				score: 10,
				results: [
					{
						score: -10,
						rating: "bad",
						hasMarks: false,
						marker: [],
						id: "test",
						text: "Bad result text",
						markerId: "testMarker",
					},
				],
			},
			research: {
				morphology: {},
			},
		};
	},
} );

render(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById( "root" ),
);
