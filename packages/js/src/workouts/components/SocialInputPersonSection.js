import { createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import { Alert } from "@yoast/components";
import { addLinkToString } from "../../helpers/stringHelpers.js";

/* eslint-disable max-len */
/**
 * The SocialInputPersonSection element, which is a screenshot and some conditionally changing text.
 *
 * @param {Object} props          The props object.
 * @param {number} props.personId The id of the selected person.
 *
 * @returns {WPElement} The SocialInputPersonSection element
 */
function SocialInputPersonSection( { personId } ) {
	return (
		<div>
			{
				personId === 0 && <Fragment>
					<Alert type="info">
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
										"%1$sImportant%2$s: Please select a name in step 2 for this step to be effective.",
										"wordpress-seo"
									),
									"<b>",
									"</b>"
								),
								{
									b: <b />,
								}
							)
						}
					</Alert>
					<p>
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing anchor tags
										"In this step, you need to add the personal social profiles of the person your site represents. To do that, you should go to the %1$sUsers%2$s > Profile page in a new browser tab. Alternatively, ask the user or an admin to do it if you are not allowed.",
										"wordpress-seo"
									),
									"<a>",
									"</a>"
								),
								{
									b: <b />,
									// eslint-disable-next-line jsx-a11y/anchor-has-content
									a: <a id="yoast-configuration-workout-user-page-link-1" href={ window.wpseoWorkoutsData.usersPageUrl } target="_blank" rel="noopener noreferrer" />,
								}
							)
						}
					</p>
					<p>
						{
							addLinkToString(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
										"On the %1$sUsers%2$s page, hover your mouse over the username you want to edit. Click ‘Edit’ to access the user’s profile. Then, scroll down to the ‘Contact info’ section (see screenshot below) and fill in the URLs of the personal social profiles you want to add.",
										"wordpress-seo"
									),
									"<a>",
									"</a>"
								),
								window.wpseoWorkoutsData.usersPageUrl,
								"yoast-configuration-workout-user-page-link-2"
							)
						}
					</p>
				</Fragment>
			}
			{
				personId !== 0 && <Fragment>
					<p>
						{
							addLinkToString(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
										"In this step, you need to add the personal social profiles of the person your site represents. To do that, you should go to the user’s %1$sProfile page%2$s (opens in a new browser tab). Then, scroll down to the ‘Contact info’ section (see screenshot below) and fill in the URLs of the personal social profiles you want to add. Alternatively, ask the user or an admin to do it if you are not allowed.",
										"wordpress-seo"
									),
									"<a>",
									"</a>"
								),
								window.wpseoScriptData.searchAppearance.userEditUrl.replace( "{user_id}", personId ),
								"yoast-configuration-workout-user-page-link-direct"
							)
						}
					</p>
				</Fragment>
			}
			<p>
				<b>{ __( "Screenshot:", "wordpress-seo" ) }</b>
				<img
					src={ window.wpseoWorkoutsData.pluginUrl + "/images/profile-social-fields.png" }
					alt={ __( "A screenshot of the Contact Info section of a user's Profile page", "wordpress-seo" ) }
				/>
			</p>
		</div>
	);
}
/* eslint-enable max-len */

export default SocialInputPersonSection;

SocialInputPersonSection.propTypes = {
	personId: PropTypes.number,
};

SocialInputPersonSection.defaultProps = {
	personId: 0,
};

