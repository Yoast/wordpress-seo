const { Paper, assessments, assessors, interpreters } = require( "yoastseo" );
const { getResearcher } = require( "../helpers/get-researcher" );

const express = require( "express" ), app = express();

// Assessors
const { SEOAssessor,
	ContentAssessor,
	RelatedKeywordAssessor,
	InclusiveLanguageAssessor,
	MetaDescriptionAssessor,
	SeoTitleAssessor,
	KeyphraseUseAssessor,
	KeyphraseAssessor
} = assessors;

// Premium assessments
const KeyphraseDistributionAssessment = assessments.seo.KeyphraseDistributionAssessment;
const TextTitleAssessment = assessments.seo.TextTitleAssessment;
const WordComplexityAssessment = assessments.readability.WordComplexityAssessment;
const TextAlignmentAssessment = assessments.readability.TextAlignmentAssessment;

/**
 * Maps the result to a view model, ready to be sent to the client.
 * @param {AssessmentResult[]} result The result to map.
 * @returns {{score, editFieldName, text, marks}} The view model.
 */
const resultToVM = ( result ) => {
	const { _identifier, score, text, marks, editFieldName } = result;
	return { _identifier, score, text, marks, editFieldName, rating: interpreters.scoreToRating( score ) };
};

module.exports = function( app ) {
	app.get( "/analyze", ( request, response ) => {
		// Fetch the Researcher and set the morphology data for the given language (yes, this is a bit hacky)
		const language = request.body.locale || "en";

		const researcher = getResearcher( language );

		const seoAssessor = new SEOAssessor( researcher );
		seoAssessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );
		seoAssessor.addAssessment( "TextTitleAssessment", new TextTitleAssessment() );
		const contentAssessor = new ContentAssessor( researcher );
		contentAssessor.addAssessment( "wordComplexity", new WordComplexityAssessment() );
		contentAssessor.addAssessment( "textAlignment", new TextAlignmentAssessment() );
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
		assessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );
		assessor.addAssessment( "TextTitleAssessment", new TextTitleAssessment() );

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
		assessor.addAssessment( "wordComplexity", new WordComplexityAssessment() );
		assessor.addAssessment( "textAlignment", new TextAlignmentAssessment() );
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

	app.get( "/analyze/meta-description", ( request, response ) => {
		if (! request.body.description) {
			return response.status( 400 ).json( { error: "Description is required" } );
		}
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const assessor = new MetaDescriptionAssessor( researcher );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( resultToVM ) );
	} );

	app.get( "/analyze/seo-title", ( request, response ) => {
		if (! request.body.title) {
			return response.status( 400 ).json( { error: "Title is required" } );
		}
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const assessor = new SeoTitleAssessor( researcher );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( resultToVM ) );
	} );

	app.get( "/analyze/keyphrase", ( request, response ) => {
		if (! request.body.keyword) {
			return response.status( 400 ).json( { error: "Keyword is required" } );
		}
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const assessor = new KeyphraseAssessor( researcher );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( resultToVM ) );
	} );

	app.get( "/analyze/keyphrase-use", ( request, response ) => {
		if (! request.body.keyword) {
			return response.status( 400 ).json( { error: "Keyword is required" } );
		}
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const assessor = new KeyphraseUseAssessor( researcher );
		assessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );

		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( resultToVM ) );
	} );
}
