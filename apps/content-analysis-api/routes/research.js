const { Paper } = require( "yoastseo" );
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
		researcher.setPaper( paper );
		const sentenceLengths = researcher.getResearch( "countSentencesFromText" );

		const responseBody = sentenceLengths.map( sentence => ( { sentence: sentence.sentence, length: sentence.sentenceLength } ) );
		response.json( responseBody );
	} );

	app.get( "/research/paragraph-count", ( request, response ) => {
		const language = request.body.locale || "en";
		const researcher = getResearcher( language );
		const paper = new Paper(
			request.body.text || "",
			request.body || {}
		);
		researcher.setPaper( paper );
		const paragraphLengths = researcher.getResearch( "getParagraphLength" );

		const responseBody = paragraphLengths.map( paragraph => ( { paragraph: paragraph.text, length: paragraph.countLength } ) );
		response.json( responseBody );
	} );
}
