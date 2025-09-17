import apiFetch from "@wordpress/api-fetch";
import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { doAction } from "@wordpress/hooks";
import { createRoot } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get, isEmpty, find } from "lodash";
import { LINK_PARAMS_NAME, PLUGIN_URL_NAME, WISTIA_EMBED_PERMISSION_NAME } from "../shared-admin/store";
import { Introduction, IntroductionProvider } from "./components";
import { AiBrandInsightsPreLaunch } from "./components/modals/ai-brand-insights-pre-launch";
import { BlackFridayAnnouncement } from "./components/modals/black-friday-announcement";
import { DelayedPremiumUpsell } from "./components/modals/delayed-premium-upsell";
import { STORE_NAME_INTRODUCTIONS } from "./constants";
import { registerStore } from "./store";

const DATA_NAME = "wpseoIntroductions";

domReady( () => {
	const initialIntroductions = get( window, `${ DATA_NAME }.introductions`, [] );
	if ( isEmpty( initialIntroductions ) ) {
		return;
	}

	const initialComponents = {
		"ai-brand-insights-pre-launch": AiBrandInsightsPreLaunch,
		"black-friday-announcement": BlackFridayAnnouncement,
		"delayed-premium-upsell": DelayedPremiumUpsell,
	};

	if ( location.href.indexOf( "page=wpseo_dashboard#/first-time-configuration" ) !== -1 ) {
		// When on the FTC, we should abort displaying introductions and to mark them as not seen.
		window.YoastSEO._registerIntroductionComponent = ( id ) => {
			const introduction = find( initialIntroductions, { id } );
			if ( ! introduction ) {
				return;
			}

			try {
				await apiFetch( {
					path: `/yoast/v1/introductions/${ id }/seen`,
					method: "POST",
					// eslint-disable-next-line camelcase
					data: { is_seen: false },
				} );
			} catch ( e ) {
				console.error( e );
			}
		};

		( async() => {
			for ( const id of Object.keys( initialComponents ) ) {
				await window.YoastSEO._registerIntroductionComponent( id );
			}
			doAction( "yoast.introductions.ready" );
		} )();

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

	const root = document.createElement( "div" );
	root.id = "wpseo-introductions";
	document.body.appendChild( root );

	createRoot( root ).render(
		<Root context={ rootContext }>
			<IntroductionProvider initialComponents={ initialComponents }>
				<Introduction />
			</IntroductionProvider>
		</Root>
	);
} );
