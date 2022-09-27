import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import classNames from "classnames";

import Alert from "../../base/alert";
import { makeOutboundLink } from "@yoast/helpers";
import { NewsletterSignup } from "./newsletter-signup";
import RadioGroup from "../../base/radio-group";

const Link = makeOutboundLink();

/**
 * Doc comment to make linter happy.
 *
 * @param {Object}   state                    The state
 * @param {function} setTracking              Callback function to update tracking preference
 *
 * @returns {JSX.Element} Example step.
 */
export default function PersonalPreferencesStep( { state, setTracking } ) {
	return <Fragment>
		<h4 className="yst-text-gray-900 yst-text-base yst-leading-6 yst-font-normal">
			{
				// translators: %s is replaced by "Yoast SEO"
				sprintf( __( "%s usage tracking", "wordpress-seo" ), "Yoast SEO" )
			}
		</h4>
		{ !! state.isMainSite && ! state.isTrackingAllowedMultisite && <Alert type={ "warning" } className="yst-mt-2">
			{ __( "This feature has been disabled by the network admin.", "wordpress-seo" ) }
		</Alert> }
		{ ! state.isMainSite && <Alert type={ "warning" } className="yst-mt-2">
			{ __( "This feature has been disabled since subsites never send tracking data.", "wordpress-seo" ) }
		</Alert> }
		<p className={ classNames( "yst-text-normal yst-mt-2 yst-mb-4", state.isMainSite && state.isTrackingAllowedMultisite ? "" : "yst-opacity-50" ) }>{ __( "We need your help to improve Yoast SEO. Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }</p>
		{ <RadioGroup
			id="yoast-configuration-tracking-radio-button"
			name="yoast-configuration-tracking"
			value={ state.tracking }
			onChange={ setTracking }
			className={ state.isMainSite && state.isTrackingAllowedMultisite ? "" : "yst-opacity-50" }
			disabled={ ! state.isMainSite || ! state.isTrackingAllowedMultisite }
			options={ [
				{
					value: 0,
					label: __( "No, don’t track my site data", "wordpress-seo" ),
				},
				{
					value: 1,
					label: __( "Yes, you can track my site data", "wordpress-seo" ),
				},
			] }
		/> }
		{ !! state.isMainSite && !! state.isTrackingAllowedMultisite && <Fragment>
			<Link
				className="yst-inline-block yst-mt-4"
				href={ "https://yoa.st/config-workout-tracking" }
			>
				{ __( "What data will be tracked and for what reasons?", "wordpress-seo" ) }
			</Link>
			<p className="yst-my-2">
				<i>{
					__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors.", "wordpress-seo" )
				}</i>
			</p>
		</Fragment> }
		{ ( ! state.isPremium ) && <Fragment>
			<br />
			<NewsletterSignup gdprLink={ window.wpseoFirstTimeConfigurationData.shortlinks.gdpr } />
		</Fragment> }
	</Fragment>;
}

PersonalPreferencesStep.propTypes = {
	state: PropTypes.object.isRequired,
	setTracking: PropTypes.func.isRequired,
};
