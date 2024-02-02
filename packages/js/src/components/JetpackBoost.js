import { ExternalLinkIcon, XIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { PluginPrePublishPanel } from "@wordpress/edit-post";
import { __, sprintf } from "@wordpress/i18n";
import { Link, Root, Title } from "@yoast/ui-library";
import { get } from "lodash";
import PropTypes from "prop-types";
import { ReactComponent as JetpackBoostLogo } from "../../images/jetpack-boost-logo.svg";
import { ReactComponent as YoastLogo } from "../../images/yoast-seo-simple-logo.svg";
import withPersistentDismiss from "../containers/withPersistentDismiss";

/**
 * The JetpackBoost ad description.
 * Used to avoid eslint complexity warning.
 * @param {boolean} isJetpackBoostActive The component props.
 * @returns {string} The JetpackBoost ad description.
 */
const getDescription = ( isJetpackBoostActive ) => {
	return sprintf(
		isJetpackBoostActive
			/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
			? __( "%1$s recommends using %2$s for automated Critical CSS generation. Whenever you change your site, %3$s will automatically generate optimal CSS and performance scores. Upgrade %3$s, speed up your site, and improve its ranking!", "wordpress-seo" )
			/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
			: __( "%1$s recommends using %2$s to speed up your site. Optimize CSS, defer non-essential Javascript, and lazy load images. Install %3$s, speed up your site, and improve its ranking!", "wordpress-seo" ),
		"Yoast",
		"Jetpack Boost",
		"Boost"
	);
};

/* eslint-disable complexity */
/**
 * @param {string} store The redux store key.
 * @param {boolean} isAlertDismissed Whether the "alert" is dismissed.
 * @param {function} onDismissed Function that will dismiss the "alert".
 * @returns {JSX.Element} The JetpackBoost element (which is null when dismissed).
*/
const JetpackBoost = ( { store, isAlertDismissed, onDismissed } ) => {
	const isJetpackBoostActive = get( window, "wpseoScriptData.isJetpackBoostActive", "" ) === "1";
	const isJetpackBoostNotPremium = get( window, "wpseoScriptData.isJetpackBoostNotPremium", "" ) === "1";
	const getJetpackBoostPrePublishLink = get( window, "wpseoScriptData.metabox.getJetpackBoostPrePublishLink", "" );
	const upgradeJetpackBoostPrePublishLink = get( window, "wpseoScriptData.metabox.upgradeJetpackBoostPrePublishLink", "" );

	const isPremium = useSelect( select => select( store ).getIsPremium() );
	if ( isPremium || isAlertDismissed || ! isJetpackBoostNotPremium ) {
		return null;
	}

	return (
		<PluginPrePublishPanel
			className="yoast-seo-sidebar-panel"
			initialOpen={ true }
		>
			{ /* If this UI library Root is available up the chain, there is no need for it here anymore. */ }
			<Root className="yst-root yst-relative">
				<div
					className="yst-absolute yst-top-0 yst-bottom-0 yst--m-[16px] yst-w-[3px] yst-bg-primary-500"
				/>
				<div className="yst-flex">
					<YoastLogo className="yst-h-5 yst-w-5 yst-text-primary-500 yst-bg-white yst-z-10 yst-border-r yst-border-white" />
					<JetpackBoostLogo className="yst-h-5 yst-w-5 yst--ml-0.5" />
					<button type="button" className="yst-ml-auto" onClick={ onDismissed }>
						<XIcon className="yst-h-4 yst-w-4 yst-text-gray-400" />
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "Dismiss get Jetpack Boost", "wordpress-seo" )
							}
						</span>
					</button>
				</div>
				<Title as="h2" size="3" className="yst-mt-3 yst-text-sm yst-leading-normal yst-font-semibold">
					{ sprintf(
						/* translators: 1: Yoast SEO; 2: Jetpack Boost. */
						__( "Speed up your website with %1$s and %2$s", "wordpress-seo" ),
						"Yoast SEO",
						"Jetpack Boost"
					) }
				</Title>
				<p className="yst-mt-2 yst-text-slate-600">
					{ getDescription( isJetpackBoostActive ) }
				</p>

				<Link className="yst-block yst-mt-4" href={ isJetpackBoostActive ? upgradeJetpackBoostPrePublishLink : getJetpackBoostPrePublishLink } target="_blank" rel="noopener noreferrer">
					<span>
						{ sprintf(
							isJetpackBoostActive
								/* translators: Jetpack Boost. */
								? __( "Upgrade %s", "wordpress-seo" )
								/* translators: Jetpack Boost. */
								: __( "Get %s", "wordpress-seo" ),
							"Jetpack Boost"
						) }
					</span>
					<ExternalLinkIcon className="yst-inline yst-ml-1 yst-h-4 yst-w-4 yst-text-indigo-600" />
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
			</Root>
		</PluginPrePublishPanel>
	);
};
/* eslint-enable complexity */

JetpackBoost.propTypes = {
	store: PropTypes.string,
	// eslint-disable-next-line react/no-unused-prop-types -- Used in the `withPersistentDismiss` HOC.
	alertKey: PropTypes.string,
	isAlertDismissed: PropTypes.bool.isRequired,
	onDismissed: PropTypes.func.isRequired,
};

JetpackBoost.defaultProps = {
	store: "yoast-seo/editor",
	alertKey: "get-jetpack-boost-pre-publish-notification",
};

export default withPersistentDismiss( JetpackBoost );
