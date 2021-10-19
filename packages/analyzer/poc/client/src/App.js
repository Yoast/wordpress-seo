import { useCallback } from "react";
import createAnalysisStore, { actions as analysisActions } from "@yoast/analysis-store";

const middleware = [];

const { store, Provider } = createAnalysisStore( {
  getReadabilityResults: () => {
    console.log( "getReadabilityResults" )
    return {};
  },
  getSeoResults: () => {
    console.log( "getSeoResults" )
    return {};
  },
  getResearchResults: () => {
    console.log( "getResearchResults" )
    return {};
  },
  middleware,
} );


function App() {
  const handleChange = useCallback( ( event ) => {
    store.dispatch(
      analysisActions.updatedContent( event.target.value )
    );
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
