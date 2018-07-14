// External dependencies.
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// YoastSEO.js dependencies.
import AnalysisWorker from "yoastseo/worker/AnalysisWorker";

// Internal dependencies.
import './App.css';
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import Input from "./components/Input";
import TextArea from "./components/TextArea";
import * as paperActionCreators from "./redux/actionCreators/paper";
import * as configurationActionCreators from "./redux/actionCreators/configuration";

class App extends React.Component {
	constructor( props ) {
		super( props );

		this.analysisWorker = new AnalysisWorker();

		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );
	}

	initialize() {
		const { configuration } = this.props;

		this.analysisWorker.initialize( configuration )
		    .then( data => console.log( "initialization done!", data ) );
	}

	analyze() {
		const { paper } = this.props;

		this.analysisWorker.analyze( paper )
		    .then( data => console.log( "analyzation done!", data ) );
	}

	renderPaperAttribute( id, placeholder, label = null, Component = Input, defaultValue = "" ) {
		const { actions, paper } = this.props;

		return (
			<Component
				id={ id }
				value={ paper[ id ] || defaultValue }
				label={ label || id }
				placeholder={ placeholder }
				onChange={ value => actions.setPaperAttribute( id, value ) }
			/>
		);
	}

	render() {
		const { paper, actions } = this.props;

		return (
			<div className="app">
				<div className="left-container">
					<div className="form-container">
						<h2>Analysis Worker</h2>
						<div className="button-container">
							<Button onClick={ this.initialize }>Initialize</Button>
							<Button onClick={ this.analyze }>Analyze</Button>
						</div>

						{ this.renderPaperAttribute( "text", "Write a text", null, TextArea ) }
						{ this.renderPaperAttribute( "keyword", "Choose a focus keyword", "focus keyword" ) }
						{ this.renderPaperAttribute( "synonyms", "Choose keyword synonyms" ) }
						{ this.renderPaperAttribute( "title", "Write the SEO title" ) }
						{ this.renderPaperAttribute( "description", "Write a meta description" ) }
						{ this.renderPaperAttribute( "locale", "en_US" ) }

						<h2>Configuration</h2>
						<Checkbox
							id="premium"
							value={ paper.premium !== false }
							label="Premium"
							onChange={ value => {
								actions.setConfigurationAttribute( "useKeywordDistribution", value )
							} }
						/>
					</div>
					<div className="output-container">
						<h2>SEO assessments</h2>
						<div id="output" className="output">

						</div>
						<h2>Content assessments</h2>
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

/**
 * Maps state to props.
 *
 * @param {Object} state The store's state.
 *
 * @returns {Object} Selection from the state.
 */
function mapStateToProps( state ) {
	return state;
}

/**
 * Maps dispatch to props.
 *
 * @param {function} dispatch The store's dispatch.
 *
 * @returns {Object} Dispatch actions.
 */
function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators( {
			...configurationActionCreators,
			...paperActionCreators,
		}, dispatch ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( App );
