import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { round, capitalize } from "lodash";
import { StarRating } from "@yoast/components";

const ProductData = styled.span`
	color: #70757a;
	line-height: 1.7;
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

	/* Translators: %s expands to the actual rating, e.g. 8/10. */
	const ratingPart = sprintf( __( "Rating: %s", "wordpress-seo" ), round( ( shoppingData.rating * 2 ), 1 ) + "/10" );

	/* Translators: %s expands to the review count. */
	const reviewPart = sprintf( __( "%s reviews", "wordpress-seo" ), shoppingData.reviewCount );

	return (
		<ProductData>
			{ ( shoppingData.reviewCount > 0 ) &&
				<Fragment>
					<StarRating rating={ shoppingData.rating } />
					<span> { ratingPart } · </span>
					<span>{ reviewPart } · </span>
				</Fragment>
			}
			{ shoppingData.price &&
				<Fragment>
					<span dangerouslySetInnerHTML={ { __html: shoppingData.price } } />
				</Fragment>
			}
			{ shoppingData.availability &&
				<span>{ ` · ${ capitalize( shoppingData.availability ) }` }</span> }
		</ProductData>
	);
}

export default ProductDataDesktop;

ProductDataDesktop.propTypes = {
	shoppingData: PropTypes.shape( {
		rating: PropTypes.number,
		reviewCount: PropTypes.number,
		availability: PropTypes.string,
		price: PropTypes.string,
	} ).isRequired,
};
