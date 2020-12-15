import React, { Fragment } from "react";
import PropTypes from "prop-types";
import HelpIcon from "./help-icon/HelpIcon";

class InsightsCard extends React.Component {

	getDescription() {
		if ( this.props.description ) {
			return this.props.description;
		}

		return;
	}

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

	render() {
		return (
			<div className="yoast-insights-card">
				<div className="yoast-field-group__title">
					<b>{ this.props.title }</b>
					{ this.getHelpIcon() }
				</div>
				<div className="yoast-insights-card__content">
					<p className="yoast-insights-card__score"><span className="yoast-insights-card__amount">{ this.props.amount }</span> { this.props.measurement }</p>
					<div className="yoast-insights-card__description">{ this.getDescription() }</div>
				</div>
			</div>
		);
	}
}

InsightsCard.propTypes = {
	title: PropTypes.string,
	amount: PropTypes.number,
	description: PropTypes.element,
	measurement: PropTypes.string,
	linkTo: PropTypes.string,
	linkText: PropTypes.string,
}

export default InsightsCard;