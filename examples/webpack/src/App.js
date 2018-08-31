// External dependencies.
import React, { Fragment } from "react";
import PropTypes from "prop-types";

// YoastSEO.js dependencies.
import { AnalysisWorkerWrapper } from "../../../src/worker";
import testPapers from "yoastspec/fullTextTests/testTexts";
import Paper from "../../../src/values/Paper";

// Internal dependencies.
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import Results from "./Results";
import AnalysisWebWorker from "./analysis.worker";
import Collapsible from "./components/Collapsible";

import { clearStorage } from "./redux/utils/localstorage";
import WorkerStatus from "./components/WorkerStatus";
import { connect } from "react-redux";
import { setResults } from "./redux/actions/results";
import { setConfigurationAttribute } from "./redux/actions/configuration";
import Inputs from "./components/Inputs";
import { setStatus } from "./redux/actions/worker";

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
		const { setWorkerStatus } = this.props;

		paper = Paper.parse( paper );

		setWorkerStatus( "analyzing" );

		this.analysisWorker.analyze( paper )
			.then( ( { result } ) => {
				setWorkerStatus( "idling" );

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


	/*
	Collapsible.propTypes = {
	children: PropTypes.oneOfType( [
	PropTypes.arrayOf( PropTypes.node ),
	PropTypes.node,
	] ),
	className: PropTypes.string,
	initialIsOpen: PropTypes.bool,
	hasSeparator: PropTypes.bool,
	hasPadding: PropTypes.bool,
	prefixIcon: PropTypes.shape( {
	icon: PropTypes.string,
	color: PropTypes.string,
	size: PropTypes.string,
	} ),
	prefixIconCollapsed: PropTypes.shape( {
	icon: PropTypes.string,
	color: PropTypes.string,
	size: PropTypes.string,
	} ),
	suffixIcon: PropTypes.shape( {
	icon: PropTypes.string,
	color: PropTypes.string,
	size: PropTypes.string,
	} ),
	suffixIconCollapsed: PropTypes.shape( {
	icon: PropTypes.string,
	color: PropTypes.string,
	size: PropTypes.string,
	} ),
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
	headingProps: PropTypes.shape( {
	level: PropTypes.number,
	fontSize: PropTypes.string,
	fontWeight: PropTypes.string,
	} ),
	};

	 */

	/**
	 * Renders the app.
	 *
	 * @returns {ReactElement} The app.
	 */
	render() {
		const { configuration } = this.props;

		return (
			<Fragment>
				<h1>YoastSEO.js development tool</h1>

				<h2>Worker status</h2>

				<Collapsible title="Input">
					<Inputs />
				</Collapsible>

				<Collapsible title="Results">
					<h2>SEO assessments</h2>
					<Results results={ this.props.results.seo } />
					<div id="output" className="output">

					</div>
					<h2>Content assessments</h2>
					<Results results={ this.props.results.readability } />
					<div id="contentOutput" className="output">

					</div>
				</Collapsible>

				<Collapsible title="Worker status">

				</Collapsible>

				<Collapsible title="Controls">
					<div className="button-container">
						<Button onClick={ this.initialize }>Initialize</Button>
						<Button onClick={ this.analyze }>Analyze</Button>
						<Button onClick={ () => {
							clearStorage();
							window.location.reload();
						} }>Clear</Button>
						<Button onClick={ this.analyzeSpam }>Analyze Spam</Button>
						<WorkerStatus />
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
				</Collapsible>

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

				Design Todos:
				<ul>
					<li>Overall score</li>
				</ul>

				My todos:
				<ul>
					<li>Include place to mark text</li>
				</ul>
			</Fragment>
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
			setWorkerStatus: ( status ) => dispatch( setStatus( status ) ),
		};
	}
)( App );
