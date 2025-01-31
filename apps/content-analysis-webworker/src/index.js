import { AnalysisWorkerWrapper, Paper } from "yoastseo";

// `url` needs to be the full URL to the script for the browser to know where to load the worker script from.
// This should be the script created by the previous code-snippet.
const worker = new AnalysisWorkerWrapper( new Worker( new URL("./worker.js", import.meta.url) ) );

const createResultSection = (title, results) => {
	const section = document.createElement('section');
	const header = document.createElement('h2');
	header.textContent = title;
	section.appendChild(header);
	const resultList = document.createElement('ul');
	section.appendChild(resultList);

	results.forEach(result => {
		if (result.text) {
			const resultText = document.createElement('li');
			resultText.innerHTML = result.text;
			resultList.appendChild(resultText);
		}
	});

	return section;
}

document.addEventListener("DOMContentLoaded", function(event) {
	const analyze = document.getElementById( 'analyze' );
	analyze.addEventListener("click", event => {
		const paperText = document.getElementById( 'paper' ).value;
		const keyphrase = document.getElementById( 'keyphrase' ).value;
		const resultPre = document.getElementById( 'result-pre' );

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
			resultPre.textContent = JSON.stringify( results, null, 2 );

			const container = document.getElementById('result-div');
			container.innerHTML = '';

			const seoSection = createResultSection('SEO', results.result.seo[""].results);
			container.appendChild(seoSection);
			const readabilitySection = createResultSection('Readability', results.result.readability.results);
			container.appendChild(readabilitySection);
		} ).catch( ( error ) => {
			console.error( 'An error occurred while analyzing the text:' );
			console.error( error );
			resultPre.textContent = JSON.stringify( error );
		} );
	});
});
