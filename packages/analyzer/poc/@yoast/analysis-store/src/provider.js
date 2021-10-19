import React from "react";
import { Provider as StoreProvider } from "react-redux";

const createProvider = ( {
	store,
} ) => ( {
	children,
} ) => (
	<StoreProvider store={ store }>
		{ children }
	</StoreProvider>
);

export default createProvider;
