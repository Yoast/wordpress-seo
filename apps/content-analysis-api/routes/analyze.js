const { assessments, assessors, ensureTree } = require( "yoastseo" );
const { toResultDto } = require( "yoastseo/contract" );
const { getResearcher } = require( "../helpers/get-researcher" );
const { paperFromRequest } = require( "../helpers/paper-from-request" );
const { paperLanguage } = require( "../helpers/paper-language" );

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

module.exports = function( app ) {
	app.get( "/analyze", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}

		// Fetch the Researcher and set the morphology data for the given language (yes, this is a bit hacky)
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );

		const seoAssessor = new SEOAssessor( researcher );
		seoAssessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );
		seoAssessor.addAssessment( "TextTitleAssessment", new TextTitleAssessment() );
		const contentAssessor = new ContentAssessor( researcher );
		contentAssessor.addAssessment( "wordComplexity", new WordComplexityAssessment() );
		contentAssessor.addAssessment( "textAlignment", new TextAlignmentAssessment() );
		const relatedKeywordAssessor = new RelatedKeywordAssessor( researcher );
		const inclusiveLanguageAssessor = new InclusiveLanguageAssessor( researcher );

		// Build the tree once up front so all four assessors reuse it instead of each rebuilding.
		ensureTree( paper, researcher );

		seoAssessor.assess( paper );
		contentAssessor.assess( paper );
		relatedKeywordAssessor.assess( paper );
		inclusiveLanguageAssessor.assess( paper );

		response.json( {
			seo: seoAssessor.getValidResults().map( toResultDto ),
			readability: contentAssessor.getValidResults().map( toResultDto ),
			relatedKeyword: relatedKeywordAssessor.getValidResults().map( toResultDto ),
			inclusiveLanguage: inclusiveLanguageAssessor.getValidResults().map( toResultDto ),
		} );
	} );

	app.get( "/analyze/seo", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new SEOAssessor( researcher );
		assessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );
		assessor.addAssessment( "TextTitleAssessment", new TextTitleAssessment() );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/readability", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new ContentAssessor( researcher );
		assessor.addAssessment( "wordComplexity", new WordComplexityAssessment() );
		assessor.addAssessment( "textAlignment", new TextAlignmentAssessment() );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/related-keyphrase", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new RelatedKeywordAssessor( researcher );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/inclusive-language", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new InclusiveLanguageAssessor( researcher );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/meta-description", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		// This endpoint analyses the meta description, so one is required (the contract leaves it optional).
		if ( ! paper.getDescription() ) {
			return response.status( 400 ).json( { error: "Description is required" } );
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new MetaDescriptionAssessor( researcher );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/seo-title", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		// This endpoint analyses the SEO title, so one is required (the contract leaves it optional).
		if ( ! paper.getTitle() ) {
			return response.status( 400 ).json( { error: "Title is required" } );
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new SeoTitleAssessor( researcher );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/keyphrase", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		// This endpoint is keyphrase analysis, so a keyphrase is required (the contract leaves it optional).
		if ( ! paper.hasKeyword() ) {
			return response.status( 400 ).json( { error: "A keyphrase is required" } );
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new KeyphraseAssessor( researcher );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );

	app.get( "/analyze/keyphrase-use", ( request, response ) => {
		const paper = paperFromRequest( request, response );
		if ( ! paper ) {
			return;
		}
		// This endpoint is keyphrase analysis, so a keyphrase is required (the contract leaves it optional).
		if ( ! paper.hasKeyword() ) {
			return response.status( 400 ).json( { error: "A keyphrase is required" } );
		}
		const language = paperLanguage( paper );
		const researcher = getResearcher( language );
		const assessor = new KeyphraseUseAssessor( researcher );
		assessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment() );
		ensureTree( paper, researcher );
		assessor.assess( paper );
		response.json( assessor.getValidResults().map( toResultDto ) );
	} );
}
