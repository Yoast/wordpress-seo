import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { StarRating } from "@yoast/components";
import "./product-data.css";

/**
 * Renders ProductData component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component.
 */
function ProductDataMobile( props ) {
	const { shoppingData } = props;

	return (
		<Fragment>
			<div className="yoast-shopping-data-preview__column">
				<div className="yoast-shopping-data-preview__upper">Rating</div>
				<div className="yoast-shopping-data-preview__lower">
					<span>{ shoppingData.rating * 2 }/10</span>
					<StarRating rating={ shoppingData.rating } />
					<span>{ shoppingData.reviewCount }</span>
				</div>
			</div>
			<div className="yoast-shopping-data-preview__column">
				<div className="yoast-shopping-data-preview__upper">Price</div>
				<div className="yoast-shopping-data-preview__lower" dangerouslySetInnerHTML={ { __html: shoppingData.price } } />
			</div>
			<div className="yoast-shopping-data-preview__column">
				<div className="yoast-shopping-data-preview__upper">Availability</div>
				<div className="yoast-shopping-data-preview__lower">{ shoppingData.availability }</div>
			</div>
		</Fragment>
	);
}

export default ProductDataMobile;

ProductDataMobile.propTypes = {
	shoppingData: PropTypes.object.isRequired,
};
