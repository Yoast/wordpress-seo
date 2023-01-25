// External dependencies.
import { setLocaleData } from "@wordpress/i18n";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Suite } from "benchmark";
import testPapers from "../../../packages/yoastseo/spec/fullTextTests/testTexts";
import { Paper } from "yoastseo";
import getMorphologyData from "../../../packages/yoastseo/spec/specHelpers/getMorphologyData";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";


// Internal dependencies.
import Collapsible from "./components/Collapsible";
import { ColumnLeft, ColumnRight, Columns } from "./components/Columns";
import { Container } from "./components/Container";
import Controls from "./components/Controls";
import Inputs from "./components/Inputs";
import Markings from "./components/Markings";
import ProminentWordsForInternalLinking from "./components/ProminentWordsForInternalLinking";
import ProminentWordsForInsights from "./components/ProminentWordsForInsights";
import Results from "./components/Results";
import TreeView from "./components/TreeView";
import WorkerStatus from "./components/WorkerStatus";
import { setResults } from "./redux/actions/results";
import { setStatus } from "./redux/actions/worker";
import formatAnalyzeResult from "./utils/formatAnalyzeResult";
import runKeyphraseAnalysis from "./utils/runKeyphraseAnalysis";

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

		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );
		this.analyzeSpam = this.analyzeSpam.bind( this );
		this.polishStemmerPerformanceAnalysis = this.polishStemmerPerformanceAnalysis.bind( this );

		this.initialize();

		// Prevent yoast-component i18n console error by initializing as an empty domain.
		setLocaleData( { "": {} }, "yoast-components" );
	}

	/**
	 * Initialize the analysis worker.
	 *
	 * @returns {void}
	 */
	initialize() {
		const { configuration, worker, useMorphology, paper } = this.props;
		const config = {
			...configuration,
			researchData: {
				morphology: useMorphology ? getMorphologyData( getLanguage( paper.locale ) ) : {},
			},
		};

		worker.initialize( config )
			.then( () => this.analyze() );
	}

	/**
	 * Requests the analyses results from the worker.
	 *
	 * @param {Object} paper The paper to analyze.
	 *
	 * @returns {void}
	 */
	analyze( paper = this.props.paper ) {
		const { setWorkerStatus, setAnalyzeResults, worker, isRelatedKeyphrase } = this.props;
		const paperToAnalyze = Paper.parse( paper );

		setWorkerStatus( "analyzing" );

		if ( isRelatedKeyphrase ) {
			worker.analyzeRelatedKeywords( Paper.parse( paper ), {
				relatedKeyphrase: {
					keyword: paperToAnalyze.getKeyword(),
					synonyms: paperToAnalyze.getSynonyms(),
				},
			} )
				.then( ( { result } ) => {
					setWorkerStatus( "idling" );
					setAnalyzeResults( formatAnalyzeResult( result, "relatedKeyphrase" ) );
				} );
		} else {
			worker.analyze( paperToAnalyze )
				.then( ( { result } ) => {
					setWorkerStatus( "idling" );
					setAnalyzeResults( formatAnalyzeResult( result, "" ) );
				} );
		}
	}

	/**
	 * Runs analysis on the full-text test papers.
	 *
	 * @returns {void}
	 */
	analyzeSpam() {
		for ( let i = 0; i < 10; i++ ) {
			testPapers.forEach( ( { paper } ) => {
				this.analyze( {
					text: paper._text,
					...paper._attributes,
				} );
			} );
		}
	}

	/**
	 * Runs keyphrase analyses using the stemmers of three languages - English, Spanish, and Polish - and measures the
	 * performance (in operations per second, among other statistics) for each language.
	 *
	 * The goal is to check whether the keyphrase analysis that uses Polish morphology data, which, unlike the morphology data
	 * for other languages, contains a large object with word-stem pairs, results in a much worse performance compared to the
	 * other languages.

	 *
	 * @returns {void}
	 */
	polishStemmerPerformanceAnalysis() {
		/*
		 * The test text to run the tests on is actually a Russian paper, although the English, Spanish or Polish stemmers
		 * will be used. This is done so that we can a) do the comparison on the exact same paper in each language, and
		 * b) keep the amount of stemming/word forms constant across the three languages (for all languages, we expect the
		 *  stem to be the same as the word, as they will not succeed in stemming Russian words in any other way.)
		* */

		const englishTestPaper = testPapers[ 24 ];
		const spanishTestPaper = testPapers[ 25 ];
		const polishTestPaper = testPapers[ 26 ];

		const morphologyDataPL = getMorphologyData( "pl" );
		const morphologyDataES = getMorphologyData( "es" );
		const morphologyDataEN = getMorphologyData( "en" );

		const suite = new Suite( "Polish performance test" );

		suite.add( "Polish keyphrase analysis()", function() {
			runKeyphraseAnalysis( polishTestPaper, morphologyDataPL );
		}, { minSamples: 50, maxTime: 30 } );

		suite.add( "Spanish keyphrase analysis()", function() {
			runKeyphraseAnalysis( spanishTestPaper, morphologyDataES );
		}, { minSamples: 50, maxTime: 30 } );

		suite.add( "English keyphrase analysis()", function() {
			runKeyphraseAnalysis( englishTestPaper, morphologyDataEN );
		}, { minSamples: 50, maxTime: 30 } );

		suite.on( "cycle", function( event ) {
			// eslint-disable-next-line
			console.log( String( event.target ) );
			// eslint-disable-next-line
			console.log( event.target.stats.mean );
			// eslint-disable-next-line
			console.log( event.target.stats.deviation );
			// More statistics:
			// Marging of error: console.log( event.target.stats.moe );
			// Relative marging of error (percentage of the mean): console.log( event.target.stats.rme );
			// The array of sampled periods
			// eslint-disable-next-line
			console.log( event.target.stats.sample );
			// The standard error of the mean: console.log( event.target.stats.sem );
			// Variance: console.log( event.target.stats.variance );
			// The time taken to complete last cycle
			// eslint-disable-next-line
			console.log( event.target.times.cycle );
			// The time taken to complete the benchmark
			// eslint-disable-next-line
			console.log( event.target.times.elapsed );
			// The time taken to execute the test once
			// eslint-disable-next-line
			console.log( event.target.times.period );
			// Number of iterations per cycle
			// eslint-disable-next-line
			console.log( event.target.count );
		} );
		suite.on( "complete", function() {
			// eslint-disable-next-line
			console.log( "Fastest is " + this.filter( "fastest" ).map( "name" ) );
		} );

		suite.run();
	}

	/**
	 * Renders the app.
	 *
	 * @returns {React.Element} The app.
	 */
	render() {
		return <Fragment>
			<Columns minWidth="768px">
				<ColumnLeft minWidth="768px">
					<Collapsible title="Input">
						<Inputs />
					</Collapsible>
				</ColumnLeft>

				<ColumnRight minWidth="768px">
					<Collapsible title="Results">
						<Results />
					</Collapsible>
				</ColumnRight>
			</Columns>

			<Container>
				<Collapsible title="Markings">
					<Markings />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Worker status">
					<WorkerStatus />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Controls">
					<Controls
						onInitialize={ this.initialize }
						onAnalyze={ this.analyze }
						onAnalyzeSpam={ this.analyzeSpam }
						onPolishPerformanceAnalysis={ this.polishStemmerPerformanceAnalysis }
					/>
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Tree" initialIsOpen={ false }>
					<TreeView />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="New prominent words for Insights" initialIsOpen={ false }>
					<ProminentWordsForInsights />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="New prominent words for Internal linking suggestions" initialIsOpen={ false }>
					<ProminentWordsForInternalLinking />
				</Collapsible>
			</Container>

			<ul>
				<li>Debugging information</li>
				<li>Worker communication</li>
				<li>All research data</li>
				<li>Performance information</li>
			</ul>
		</Fragment>;
	}
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
			useKeywordDistribution: state.configuration.useKeywordDistribution,
			isRelatedKeyphrase: state.options.isRelatedKeyphrase,
			useMorphology: state.options.useMorphology,
		};
	},
	( dispatch ) => {
		return {
			setAnalyzeResults: results  => dispatch( setResults( results ) ),
			setWorkerStatus: status => dispatch( setStatus( status ) ),
		};
	},
)( App );
