import { select, useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import createReplacementVariables from "@yoast/replacement-variables";
import registerAnalysisStore, { SEO_STORE_NAME, useAnalyze } from "@yoast/seo-store";
import { debounce, reduce } from "lodash";
import "./app.css";

const useDebounce = ( callback, dependencies, debounceTimeInMs = 500 ) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback( debounce( callback, debounceTimeInMs ), [ callback, ...dependencies, debounceTimeInMs ] );
};

// Include analysis worker in analyzer?
// Send accessor type with analyze requests next to paper, how to handle?
// Add wrapper around these packages that exports a magic createYoastSeoIntegration function
// First candidate classic editor with WooCommerce

const preparePaper = ( paper ) => {
	const replacementVariables = createReplacementVariables( [
		{
			name: "title",
			getReplacement: () => {
				const replacement = select( SEO_STORE_NAME ).selectTitle();
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
	const { updateContent, updateTitle } = useDispatch( SEO_STORE_NAME );
	const handleContentChange = useDebounce( ( event ) => {
		updateContent( event.target.value );
	}, [ updateContent ] );
	const handleTitleChange = useDebounce( ( event ) => {
		updateTitle( event.target.value );
	}, [ updateTitle ] );

	return (
		<main className="editor">
			<label htmlFor="editor-title">Title</label>
			<input id="editor-title" name="title" onChange={ handleTitleChange } />
			<label htmlFor="editor-content">Content</label>
			<textarea id="editor-content" name="editor" rows="16" onChange={ handleContentChange } />
		</main>
	);
};

const Keyphrases = () => {
	const ids = useSelect( select => select( SEO_STORE_NAME ).selectKeyphraseIds() );
	const { addKeyphraseEntry } = useDispatch( SEO_STORE_NAME );
	const handleAddKeyphraseEntry = useCallback( () => {
		addKeyphraseEntry();
	}, [ addKeyphraseEntry ] );

	return (
		<div className="keyphrases">
			{ ids.map( id => <Keyphrase key={ `keyphrase-entry-${ id }` } id={ id } /> ) }
			<button onClick={ handleAddKeyphraseEntry }>Add keyphrase</button>
		</div>
	);
};

const Keyphrase = ( props ) => {
	const initialKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase( props.id ) );
	const initialSynonyms = useSelect( select => select( SEO_STORE_NAME ).selectSynonyms( props.id ) );
	const { updateKeyphrase, updateSynonyms } = useDispatch( SEO_STORE_NAME );

	const handleKeyphraseChange = useDebounce( ( event ) => {
		updateKeyphrase( { id: props.id, keyphrase: event.target.value } );
	}, [ props.id, updateKeyphrase ] );
	const handleSynonymsChange = useDebounce( ( event ) => {
		updateSynonyms( { id: props.id, synonyms: event.target.value } );
	}, [ props.id, updateSynonyms ] );

	return (
		<fieldset className="keyphrase-entry">
			<label htmlFor={ `keyphrase-${ props.id }` }>
				{ props.id === "focus" ? "Focus keyphrase" : "Related keyphrase" }
			</label>
			<input
				id={ `keyphrase-${ props.id }` }
				name={ `keyphrase-${ props.id }` }
				onChange={ handleKeyphraseChange }
				defaultValue={ initialKeyphrase }
			/>
			<label htmlFor={ `synonyms-${ props.id }` }>Synonyms</label>
			<input
				id={ `synonyms-${ props.id }` }
				name={ `synonyms-${ props.id }` }
				onChange={ handleSynonymsChange }
				defaultValue={ initialSynonyms }
			/>
		</fieldset>
	);
};

function App() {
	useAnalyze();

	return (
		<>
			<Editor />
			<aside className="sidebar">
				<Keyphrases />
				<h4>SEO Results</h4>
				<div>...</div>
				<h4>Readability Results</h4>
				<div>...</div>
				<h4>Research Results</h4>
				<div>...</div>
			</aside>
		</>
	);
}

export default App;