import { render, StrictMode } from "@wordpress/element";
import createSeoIntegration, { createDefaultReplacementVariableConfigurations } from "@yoast/seo-integration";
import App from "./app";
import "./index.css";
import { createPostReplacementVariables } from "./replacement-variables";
import registerSeoTitleWidth from "./seo-title-width";

const load = async () => {
	registerSeoTitleWidth();
	const defaultReplacementVariableConfigurations = createDefaultReplacementVariableConfigurations();

	const { analysisTypeReplacementVariables } = await createSeoIntegration( {
		analysisWorkerUrl: "worker-mock.js",
		analysisTypes: {
			post: {
				name: "post",
				replacementVariableConfigurations: createPostReplacementVariables( defaultReplacementVariableConfigurations ),
			},
		},
	} );

	console.log( "replacement variables interface, per analysis type", analysisTypeReplacementVariables );
};

load().then( () => {
	render(
		<StrictMode>
			<App />
		</StrictMode>,
		document.getElementById( "root" ),
	);
} );
