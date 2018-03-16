import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";

import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import { makeOutboundLink } from "yoast-components/utils/makeOutboundLink";

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

const AddKeyword = ( props ) => {
	return (
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
			<StyledList role="list">
				{ props.translations.benefits.map( ( benefit, index ) => {
					return <li key={ index }>
						<span aria-hidden="true"></span>
						{ interpolateComponents( {
							mixedString: benefit,
							components: { strong: <strong /> }
						} ) }
					</li>;
				} ) }
			</StyledList>
			<BuyButtonLink href={ props.translations.buylink } className="button button-primary">
				{ props.translations.buy }
			</BuyButtonLink>
			<br/>
			<small>{ props.translations.small }</small>
		</StyledContainer>
	);
};

AddKeyword.propTypes = {
	translations: PropTypes.object,
};

export default AddKeyword;
