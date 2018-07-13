/* External dependencies */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

/* Internal dependencies */
import { makeOutboundLink } from "../../../../utils/makeOutboundLink";
import colors from "../../../../style-guide/colors";

const YoastLanguageNotice = styled.p`
	margin: 1em 0;
`;

const ChangeLanguageLink = makeOutboundLink( styled.a`
	color: ${ colors.$palette_blue_medium };
	margin-left: 4px;
` );

export const LanguageNoticeContainer = styled.div`
	width: 100%;
	background-color: white;
	max-width: 800px;
	margin: 0 auto;
`;

const changeLanguageText = __( "Change language" );
/* Translators: %s expands to the actual language. */
const canChangeLanguageText = __( "Your site language is set to %s. " );
/* Translators: %s expands to the actual language. */
const canNotChangeLanguageText = __( "Your site language is set to %s. If this is not correct, contact your site administrator." );

/**
 * Returns the LanguageNotice component.
 *
 * @returns {ReactElement} The LanguageNotice component.
 */
export default class LanguageNotice extends PureComponent {
	/**
	 * Renders the language notice. Provides a link to a setting page in case of
	 * administrator, a notice to contact an administrator otherwise.
	 *
	 * @returns {ReactElement} The rendered language notice.
	 */
	render() {
		const {
			changeLanguageLink,
			canChangeLanguage,
			language,
			showLanguageNotice,
		} = this.props;

		if ( ! showLanguageNotice ) {
			return null;
		}

		// Determine the correct text.
		let text = canChangeLanguage ? canChangeLanguageText : canNotChangeLanguageText;
		// Replace the %s with a strong marked language.
		text = sprintf( text, `{{strong}}${ language }{{/strong}}` );
		// Replace the strong marking with an actual ReactComponent.
		text = interpolateComponents( {
			mixedString: text,
			components: { strong: <strong /> },
		} );

		return (
			<LanguageNoticeContainer>
				<YoastLanguageNotice>
					{ text }
					{ canChangeLanguage && <ChangeLanguageLink href={ changeLanguageLink }>
						{ changeLanguageText }
					</ChangeLanguageLink> }
				</YoastLanguageNotice>
			</LanguageNoticeContainer>
		);
	}
}

export const languageNoticePropType = {
	changeLanguageLink: PropTypes.string.isRequired,
	canChangeLanguage: PropTypes.bool,
	language: PropTypes.string.isRequired,
	showLanguageNotice: PropTypes.bool,
};

LanguageNotice.propTypes = languageNoticePropType;

LanguageNotice.defaultProps = {
	canChangeLanguage: false,
	showLanguageNotice: false,
};
