/* global yoastPremiumBenefitsL10n */
import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import { getRtlStyle } from "yoast-components";

let localizedData = null;
if ( window.yoastPremiumBenefitsL10n ) {
	localizedData = yoastPremiumBenefitsL10n;
}

const StyledList = styled.ul`
	list-style: none;
	margin: 0 0 16px;

	li {
		margin: 5px 0 0 0;
		padding-${ getRtlStyle( "left", "right" ) }: 16px;
	}

	span[aria-hidden="true"]:before {
		margin: ${ getRtlStyle( "0 8px 0 -16px", "0 -16px 0 8px" ) };
		font-weight: bold;
		content: "+";
	}
`;

const PremiumBenefitsList = () => {
	return (
		localizedData &&
			<StyledList role="list">
				{ localizedData.intl.map( ( benefit, index ) => {
					return <li key={ index }>
						<span aria-hidden="true"></span>
						{ interpolateComponents( {
							mixedString: benefit.replace( "<strong>", "{{strong}}" ).replace( "</strong>", "{{/strong}}" ),
							components: { strong: <strong /> },
						} ) }
					</li>;
				} ) }
			</StyledList>
	);
};

export default PremiumBenefitsList;
