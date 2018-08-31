// External dependencies.
import React from "react";
import PropTypes from "prop-types";

// YoastSEO.js dependencies.
import { AnalysisWorkerWrapper } from "yoastseo/worker";
import testPapers from "yoastspec/fullTextTests/testTexts";
import Paper from "../../../src/values/Paper";

// Internal dependencies.
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import Results from "./Results";
import AnalysisWebWorker from "./analysis.worker";

import { clearStorage } from "./redux/utils/localstorage";
import WorkerStatus from "./components/WorkerStatus";
import { connect } from "react-redux";
import { setResults } from "./redux/actions/results";
import { setConfigurationAttribute } from "./redux/actions/configuration";
import Inputs from "./components/Inputs";

class App extends React.Component {
	/**
	 * Initializes the App component.
	 *
	 * @param {Object} props               The props.
	 * @param {Object} props.configuration The store configuration.
	 * @param {Object} props.paper         The store paper.
	 * @param {Object} props.results       The store analyses results.
	 * @param {Object} props.actions       The dispatch actions.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.analysisWorker = new AnalysisWorkerWrapper( new AnalysisWebWorker() );

		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );
		this.analyzeSpam = this.analyzeSpam.bind( this );

		this.initialize();
	}

	/**
	 * Initialize the analysis worker.
	 *
	 * @returns {void}
	 */
	initialize() {
		const { configuration } = this.props;

		this.analysisWorker.initialize( configuration )
		    .then( data => console.log( "initialization done!", data ) );
	}

	/**
	 * Requests the analyses results from the worker.
	 *
	 * @param {paper} paper The paper to analyze.
	 *
	 * @returns {void}
	 */
	analyze( paper = this.props.paper ) {
		paper = Paper.parse( paper );

		this.analysisWorker.analyze( paper )
			.then( ( { result } ) => {
				console.log( result );

				this.props.setResults( {
					readability: result.readability.results,
					seo: result.seo[ "" ].results,
				} );
		    } );
	}

	/**
	 * Runs analysis on the full-text test papers.
	 *
	 * @returns {void}
	 */
	analyzeSpam() {
		for ( let i = 0; i < 10; i++ ) {
			testPapers.forEach( ( { paper: paper } ) => {
				this.analyze( {
					text: paper._text,
					...paper._attributes,
				} );
			} );
		}
	}

	/**
	 * Renders the app.
	 *
	 * @returns {ReactElement} The app.
	 */
	render() {
		const { configuration } = this.props;

		return (
			<div className="app">
				<h1>YoastSEO.js development tool</h1>

				<h2>Worker status</h2>

				<WorkerStatus />

				Updating
				Analyzing
				Idling

				<h3>How long did the last analysis take?</h3>

				30ms

				<ul>
					<li>Debugging information</li>
					<li>Worker communication</li>
					<li>Information about when it is refreshing</li>
					<li>Buttons for standard texts in different languages</li>
					<li>Language switcher</li>

					<li>Input fields for everything</li>
					<li>Total scores</li>
					<li>Analysis results</li>

					<li>All research data</li>
					<li>Relevant words</li>

					<li>Performance information</li>
				</ul>

				<h2>Input</h2>

				<Inputs />

				<div className="left-container">
					<div className="form-container">
						<h2>Analysis Worker</h2>
						<div className="button-container">
							<Button onClick={ this.initialize }>Initialize</Button>
							<Button onClick={ this.analyze }>Analyze</Button>
							<Button onClick={ () => {
								clearStorage();
								window.location.reload();
							} }>Clear</Button>
							<Button onClick={ this.analyzeSpam }>Analyze Spam</Button>
						</div>

						<h2>Configuration</h2>
						<Checkbox
							id="premium"
							value={ configuration.useKeywordDistribution }
							label="Premium"
							onChange={ value => {
								this.props.setConfigurationAttribute( "useKeywordDistribution", value );
							} }
						/>
					</div>
					<div className="output-container">
						<h2>SEO assessments</h2>
						<Results results={ this.props.results.seo } />
						<div id="output" className="output">

						</div>
						<h2>Content assessments</h2>
						<Results results={ this.props.results.readability } />
						<div id="contentOutput" className="output">

						</div>
					</div>
				</div>
				<div className="right-container">
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
								      d={ "M415,500H85c-46.8,0-85-38.2-85-85V85C0,38.2,38.2,0,85,0" +
								          "h330c46.8,0,85,38.2,85,85v330 C500,461.8,461.8,500,415,500z" }/>
								<path fill="none" stroke="#7EADB9" strokeWidth="17" strokeMiterlimit="10"
								      d={ "M404.6,467H95.4C61.1,467,33,438.9,33,404.6V95.4 C33,61.1,61.1,33,95.4,33" +
								          "h309.2c34.3,0,62.4,28.1,62.4,62.4v309.2C467,438.9,438.9,467,404.6,467z" }/>
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

App.propTypes = {
	configuration: PropTypes.object.isRequired,
	paper: PropTypes.object.isRequired,
	results: PropTypes.object.isRequired,
};

export default connect(
	( state ) => {
		return state;
	},
	( dispatch ) => {
		return {
			setResults: ( ...args ) => dispatch( setResults( ...args ) ),
			setConfigurationAttribute: ( ...args ) => dispatch( setConfigurationAttribute( ...args ) ),
		};
	}
)( App );
