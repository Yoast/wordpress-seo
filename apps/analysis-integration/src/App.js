import { select, useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import registerAnalysisStore, { ANALYSIS_STORE_NAME, useAnalyze } from "@yoast/analysis-store";
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
				const replacement = select( ANALYSIS_STORE_NAME ).selectTitle();
				console.log( "getReplacement", replacement );
				return replacement;
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

registerAnalysisStore( {
	preparePaper,
	analyze: async ( paper, keyphrases, config ) => {
		console.log( "analyze", paper, keyphrases, config );
		await new Promise( resolve => setTimeout( resolve, 1000 ) );
		return { data: "seoResults" };
	},
} );

const Editor = () => {
	const { updateContent, updateTitle, analyze } = useDispatch( ANALYSIS_STORE_NAME );
	const handleContentChange = useCallback( ( event ) => {
		updateContent( event.target.value );
	}, [ updateContent ] );
	const handleTitleChange = useCallback( ( event ) => {
		updateTitle( event.target.value );
		analyze();
	}, [ updateTitle ] );

	return (
		<>
			<input name="title" onChange={ handleTitleChange } />
			<textarea name="editor" rows="16" onChange={ handleContentChange } />
		</>
	);
};

function App() {
	useAnalyze();

	return (
		<>
			<Editor />
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
