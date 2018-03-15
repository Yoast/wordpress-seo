import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import { makeOutboundLink } from "yoast-components/utils/makeOutboundLink";

const YouCanLink = makeOutboundLink();
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
				<YouCanLink href={ props.translations.link }>
					{ props.translations.intro }
				</YouCanLink>
			</p>
			<p>{ props.translations.other }</p>
			<StyledList role="list">
				{ props.translations.benefits.map( ( benefit, index ) =>
					<li key={ index }><strong><span aria-hidden="true"></span>{ benefit }</strong></li>
				) }
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
