import React from 'react';

import './App.css';
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import Button from "./components/Button";
import AnalysisWorker from "./analysis/AnalysisWorker";

class App extends React.Component {
	constructor( props ) {
		super( props );

		this.analysisWorker = new AnalysisWorker();

		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );
	}

	initialize() {
		this.analysisWorker.initialize( {} ).then( () => console.log( "initialization done!" ) );
	}

	analyze() {
		this.analysisWorker.analyze( "paper" ).then( () => console.log( "analyzation done!" ) );
	}

	render() {
		return (
			<div className="App">
				<div className="content-sidebar-wrap">
					<div id="input" className="form-container">
						<div id="inputForm" className="inputForm">
							<h2>Analysis Worker</h2>
							<Button onClick={ this.initialize }>Initialize</Button>
							<Button onClick={ this.analyze }>Analyze</Button>

							<Input id="locale" label="Locale" placeholder="en_US" />
							<TextArea id="content" label="Text" placeholder="Start writing your text!" />
							<Input id="focusKeyword" label="Focus keyword" placeholder="Choose a focus keyword" />
							<Input id="synonyms" label="Synonyms" placeholder="Choose synonyms" />
							<Input id="premium" label="Premium" type="checkbox" />

							<Button id="refresh-analysis">Refresh!</Button>
						</div>
						<form id="snippetForm" className="snippetForm">
							<label>Snippet Preview</label>
							<div id="snippet" className="output"></div>
						</form>
					</div>
					<div id="output-container" className="output-container">
						<p>This is what the page might look like on a Google search result page.</p>

						<p>Edit the SEO title and meta description by clicking the title and meta description!</p>
						<h2>SEO assessments</h2>
						<div id="output" className="output">

						</div>
						<h2>Content assessments</h2>
						<div id="contentOutput" className="output">

						</div>
					</div>
				</div>
				<div className="overallScore-container">
					<h2>The SEO score</h2>

					<p>This is the overall score for the text and snippet preview.</p>

					<div id="overallScore" className="overallScore">
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500"
						     enableBackground="new 0 0 500 500" width="100" height="100" role="img" aria-hidden="true"
						     focusable="false">
							<g id="BG"/>
							<g id="BG_dark"/>
							<g id="bg_light">
								<path fill="#5B2942"
								      d="M415,500H85c-46.8,0-85-38.2-85-85V85C0,38.2,38.2,0,85,0h330c46.8,0,85,38.2,85,85v330 C500,461.8,461.8,500,415,500z"/>
								<path fill="none" stroke="#7EADB9" strokeWidth="17" strokeMiterlimit="10"
								      d="M404.6,467H95.4C61.1,467,33,438.9,33,404.6V95.4 C33,61.1,61.1,33,95.4,33h309.2c34.3,0,62.4,28.1,62.4,62.4v309.2C467,438.9,438.9,467,404.6,467z"/>
							</g>
							<g id="Layer_2">
								<circle id="score_circle_shadow" fill="#77B227" cx="250" cy="250" r="155"/>
								<path id="score_circle" fill="#9FDA4F"
								      d="M172.5,384.2C98.4,341.4,73,246.6,115.8,172.5S253.4,73,327.5,115.8"/>
								<g>
									<g>
										<g display="none">
											<path display="inline" fill="#FEC228"
											      d="M668,338.4c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
											<path display="inline" fill="#8BDA53"
											      d="M668,215.1c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
											<path display="inline" fill="#FF443D"
											      d="M668,461.7c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
										</g>
									</g>
								</g>
							</g>
						</svg>

						<h2>Marked text</h2>
						<div className="marked-text"/>
						<hr/>
						<h2>Raw marked text</h2>
						<pre className="marked-text-raw"/>
					</div>

				</div>
			</div>
		);
	}
}

export default App;
