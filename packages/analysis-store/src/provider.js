import { RegistryProvider } from "@wordpress/data";
import useAnalyze from "./hooks/use-analyze";

const Analyze = ( { children } ) => {
	useAnalyze();
	return children;
};

const createProvider = ( registry ) => ( { children } ) => (
	<RegistryProvider value={ registry }>
		<Analyze>
			{ children }
		</Analyze>
	</RegistryProvider>
);

export default createProvider;
