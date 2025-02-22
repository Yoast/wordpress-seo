/* External dependencies */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

/* Internal dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const YoastLanguageNotice = styled.p`
	margin: 1em 0;
`;

const ChangeLanguageLink = makeOutboundLink( styled.a`
	margin-left: 4px;
` );

/**
 * Returns the LanguageNotice component.
 *
 * @param {Object} props                    The props for this language notice wrapper.
 * @param {string} props.changeLanguageLink The URL where the language can be changed.
 * @param {bool}   props.canChangeLanguage  Whether or not the language can be changed.
 * @param {string} props.language           The currently set language.
 * @param {bool}   props.showLanguageNotice Whether or not the language notice is shown.
 *
 * @returns {ReactElement} The LanguageNotice component.
 */
export default class LanguageNotice extends PureComponent {
	/**
	 * Renders the language notice. Provides a link to a setting page if the currently set language can be changed.
	 * Provides a message to contact an administrator otherwise.
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
		let text = sprintf(
			/* Translators: %s expands to the actual language. */
			__( "Your site language is set to %s.", "wordpress-seo" ),
			`{{strong}}${ language }{{/strong}}`
		);

		if ( ! canChangeLanguage ) {
			text = sprintf(
				/* Translators: %s expands to the actual language. */
				__( "Your site language is set to %s. If this is not correct, contact your site administrator.", "wordpress-seo" ),
				`{{strong}}${ language }{{/strong}}`
			);
		}

		// Replace the strong marking with an actual ReactComponent.
		text = interpolateComponents( {
			mixedString: text,
			components: { strong: <strong /> },
		} );

		return (
			<YoastLanguageNotice>
				{ text }
				{ canChangeLanguage && <ChangeLanguageLink href={ changeLanguageLink }>
					{ __( "Change language", "wordpress-seo" ) }
				</ChangeLanguageLink> }
			</YoastLanguageNotice>
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
