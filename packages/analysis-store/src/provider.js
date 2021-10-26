//import React, { useEffect } from "react";
//import { Provider as StoreProvider, useDispatch, useSelector } from "react-redux";
import { configSelectors } from "./slices/config";
import { RegistryProvider } from "@wordpress/data";
import { dataSelectors } from "./slices/data";
import { resultsActions } from "./slices/results";
import { targetsSelectors } from "./slices/targets";

// Expose this separately, needed when WP provider is already present (e.g. block editor).
const Effects = ( { children } ) => {
	const dispatch = useDispatch();
	const paper = useSelector( dataSelectors.selectPaper );
	const targets = useSelector( targetsSelectors.selectTargets );
	const config = useSelector( configSelectors.selectConfig );

	useEffect( () => {
		dispatch( resultsActions.analyze( {
			paper,
			targets,
			config,
		} ) );
	}, [ dispatch, paper, targets, config ] );

	return children;
};

const createProvider = ( store ) => ( { children } ) => (
	<RegistryProvider>
		<Effects>
			{ children }
		</Effects>
	</RegistryProvider>
);

export default createProvider;
