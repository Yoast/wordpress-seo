import { RegistryProvider } from "@wordpress/data";
import useAnalyze from "./hooks/use-analyze";

const Analyse = ( { children } ) => {
	useAnalyze();
	return children;
};

const createProvider = ( registry ) => ( { children } ) => (
	<RegistryProvider value={ registry }>
		<Analyse>
			{ children }
		</Analyse>
	</RegistryProvider>
);

export default createProvider;
