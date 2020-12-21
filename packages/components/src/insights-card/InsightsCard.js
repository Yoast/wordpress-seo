import React from "react";
import PropTypes from "prop-types";
import HelpIcon from "../help-icon/HelpIcon";

/**
 * A card component that can be used in the Insights Modal.
 */
class InsightsCard extends React.Component {
	/**
	 * Function to return the description if a description is provided.
	 *
	 * @returns {React.Component} The description.
	 */
	getDescription() {
		if ( this.props.description ) {
			return this.props.description;
		}

		return;
	}

	/**
	 * Function to return the help icon if a linkTo is provided.
	 *
	 * @returns {React.component} The HelpIcon.
	 */
	getHelpIcon() {
		if ( this.props.linkTo ) {
			return (
				<HelpIcon
					linkTo={ this.props.linkTo }
					linkText={ this.props.linkText }
				/>
			);
		}

		return;
	}

	/**
	 * Returns the rendered HTML.
	 *
	 * @returns {React.Component} The insights-card.
	 */
	render() {
		return (
			<div className="yoast-insights-card">
				<div className="yoast-field-group__title">
					<b>{ this.props.title }</b>
					{ this.getHelpIcon() }
				</div>
				<div className="yoast-insights-card__content">
					<p className="yoast-insights-card__score">
						<span className="yoast-insights-card__amount">{ this.props.amount }</span>
						{ this.props.unit }
					</p>
					<div className="yoast-insights-card__description">{ this.getDescription() }</div>
				</div>
			</div>
		);
	}
}

export default InsightsCard;

InsightsCard.propTypes = {
	title: PropTypes.string,
	amount: PropTypes.number.isRequired,
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
