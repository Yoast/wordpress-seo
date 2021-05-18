import React from "react";
import PropTypes from "prop-types";

/**
 * Renders StarRating component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component displays a number between 0 and 5 as (partly) colored stars.
 */
function StarRating( props ) {
	let rating = props.rating;

	// As we have 5 stars, the rating should be between 0 and 5.
	if ( rating < 0 ) {
		rating = 0;
	}

	if ( rating > 5 ) {
		rating = 5;
	}

	const ratingPercentage = rating * 20;

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
