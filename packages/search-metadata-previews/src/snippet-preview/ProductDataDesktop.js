import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { round } from "lodash";

import { StarRating } from "@yoast/components";

const ProductData = styled.p`
	display: inline;
	margin-left: 0.3em;
	color: #70757a;
`;

/**
 * Renders ProductData component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component.
 */
function ProductDataDesktop( props ) {
	const { shoppingData } = props;

	return (
		<Fragment>
			{ ( shoppingData.reviewCount > 0 ) ? <StarRating rating={ shoppingData.rating } /> : "" }
			<ProductData>
				{ ( shoppingData.reviewCount > 0 )
					? <Fragment>
						<span>{ __( "Rating: ", "yoast-components" ) + round( ( shoppingData.rating * 2 ), 1 ) } /10 · </span>
						<span>{ shoppingData.reviewCount } { __( "reviews", "yoast-components" ) } · </span>
					</Fragment>
					: "" }
				{ ( shoppingData.price )
					? <Fragment>
						<span dangerouslySetInnerHTML={ { __html: shoppingData.price } } />‎
					</Fragment>
					: ""
				}
				{ ( shoppingData.availability ) ? <span> · { shoppingData.availability }</span> : "" }
			</ProductData>
		</Fragment>
	);
}

export default ProductDataDesktop;

ProductDataDesktop.propTypes = {
	shoppingData: PropTypes.object.isRequired,
};
