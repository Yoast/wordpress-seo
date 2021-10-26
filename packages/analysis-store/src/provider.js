import { RegistryProvider } from "@wordpress/data";
import useAnalyze from "./hooks/use-analyze";

const Effects = ( { children } ) => {
	useAnalyze();

	return children;
};

const createProvider = ( registry ) => ( { children } ) => (
	<RegistryProvider value={ registry }>
		<Effects>
			{ children }
		</Effects>
	</RegistryProvider>
);

export default createProvider;
