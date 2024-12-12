const { Paper, App, interpreters, languageProcessing, assessments, helpers, assessors } = require( "yoastseo" );
const express = require( "express" );
const LanguageProcessor = require( "yoastseo/src/parse/language/LanguageProcessor" );
const { SEOAssessor, ContentAssessor, RelatedKeywordAssessor, InclusiveLanguageAssessor } = assessors;

// Premium assessments
const keyphraseDistribution = languageProcessing.researches.keyphraseDistribution;
const KeyphraseDistributionAssessment = assessments.seo.KeyphraseDistributionAssessment;

const TextTitleAssessment = assessments.seo.TextTitleAssessment;

const getLanguagesWithWordComplexity = helpers.getLanguagesWithWordComplexity;
const wordComplexity = languageProcessing.researches.wordComplexity;
const WordComplexityAssessment = assessments.readability.WordComplexityAssessment;

const getLongCenterAlignedTexts = languageProcessing.researches.getLongCenterAlignedTexts;
const TextAlignmentAssessment = assessments.readability.TextAlignmentAssessment;

const MORPHOLOGY_VERSIONS = {
	en: "v6",
	de: "v10",
	es: "v10",
	fr: "v11",
	it: "v10",
	nl: "v9",
	ru: "v10",
	id: "v9",
	pt: "v9",
	pl: "v9",
	ar: "v9",
	sv: "v1",
	he: "v1",
	hu: "v2",
	nb: "v1",
	tr: "v1",
	cs: "v1",
	sk: "v1",
	ja: "v1",
};

/**
 * Maps the result to a view model, ready to be sent to the client.
 * @param {AssessmentResult[]} result The result to map.
 * @returns {{score, editFieldName, text, marks}} The view model.
 */
const resultToVM = ( result ) => {
	const { _identifier, score, text, marks, editFieldName } = result;
	return { _identifier, score, text, marks, editFieldName, rating: interpreters.scoreToRating( score ) };
};

const app = express();
app.use( express.json() );

/**
 * Get a Researcher instance for a specific language.
 *
 * @param {string} language The language to get the Researcher for.
 * @returns {Researcher} The Researcher instance.
 */
const getResearcher = ( language ) => {
	const dataVersion = MORPHOLOGY_VERSIONS[ language ];
	// eslint-disable-next-line global-require
	const { "default": Researcher } = require( `yoastseo/build/languageProcessing/languages/${language}/Researcher` );
	// eslint-disable-next-line global-require
	const premiumData = require( `yoastseo/premium-configuration/data/morphologyData-${language}-${dataVersion}.json` );

	const researcher = new Researcher();
	researcher.addResearchData( "morphology", premiumData );
	researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
	if ( getLanguagesWithWordComplexity().includes( language ) ) {
		researcher.addResearch( "wordComplexity", wordComplexity );
		researcher.addHelper( "checkIfWordIsComplex", helpers.getWordComplexityHelper( language ) );
		researcher.addConfig( "wordComplexity", helpers.getWordComplexityConfig( language ) );
	}
	researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );

	return researcher;
};

app.get( "/analyze", ( request, response ) => {
	// Fetch the Researcher and set the morphology data for the given language (yes, this is a bit hacky)
	const language = request.body.locale || "en";

	const researcher = getResearcher( language );

	const seoAssessor = new SEOAssessor( researcher );
	seoAssessor.addAssessment("keyphraseDistribution", new KeyphraseDistributionAssessment());
	seoAssessor.addAssessment("TextTitleAssessment", new TextTitleAssessment());
	const contentAssessor = new ContentAssessor( researcher );
	contentAssessor.addAssessment("wordComplexity", new WordComplexityAssessment());
	contentAssessor.addAssessment("textAlignment", new TextAlignmentAssessment());
	const relatedKeywordAssessor = new RelatedKeywordAssessor( researcher );
	const inclusiveLanguageAssessor = new InclusiveLanguageAssessor( researcher );

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

app.get( "/analyze/seo", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const assessor = new SEOAssessor( researcher );
	assessor.addAssessment("keyphraseDistribution", new KeyphraseDistributionAssessment());
	assessor.addAssessment("TextTitleAssessment", new TextTitleAssessment());

	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	assessor.assess( paper );
	response.json( assessor.getValidResults().map( resultToVM ) );
} );

app.get( "/analyze/readability", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const assessor = new ContentAssessor( researcher );
	assessor.addAssessment("wordComplexity", new WordComplexityAssessment());
	assessor.addAssessment("textAlignment", new TextAlignmentAssessment());
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	assessor.assess( paper );
	response.json( assessor.getValidResults().map( resultToVM ) );
} );

app.get( "/analyze/related-keyphrase", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const assessor = new RelatedKeywordAssessor( researcher );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	assessor.assess( paper );
	response.json( assessor.getValidResults().map( resultToVM ) );
} );

app.get( "/analyze/inclusive-language", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const assessor = new InclusiveLanguageAssessor( researcher );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	assessor.assess( paper );
	response.json( assessor.getValidResults().map( resultToVM ) );
} );

app.get( "/research/estimated-reading-time", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	researcher.setPaper( paper );
	const estimatedReadingTime = researcher.getResearch( "readingTime" );
	response.json( { time: estimatedReadingTime } );
} );

app.get( "/research/flesch-reading-ease", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	researcher.setPaper( paper );
	const fleschReadingEaseScore = researcher.getResearch( "getFleschReadingScore" );
	response.json( { score: fleschReadingEaseScore.score, difficulty: fleschReadingEaseScore.difficulty } );
} );


app.get( "/research/word-count", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	researcher.setPaper( paper );
	const wordCount = researcher.getResearch( "wordCountInText" );
	response.json( { count: wordCount.count, unit: wordCount.unit } );
} );

app.get( "/tokenize/", ( request, response ) => {
	const language = request.body.locale || "en";
	const researcher = getResearcher( language );
	const paper = new Paper(
		request.body.text || "",
		request.body || {}
	);
	const languageProcessor = new LanguageProcessor( researcher );
	researcher.setPaper( paper );
	const = researcher.getResearch( "" );
	response.json( { count: wordCount.count, unit: wordCount.unit } );
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
