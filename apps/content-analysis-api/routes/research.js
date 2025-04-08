const { Paper } = require( "yoastseo" );
const { build } = require( "yoastseo/build/parse/build" );
const { LanguageProcessor } = require( "yoastseo/build/parse/language" );
const { getResearcher } = require( "../helpers/get-researcher" );

module.exports = function( app ) {
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

	app.get( "/research/sentence-count", ( request, response ) => {
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		paper.setTree( build( paper, new LanguageProcessor( researcher ), paper._attributes && paper._attributes.shortcodes ) );
		researcher.setPaper( paper );
		const sentenceLengths = researcher.getResearch( "countSentencesFromText" );

		const responseBody = sentenceLengths.map( sentence => ( { sentence: sentence.sentence.text, length: sentence.sentenceLength } ) );
		response.json( responseBody );
	} );

	app.get( "/research/paragraph-count", ( request, response ) => {
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		paper.setTree( build( paper, new LanguageProcessor( researcher ), paper._attributes && paper._attributes.shortcodes ) );
		researcher.setPaper( paper );
		const paragraphLengths = researcher.getResearch( "getParagraphLength" );

		const responseBody = paragraphLengths.map( paragraph => ( { length: paragraph.paragraphLength } ) );
		response.json( responseBody );
	} );
}
