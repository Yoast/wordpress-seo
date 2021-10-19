import { useCallback } from "react";
import createAnalysisStore from "@yoast/analysis-store";

const testMiddleware = store => next => action => {
  if ( action.type === "analysisResults/fetchSeoResults" ) {
    console.warn("action", action);
      return next( action );
  }

  next( action );
};

const { Provider, actions: analysisActions } = createAnalysisStore( {
  fetchReadabilityResults: async () => {
    console.warn( "fetchReadabilityResults triggered" );
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    return { data: "readabilityResults" };
  },
  fetchSeoResults: async () => {
    console.warn( "fetchSeoResults triggered" );
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    return { data: "seoResults" };
  },
  fetchResearchResults: async () => {
    console.warn( "fetchResearchResults triggered" );
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    return { data: "researchResults" };
  },
  middleware: [testMiddleware],
} );


function App() {
  const handleChange = useCallback( ( event ) => {
    analysisActions.updatedContent( event.target.value )
  }, [] );
  return (
    <Provider>
      <div className="App">
        <textarea name="editor" rows="16" onChange={ handleChange } />
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
