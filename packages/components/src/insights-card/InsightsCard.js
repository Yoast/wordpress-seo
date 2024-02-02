import React from "react";
import PropTypes from "prop-types";
import { FieldGroup } from "../field-group";

/**
 * A card component that can be used in the Insights Modal.
 */
class InsightsCard extends React.Component {
	/**
	 * Function to return the content of the insights card.
	 *
	 * @returns {React.component} The InsightsCardContent.
	 */
	getInsightsCardContent() {
		return (
			<div className="yoast-insights-card__content">
				<p className="yoast-insights-card__score">
					<span className="yoast-insights-card__amount">{ this.props.amount }</span>
					{ this.props.unit }
				</p>
				{ this.props.description &&
				<div className="yoast-insights-card__description">{ this.props.description }</div> }
			</div>
		);
	}

	/**
	 * Returns the rendered HTML.
	 *
	 * @returns {React.Component} The InsightsCard.
	 */
	render() {
		return (
			<FieldGroup
				label={ this.props.title }
				linkTo={ this.props.linkTo }
				linkText={ this.props.linkText }
				wrapperClassName={ "yoast-insights-card" }
			>
				{ this.getInsightsCardContent() }
			</FieldGroup>
		);
	}
}

export default InsightsCard;

InsightsCard.propTypes = {
	title: PropTypes.string,
	amount: PropTypes.oneOfType( [ PropTypes.number, PropTypes.oneOf( [ "?" ] ) ] ).isRequired,
	description: PropTypes.element,
	unit: PropTypes.string,
	linkTo: PropTypes.string,
	linkText: PropTypes.string,
};

InsightsCard.defaultProps = {
	title: "",
	description: null,
	unit: "",
	linkTo: "",
	linkText: "",
};
