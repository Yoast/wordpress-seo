import { useCallback } from "react";
import { reduce } from "lodash";
import createAnalysisStore, { selectors as analysisStoreSelectors } from "@yoast/analysis-store";
import createReplacementVariables from "@yoast/replacement-variables";

// Include analysis worker in analyzer?
// Send accessor type with analyze requests next to paper, how to handle?
// Add wrapper around these packages that exports a magic createYoastSeoIntegration function
// First candidate classic editor with WooCommerce

const preparePaper = ( paper, { getState } ) => {
  const replacementVariables = createReplacementVariables( [
    {
      name: "title",
      getReplacement: () => {
        console.warn('getReplacement', analysisStoreSelectors.selectSeoTitle( getState() ));
        return analysisStoreSelectors.selectSeoTitle( getState() );
      },
    },
  ] );

  return reduce(
    paper,
    ( acc, value, key ) => ( {
      ...acc,
      [key]: replacementVariables.apply( value ),
    } ),
    {}
  );
};

const { Provider, actions: analysisActions } = createAnalysisStore( {
  preparePaper,
  analyze: async ( paper, config ) => {
    console.warn( "analyze triggered with paper", paper );
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    return { data: "seoResults" };
  },
  middleware: [],
} );


function App() {
  const handleChange = useCallback( ( event ) => {
    analysisActions.updateContent( event.target.value )
  }, [] );
  return (
    <Provider>
      <div style={ { margin: "80px" } }>
        <textarea name="editor" rows="16" onChange={ handleChange } defaultValue="%%title%%" />
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
    </Provider>
  );
}

export default App;
