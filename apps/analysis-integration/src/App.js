import { register, useDispatch, select } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import createAnalysisStore, { ANALYSIS_STORE_NAME, useAnalyze } from "@yoast/analysis-store";
import createReplacementVariables from "@yoast/replacement-variables";
import { reduce } from "lodash";

// Include analysis worker in analyzer?
// Send accessor type with analyze requests next to paper, how to handle?
// Add wrapper around these packages that exports a magic createYoastSeoIntegration function
// First candidate classic editor with WooCommerce

const preparePaper = ( paper ) => {
	const replacementVariables = createReplacementVariables( [
		{
			name: "title",
			getReplacement: () => {
				console.warn( "getReplacement", select( ANALYSIS_STORE_NAME ) );
				// return select( ANALYSIS_STORE_NAME ).selectTitle();
				return "HOIHAI"
			},
		},
	] );


	return reduce(
		paper,
		( acc, value, key ) => ( {
			...acc,
			[ key ]: replacementVariables.apply( value ),
		} ),
		{},
	);
};

const analysisStore = createAnalysisStore( {
	preparePaper,
	analyze: async ( paper, config ) => {
		console.warn( "analyze triggered with paper", paper );
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		return { data: "seoResults" };
	},
} );
register( analysisStore );

const Editor = () => {
	const { updateContent } = useDispatch( ANALYSIS_STORE_NAME );
	const handleChange = useCallback( ( event ) => {
		updateContent( event.target.value );
	}, [ updateContent ] );
	return (
		<textarea name="editor" rows="16" onChange={ handleChange } />
	);
};

function App() {
	useAnalyze();
	return (
		<>
		<div style={ { margin: "80px" } }>
				<Editor />
			</div>
			<div>
				<h2>Sidebar</h2>
				<h4>SEO Results</h4>
				<div>...</div>
				<h4>Readability Results</h4>
				<div>...</div>
				<h4>Research Results</h4>
				<div>...</div>
			</div>
		</>
			
	);
}

export default App;
