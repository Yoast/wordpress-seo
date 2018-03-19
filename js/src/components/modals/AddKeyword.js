import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";

import IntlProvider from "../IntlProvider";
import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import { makeOutboundLink } from "yoast-components/utils/makeOutboundLink";
import PremiumBenefitsList from "../PremiumBenefitsList";

let localizedData = {};

const YesYouCanLink = makeOutboundLink();
const BuyButtonLink = makeOutboundLink();

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
`;

const AddKeyword = ( props ) => {
	return (
		<IntlProvider messages={ localizedData }>
			<StyledContainer>
				<StyledIcon icon={ YoastSeoIcon } width="150px" height="150px" />
				<h2>{ props.translations.title }</h2>
				<p>
					{ interpolateComponents( {
						mixedString: props.translations.intro,
						components: { link: <YesYouCanLink href={ props.translations.link } /> }
					} ) }
				</p>
				<p>{ props.translations.other }</p>
				<PremiumBenefitsList />
				<BuyButtonLink href={ props.translations.buylink } className="button button-primary">
					{ props.translations.buy }
				</BuyButtonLink>
				<br/>
				<small>{ props.translations.small }</small>
			</StyledContainer>
		</IntlProvider>
	);
};

AddKeyword.propTypes = {
	translations: PropTypes.object,
};

export default AddKeyword;
