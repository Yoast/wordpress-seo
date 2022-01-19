import { render, StrictMode } from "@wordpress/element";
import createSeoIntegration from "@yoast/seo-integration";
import App from "./app";
import "./index.css";
import { createPostReplacementVariables } from "./replacement-variables";
import registerSeoTitleWidth from "./seo-title-width";

const load = async () => {
	registerSeoTitleWidth();

	const { analysisTypeReplacementVariables, SeoProvider } = await createSeoIntegration( {
		analysis: {
			workerUrl: "dist/bootstrap-analysis.js",
			dependencies: [
				"vendor/autop.js",
				"vendor/lodash.js",
				"yoast/jed.js",
				"yoast/featureFlag.js",
				"analysis/analysis.js",
				"analysis/languages/default.js",
			],
		},
		initialState: {
			editor: {
				title: "This is the initial title",
				content: "This is the initial content and the initial title is: %%title%%",
			},
		},
		contentTypes: {
			post: {
				name: "post",
				replacementVariableConfigurations: createPostReplacementVariables(),
			},
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
