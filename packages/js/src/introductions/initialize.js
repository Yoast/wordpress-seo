import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { Root } from "@yoast/ui-library";
import { get, isEmpty } from "lodash";
import { LINK_PARAMS_NAME, PLUGIN_URL_NAME, WISTIA_EMBED_PERMISSION_NAME } from "../shared-admin/store";
import { Content, Introduction, IntroductionProvider, Modal } from "./components";
import { STORE_NAME_INTRODUCTIONS } from "./constants";
import { registerStore } from "./store";

const DATA_NAME = "wpseoIntroductions";

domReady( () => {
	const initialIntroductions = get( window, `${ DATA_NAME }.introductions`, [] );
	if ( isEmpty( initialIntroductions ) ) {
		return;
	}

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
		"ai-fix-assessments-upsell": Content,
	};

	const root = document.createElement( "div" );
	root.id = "wpseo-introductions";
	document.body.appendChild( root );

	render(
		(
			<Root context={ rootContext }>
				<IntroductionProvider initialComponents={ initialComponents }>
					<Modal>
						<Introduction />
					</Modal>
				</IntroductionProvider>
			</Root>
		),
		root,
		() => {
			doAction( "yoast.introductions.ready" );
		}
	);
} );
