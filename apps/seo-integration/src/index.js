import { render, StrictMode } from "@wordpress/element";
import createSeoIntegration, { createDefaultReplacementVariableConfigurations } from "@yoast/seo-integration";
import App from "./app";
import "./index.css";
import { createPostReplacementVariables } from "./replacement-variables";
import registerSeoTitleWidth from "./seo-title-width";

const load = async () => {
	registerSeoTitleWidth();
	const defaultReplacementVariableConfigurations = createDefaultReplacementVariableConfigurations();

	const { analysisTypeReplacementVariables, SeoProvider } = await createSeoIntegration( {
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

	return SeoProvider;
};

load().then( ( SeoProvider ) => {
	render(
		<StrictMode>
			<SeoProvider>
				<App />
			</SeoProvider>
		</StrictMode>,
		document.getElementById( "root" ),
	);
} );
