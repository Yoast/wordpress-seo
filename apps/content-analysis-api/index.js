const { SeoAssessor, Paper, ContentAssessor, App, interpreters } = require( "yoastseo" );
const express = require( "express" );
const { "default": Researcher } = require( "yoastseo/build/languageProcessing/languages/en/Researcher" );
const { "default": RelatedKeywordAssessor } = require( "yoastseo/build/scoring/relatedKeywordAssessor" );
const { "default": InclusiveLanguageAssessor } = require( "yoastseo/build/scoring/InclusiveLanguageAssessor" );

const seoAssessor = new SeoAssessor( new Researcher() );
const contentAssessor = new ContentAssessor( new Researcher() );
const relatedKeywordAssessor = new RelatedKeywordAssessor( new Researcher() );
const inclusiveLanguageAssessor = new InclusiveLanguageAssessor( new Researcher() );


/**
 * Maps the result to a view model, ready to be sent to the client.
 * @param {AssessmentResult[]} result The result to map.
 * @returns {{score, editFieldName, text, marks}} The view model.
 */
const resultToVM = ( result ) => {
	const { score, text, marks, editFieldName } = result;
	return { score, text, marks, editFieldName, rating: interpreters.scoreToRating( score )};
};

const app = express();
app.use( express.json() );

app.get( "/analyze", ( request, response ) => {
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);

	seoAssessor.assess( paper );
	contentAssessor.assess( paper );
	relatedKeywordAssessor.assess( paper );
	inclusiveLanguageAssessor.assess( paper );

	response.json( {
		seo: seoAssessor.getValidResults().map( resultToVM ),
		readability: contentAssessor.getValidResults().map( resultToVM ),
		relatedKeyword: relatedKeywordAssessor.getValidResults().map( resultToVM ),
		inclusiveLanguage: inclusiveLanguageAssessor.getValidResults().map( resultToVM ),
	} );
} );


// Failing example using the App class. App uses createMeasurementElement, which is a browser-only function.
app.get( "/app", ( req, res ) => {
	const contentAnalysis = new App( {
		callbacks: { getData: () => ( { text: "" } ) },
		targets: { snippet: "this field is required" },
	} );
	res.send( "done" );
} );

const listener = app.listen( process.env.PORT, () => {
	console.log( "Listening on : http://localhost:" + listener.address().port );
} );
