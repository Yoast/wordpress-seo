import React from "react";
import styled from "styled-components";

import LanguageNotice, { languageNoticePropType } from "../composites/Plugin/Shared/components/LanguageNotice.js";

export const LanguageNoticeContainer = styled.div`
	background-color: white;
	max-width: 800px;
	margin: 0 auto;
`;

/**
 * Returns the LanguageNoticeWrapper component.
 *
 * @param {Object} props                    The props for this language notice wrapper.
 * @param {string} props.changeLanguageLink The URL where the language can be changed.
 * @param {bool}   props.canChangeLanguage  Whether or not the language can be changed.
 * @param {string} props.language           The current set language.
 * @param {bool}   props.showLanguageNotice Whether or not the language notice is shown.
 *
 * @returns {ReactElement} The LanguageNoticeWrapper component.
 */
export default function LanguageNoticeWrapper( props ) {
	return (
		<LanguageNoticeContainer>
			<LanguageNotice
				{ ...props }
			/>
		</LanguageNoticeContainer>
	);
}

LanguageNoticeWrapper.propTypes = languageNoticePropType;
