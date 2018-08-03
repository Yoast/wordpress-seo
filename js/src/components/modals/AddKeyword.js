/* global yoastAddKeywordModalL10n */
import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";

import IntlProvider from "../IntlProvider";
import { Icon } from "yoast-components";
import { YoastSeoIcon } from "yoast-components";
import { utils } from "yoast-components";
import PremiumBenefitsList from "../PremiumBenefitsList";

let localizedData = null;
if ( window.yoastAddKeywordModalL10n ) {
	localizedData = yoastAddKeywordModalL10n;
}

const YesYouCanLink = utils.makeOutboundLink();
const BuyButtonLink = utils.makeOutboundLink();

const StyledContainer = styled.div`
	min-width: 600px;

	@media screen and ( max-width: 680px ) {
		min-width: 0;
		width: 86vw;
	}
`;

const StyledIcon = styled( Icon )`
	float: right;
	margin: 0 0 16px 16px;

	&& {
		@media screen and ( max-width: 680px ) {
			width: 80px;
			height: 80px;
		}
	}
`;

const AddKeyword = () => {
	return (
		localizedData && <IntlProvider messages={ localizedData.intl }>
			<StyledContainer>
				<StyledIcon icon={ YoastSeoIcon } width="150px" height="150px" />
				<h2>{ localizedData.intl.title }</h2>
				<p>
					{ interpolateComponents( {
						mixedString: localizedData.intl.intro,
						components: { link: <YesYouCanLink href={ localizedData.intl.link } /> },
					} ) }
				</p>
				<p>{ localizedData.intl.other }</p>
				<PremiumBenefitsList />
				<BuyButtonLink href={ localizedData.intl.buylink } className="button button-primary">
					{ localizedData.intl.buy }
				</BuyButtonLink>
				<br/>
				<small>{ localizedData.intl.small }</small>
			</StyledContainer>
		</IntlProvider>
	);
};

export default AddKeyword;
