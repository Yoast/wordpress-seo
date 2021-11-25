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
		initialState: {
			editor: {
				title: "This is the initial title",
				content: "This is the initial content and the initial title is: %%title%%"
			}
		},
	} );

	console.log( "replacement variables interface, per analysis type", analysisTypeReplacementVariables );

	return analysisTypeReplacementVariables;
};

load().then( ( analysisTypeReplacementVariables) => {
	render(
		<StrictMode>
			<App analysisTypeReplacementVariables={ analysisTypeReplacementVariables } />
		</StrictMode>,
		document.getElementById( "root" ),
	);
} );
