/* eslint-disable */

// 1. Init analysis worker interface
const analysisWorker = initAnalysisWorker( { url: "" } );

// 2. Create replacement variable config & middleware
const replaceVarsMiddleware = store => next => action => {
	const selectors = createSelectors( store );
	const { apply: applyReplaceVars } = createReplaceVars( [
		{
			name: "title",
			replace: ( ...args ) => selectors.getTitle( ...args ),
		},
	] );

	if ( action.type === "RUN_ANALYSIS" ) {
		return next( {
			type: "RUN_ANALYSIS",
			payload: map( action.payload, applyReplaceVars ),
		} );
	}

	// If ( action.type === "GET_DATA" && action.payload.key === "google-preview-data" ) {
	//     Return next( {
	//         Type: "GET_DATA",
	//         Payload: map( action.payload, applyReplaceVars ),
	//     } );
	// }

	next( action );
};

// 3. Create analysis store with analysis worker callbacks & middleware
const { Provider: AnalysisDataProvider, store, selectors, actions } = createAnalysisStore( {
    getSeoResults: analysisWorker.analyzeSeo || analysisWorker.getSeoResults,
    getReadabilityResults: analysisWorker.analyzeReadability || analysisWorker.getReadabilityResults,
    getResearchResults: analysisWorker.analyzeResearch || analysisWorker.getResearchResults,
    middleware: [ replaceVarsMiddleware ],
} );


const { Provider: ReplaceVarsProvider, apply: applyReplaceVars } = createReplaceVars( [
    ...defaultReplaceVars,
    {
        name: "title",
        replace: ( ...args ) => selectors.getTitle( ...args ),
    },
    {
        name: "siteName",
        replace: ( ...args ) => window.yoast.siteName,
    },
    {
        name: "cmsName",
        replace: ( ...args ) => getFromSomewhere( ...args ),
    },
] );


// Factories for analysis data and replace vars
// ----------------
const App = () => {
	// Filters.add( "yoast/prepare-paper-data", ( paperData ) => map( paperData, applyReplaceVars ) );

	return (
		<AnalysisDataProvider>
			<ReplaceVarsProvider>
				<Container />
			</ReplaceVarsProvider>
		</AnalysisDataProvider>
	);
};

const Container = () => {
	const state = useSelect( "key" );
	const replaceVars = useMemo( () => createReplaceVars( [
		replaceVarConfigs[ scope ],
	] ), [ scope ] );
	const value = replaceVars.apply( state );

	return (
		<Component value={ value } />
	);
};

const AnotherContainer = () => {
	const state = useSelect( "key" );
	const replaceVars = useReplaceVars();
	const value = replaceVars.apply( state );

	// Const replacedValue = useReplacedState( "key" );

	return (
		<Component value={ value } />
	);
};
