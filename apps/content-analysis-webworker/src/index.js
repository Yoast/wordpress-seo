import { AnalysisWorkerWrapper, Paper } from "yoastseo";

// `url` needs to be the full URL to the script for the browser to know where to load the worker script from.
// This should be the script created by the previous code-snippet.
const worker = new AnalysisWorkerWrapper( new Worker( new URL("./worker.js", import.meta.url) ) );

document.addEventListener("DOMContentLoaded", function(event) {
	const analyzeButton = document.querySelector( '#analyze' );
	analyzeButton.addEventListener("click", function(event) {
		const paperText = document.querySelector( '#paper' ).value;
		const keyphrase = document.querySelector( '#keyphrase' ).value;
		const result = document.querySelector( '#result' );

		worker.initialize( {
			logLevel: "TRACE", // Optional, see https://github.com/pimterry/loglevel#documentation
		} ).then( () => {
			// The worker has been configured, we can now analyze a Paper.
			const paper = new Paper( paperText, {
				keyword: keyphrase,
			} );

			return worker.analyze( paper );
		} ).then( ( results ) => {
			console.log( 'Analysis results:' );
			console.log( results );
			result.textContent = JSON.stringify( results );
		} ).catch( ( error ) => {
			console.error( 'An error occurred while analyzing the text:' );
			console.error( error );
			result.textContent = JSON.stringify( error );
		} );
	});
});
