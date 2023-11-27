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
		{ ( ! state.isPremium ) && <Fragment>
			<NewsletterSignup gdprLink={ window.wpseoFirstTimeConfigurationData.shortlinks.gdpr } />
			<br />
		</Fragment> }
		<h4 className="yst-text-slate-900 yst-text-base yst-leading-6 yst-font-normal">
			{
				__( "Are you open to help us improve our services?",
					"wordpress-seo" )
			}
		</h4>
		{ !! state.isMainSite && ! state.isTrackingAllowedMultisite && <Alert type={ "warning" } className="yst-mt-2">
			{ __( "This feature has been disabled by the network admin.", "wordpress-seo" ) }
		</Alert> }
		{ ! state.isMainSite && <Alert type={ "warning" } className="yst-mt-2">
			{ __( "This feature has been disabled since subsites never send tracking data.", "wordpress-seo" ) }
		</Alert> }
		<p className={ classNames( "yst-text-normal yst-mt-2 yst-mb-4", state.isMainSite && state.isTrackingAllowedMultisite ? "" : "yst-opacity-50" ) }>
			{
				sprintf(
					/* translators: 1: Yoast SEO. */
					__( "Can we collect anonymous information about your website to enhance %1$s?", "wordpress-seo" ),
					"Yoast SEO"
				)
			}
		</p>
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
					label: __( "No, I don't want to share my site data", "wordpress-seo" ),
				},
				{
					value: 1,
					label: __( "Yes, you can collect my site data", "wordpress-seo" ),
				},
			] }
		/> }
		{ !! state.isMainSite && !! state.isTrackingAllowedMultisite && <Fragment>
			<Link
				className="yst-inline-block yst-mt-4"
				href={ "https://yoa.st/config-workout-tracking" }
			>
				{ __( "What data will be collected and why?", "wordpress-seo" ) }
			</Link>
			<p className="yst-my-2">
				<i>{
					__( "Important: We won't sell this data, and we won't collect any personal information about you or your visitors.", "wordpress-seo" )
				}</i>
			</p>
		</Fragment> }
	</Fragment>;
}

PersonalPreferencesStep.propTypes = {
	state: PropTypes.object.isRequired,
	setTracking: PropTypes.func.isRequired,
};
