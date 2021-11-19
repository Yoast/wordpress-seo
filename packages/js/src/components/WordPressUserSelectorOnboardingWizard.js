/* External dependencies */
import { Component, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Label } from "@yoast/components";
import styled from "styled-components";

/* Internal dependencies */
import valueToNativeEvent from "./higherorder/valueToNativeEvent";
import WordPressUserSelector, { WordPressUserSelectorPropTypes } from "./WordPressUserSelector";

/**
 * Container for the user selector.
 *
 * @type {wp.Element}
 */
const Container = styled.div`
	max-width: 250px;
	padding-bottom: 7px;
`;

const UserInformation = styled.p`
	font-size: 14px;
	margin-top: 0;
`;

/**
 * Wrapper for WordPressUserSelector to be used in the onboarding wizard.
 */
class WordPressUserSelectorOnboardingWizard extends Component {
	/**
	 * Renders the WordPressUserSelectorOnboardingWizard component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				<Container>
					<Label
						for={ this.props.name }
						optionalAttributes={ {
							className: "yoast-wizard-text-input-label",
						} }
					>
						{ __( "The name of the person", "wordpress-seo" ) }
					</Label>
					<WordPressUserSelector { ...this.props } />
				</Container>
				<UserInformation>
					{
						sprintf(
							/* translators: %1$s expands to WordPress */
							__( "You can edit the details shown in meta data, like the social profiles, the name " +
								"and the description of this user on their %1$s profile page.", "wordpress-seo" ),
							"WordPress"
						)
					}
				</UserInformation>
			</Fragment>
		);
	}
}

WordPressUserSelectorOnboardingWizard.propTypes = {
	...WordPressUserSelectorPropTypes,
};

export default valueToNativeEvent( WordPressUserSelectorOnboardingWizard );
