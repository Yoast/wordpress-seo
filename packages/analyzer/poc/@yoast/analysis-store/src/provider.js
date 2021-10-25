import React, { useEffect } from "react";
import { Provider as StoreProvider, useDispatch, useSelector } from "react-redux";

import { analysisDataSelectors } from "./analysis-data-slice";
import { analysisResultsActions } from "./analysis-results-slice";

const Effects = ( { children } ) => {
	const dispatch = useDispatch();
	const content = useSelector( analysisDataSelectors.selectContent );

	useEffect( () => {
		dispatch( analysisResultsActions.analyze( {
			key: "focus",
			paper: {
				content,
			},
		} ) );
	}, [ dispatch, content ] );

	return children;
};

const createProvider = ( store ) => ( { children } ) => (
	<StoreProvider store={ store }>
		<Effects>
			{ children }
		</Effects>
	</StoreProvider>
);

export default createProvider;
