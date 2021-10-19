/* eslint-disable */

// Editor integration
// --------------------------------
const createEditorIntegration = ( {
	runAnalysis,
	runResearch,
	middleware,
} ) => ( {
	Provider: () => {}, // Provider component that provides the store + selectors
	actions: {},
	selectors: {},
	store: () => {},
} );


import { selectors, actions } from "@yoast/analysis-data";
import createReplaceVars, { defaultReplaceVars, useReplaceVars } from "@yoast/replace-vars";

const Provider = () => {
	const store = {
		getState: () => {},
		dispatch: () => {},
		subscribe: () => {},
	};

	return (
		<ReduxProvider store={ store }>
			<Effects>
				{ children }
			</Effects>
		</ReduxProvider>
	);
};

const Effects = () => {
	// Paper can differ per action
	const paperData = selectors.getPaperData();

	// Effects run here is dependent on worker refactor
	useEffect( () => {
		// Debounce this
		actions.runAnalysis( paperData );
	}, [ paperData ] );

	return children;
};
