/* global yoastPremiumBenefitsL10n */
import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";

import IntlProvider from "./IntlProvider";

let localizedData = null;
if ( window.yoastPremiumBenefitsL10n ) {
	localizedData = yoastPremiumBenefitsL10n;
}

const StyledList = styled.ul`
	list-style: none;
	margin: 0 0 16px;

	li {
		margin: 5px 0 0 0;
		padding-left: 16px;
	}

	span[aria-hidden="true"]:before {
		margin: 0 8px 0 -16px;
		font-weight: bold;
		content: "+";
	}
`;

const PremiumBenefitsList = () => {
	return (
		localizedData && <IntlProvider messages={ localizedData }>
			<StyledList role="list">
				{ localizedData.intl.map( ( benefit, index ) => {
					let formattedBenefit = benefit.replace( "<strong>", "{{strong}}" ).replace( "</strong>", "{{/strong}}" );
					return <li key={ index }>
						<span aria-hidden="true"></span>
						{ interpolateComponents( {
							mixedString: formattedBenefit,
							components: { strong: <strong /> }
						} ) }
					</li>;
				} ) }
			</StyledList>
		</IntlProvider>
	);
};

export default PremiumBenefitsList;
