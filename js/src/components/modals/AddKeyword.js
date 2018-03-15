import React from "react";
import PropTypes from "prop-types";

import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import { makeOutboundLink } from "yoast-components/utils/makeOutboundLink";

const YouCanLink = makeOutboundLink();
const BuyButtonLink = makeOutboundLink();

const AddKeyword = ( props ) => {
	return (
		<div>
			<Icon icon={ YoastSeoIcon } width="150px" height="150px" className="alignright" />
			<h2>{ props.translations.title }</h2>
			<p>
				<YouCanLink href={ props.translations.link }>
					{ props.translations.intro }
				</YouCanLink>
			</p>
			<p>{ props.translations.other }</p>
			<ul>
				{ props.translations.benefits.map( ( benefit, index ) =>
					<li key={ index }><strong>{ benefit }</strong></li>
				) }
			</ul>
			<BuyButtonLink href={ props.translations.buylink } className="button button-primary">
				{ props.translations.buy }
			</BuyButtonLink>
			<br/>
			<small>{ props.translations.small }</small>
		</div>
	);
};

AddKeyword.propTypes = {
	translations: PropTypes.object,
};

export default AddKeyword;
