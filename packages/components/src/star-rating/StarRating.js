import React from "react";
import PropTypes from "prop-types";

/**
 * Renders StarRating component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component.
 */
function StarRating( props ) {
	const ratingPercentage = props.rating * 20;

	return (
		<div
			aria-hidden="true"
			className="yoast-star-rating"
		>
			<span className="yoast-star-rating__placeholder" role="img">
				<span className="yoast-star-rating__fill" style={ { width: ratingPercentage + "%" } } />
			</span>
		</div>
	);
}

export default StarRating;

StarRating.propTypes = {
	rating: PropTypes.number.isRequired,
};
