import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get, isEmpty } from "lodash";
import { LINK_PARAMS_NAME, PLUGIN_URL_NAME, WISTIA_EMBED_PERMISSION_NAME } from "../shared-admin/store";
import { Content, Introduction, IntroductionProvider } from "./components";
import { STORE_NAME_INTRODUCTIONS } from "./constants";
import { registerStore } from "./store";

const DATA_NAME = "wpseoIntroductions";

domReady( () => {
	const initialIntroductions = get( window, `${ DATA_NAME }.introductions`, [] );
	if ( isEmpty( initialIntroductions ) ) {
		return;
	}

	const abortDisplay = location.href.indexOf( "page=wpseo_dashboard#/first-time-configuration" ) !== -1;

	registerStore( {
		[ LINK_PARAMS_NAME ]: get( window, `${ DATA_NAME }.linkParams`, {} ),
		[ PLUGIN_URL_NAME ]: get( window, `${ DATA_NAME }.pluginUrl`, "" ),
		[ WISTIA_EMBED_PERMISSION_NAME ]: {
			value: get( window, `${ DATA_NAME }.wistiaEmbedPermission`, false ) === "1",
		},
	} );
	dispatch( STORE_NAME_INTRODUCTIONS ).setIntroductions( initialIntroductions );

	const rootContext = {
		isRtl: Boolean( get( window, `${ DATA_NAME }.isRtl`, false ) ),
	};

	const initialComponents = {
		"ai-brand-insights-pre-launch": Content,
	};

	const root = document.createElement( "div" );
	root.id = "wpseo-introductions";
	document.body.appendChild( root );

	createRoot( root ).render(
		<Root context={ rootContext }>
			<IntroductionProvider initialComponents={ initialComponents } abortDisplay={ abortDisplay }>
				<Introduction />
			</IntroductionProvider>
		</Root>
	);
} );
