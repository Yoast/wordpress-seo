import React from "react";
import styled from "styled-components";

import IconRadioButton from "./../../Shared/components/RadioButton.js";
import eye from "./../../../../style-guide/svg/eye.svg";
import eyeSlash from "./../../../../style-guide/svg/eye-slash.svg";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function ContentAnalysis() {
	return ( <ContentAnalysisContainer>
		<br />
		<div role="radiogroup" >
			<IconRadioButton name="group1" id="RadioButton" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
			<IconRadioButton name="group1" id="RadioButton2" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
			<IconRadioButton name="group1" id="RadioButton3" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
			<IconRadioButton name="group1" id="RadioButton4" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
			<IconRadioButton name="group1" id="RadioButton5" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ true }/>
			<IconRadioButton name="group1" id="RadioButton6" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
		</div>
		</ContentAnalysisContainer>
	 );
}
