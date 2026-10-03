import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, _n, sprintf } from "@wordpress/i18n";
import { round, capitalize } from "lodash";
import { StarRating } from "@yoast/components";
import { DEFAULT_BEST_RATING } from "./constants";

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
	const { rating, bestRating = DEFAULT_BEST_RATING, reviewCount, availability, price } = shoppingData;

	/* Translators: %s expands to the actual rating, e.g. 4.5 or 4.5/6 */
	const ratingPart = sprintf( __( "Rating: %s", "wordpress-seo" ), round( rating, 1 ) + ( bestRating === DEFAULT_BEST_RATING ? "" : `/${bestRating}` ) );

	/* Translators: %s expands to the review count. */
	const reviewPart = sprintf( _n( "%s review", "%s reviews", reviewCount, "wordpress-seo" ), reviewCount );

	const hasPriceOrAvailability = Boolean( price ) || Boolean( availability );

	return (
		<ProductData>
			{ ( rating > 0 && rating <= bestRating && reviewCount > 0 ) &&
				<Fragment>
					<StarRating rating={ rating / bestRating * DEFAULT_BEST_RATING } />
					<span> { ratingPart } · </span>
					<span>{ reviewPart }{ hasPriceOrAvailability ? " · " : "" }</span>
				</Fragment>
			}
			{ price &&
				<Fragment>
					<span dangerouslySetInnerHTML={ { __html: price } } />
				</Fragment>
			}
			{ availability &&
				<span>{ ` · ${ capitalize( availability ) }` }</span> }
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
