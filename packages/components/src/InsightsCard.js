import React, { Fragment } from "react";
import PropTypes from "prop-types";

class InsightsCard extends React.Component {

	getDescription() {
		if ( this.props.description ) {
			return <p className="yoast-insights-card__description">{ this.props.description }</p>;
		}

		return;
	}

	render() {
		return (
			<div className="yoast-insights-card">
				<p className="yoast-field-group__title">{ this.props.title }</p>
				<div className="yoast-insights-card__content">
					<p><span className="yoast-insights-card__amount">{ this.props.amount }</span> minutes</p>
					{ this.getDescription() }
				</div>
			</div>
		);
	}
}

export default InsightsCard;

InsightsCard.propTypes = {
	title: PropTypes.String,
	amount: PropTypes.String.isRequired,
	description: PropTypes.String,
}

InsightsCard.defaultProps = {
	title: "",
	amount: "",
	description: "",
}