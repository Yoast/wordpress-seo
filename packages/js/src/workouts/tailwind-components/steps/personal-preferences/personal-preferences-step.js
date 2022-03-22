import { Fragment } from "@wordpress/element";
import Alert from "../../base/alert";

/**
 * Doc comment to make linter happy.
 *
 * @param {Object}   state                    The state
 * @param {function} setTracking              Callback function to update tracking preference
 * @param {Boolean}  isTrackingOptionSelected Wether the tracking option is selected
 *
 * @returns {JSX.Element} Example step.
 */
function PersonalPreferencesStep( { state, setTracking, isTrackingOptionSelected } ) {
	return <Fragment>
		<p>
			{
				__( "To provide the best experience for you, we need your permission to do the following things:", "wordpress-seo" )
			}
		</p>
		<ul className="yoast-tracking">
			<li> { __( "collect info about the plugins and themes you have installed;", "wordpress-seo" ) } </li>
			<li> {
				sprintf(
					// translators: translates to Yoast SEO.
					__( "see which %s features you use or don't use;", "wordpress-seo" ),
					"Yoast SEO"
				)
			} </li>
			<li> { __( "always load our customer support window so we can immediately assist you when you need help.", "wordpress-seo" ) } </li>
		</ul>
		<RadioButtonGroup
			id="yoast-configuration-workout-tracking-radio-button"
			label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
			groupName="yoast-configuration-workout-tracking"
			selected={ state.tracking }
			onChange={ setTracking }
			vertical={ true }
			wrapperClassName={ "tracking-radiobuttons" }
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
		/>
		<p>
			<i>{
				__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
			}</i>
		</p>
		{ ! isTrackingOptionSelected && <Alert type="warning">
			{ __(
				// eslint-disable-next-line max-len
				"In order to complete this step please select if we are allowed to improve Yoast SEO with your data.",
				"wordpress-seo"
			) }
		</Alert> }
		<br />
		<NewsletterSignup gdprLink={ window.wpseoWorkoutsData.configuration.shortlinks.gdpr } />
	</Fragment>;
}

PersonalPreferencesStep.propTypes = {
	state: PropTypes.object.isRequired,
	setTracking: PropTypes.func.isRequired,
	isTrackingOptionSelected: PropTypes.bool.isRequired,
};