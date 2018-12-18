import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../style-guide/colors.json";
import { makeOutboundLink } from "../../utils/makeOutboundLink";

const CardRegularButton = styled.a`
	cursor: pointer;
	color: ${ colors.$color_black };
	white-space: nowrap;
	display: block;
	border-radius: 4px;
	background-color: ${ colors.$color_grey_cta };
	padding: 12px 16px;
	box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
	border: none;
	text-decoration: none;
	font-weight: bold;
	font-size: inherit;
	margin-top: 0;
	margin-bottom: 8px;

	&:hover,
	&:focus,
	&:active {
		color: ${ colors.$color_black };
		background-color: ${ colors.$color_grey_hover };
		text-decoration: none;
	}

	:active {
		position: relative;
		top: 2px
		background-color: ${ colors.$color_grey_hover };
		box-shadow: none;
		filter: none;
	}
`;

const CardUpsellButton = styled.a`
	cursor: pointer;
	color: ${ colors.$color_black };
	white-space: nowrap;
	display: block;
	border-radius: 4px;
	background-color: ${ colors.$color_button_upsell };
	padding: 12px 16px;
	box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
	border: none;
	text-decoration: none;
	font-weight: bold;
	font-size: inherit;
	margin-top: 0;
	margin-bottom: 8px;

	&:hover,
	&:focus,
	&:active {
		color: ${ colors.$color_black };
		background: ${ colors.$color_button_upsell_hover };
	}

	:active {
		position: relative;
		top: 2px;
		background-color: ${ colors.$color_button_hover_upsell };
		box-shadow: none;
		filter: none;
	}
`;

const CardInfoLink = styled.a`
	font-weight: bold;
`;

const OutboundInfoLink = makeOutboundLink( CardInfoLink );

const ActionBlock = styled.div`
	text-align: center;
`;

const CourseFeatureList = styled.div`
	li {
		position: relative;
		margin-left: 16px;

		&:before {
			content: "✓";
			color: ${ colors.$color_green };
			position: absolute;
			font-weight: bold;
			display: inline-block;
			left: -16px;
		}
	}
`;

const Details = styled.div`
	margin-bottom: 12px;
	border-bottom: 1px ${ colors.$color_grey } solid;
	flex-grow: 1;
`;

/**
 * CardDetails component.
 */
class CardDetails extends React.Component {
	/**
	 * Sets the CourseCard object.
	 *
	 * @returns {void}
	 */
	constructor() {
		super();
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		const buttonType =  this.props.ctaButton.ctaButtonType === "regular" ? CardRegularButton : CardUpsellButton;
		const OutboundLinkButton = makeOutboundLink( buttonType );

		return (
			<Fragment>
				<Details>
					<CourseFeatureList
						dangerouslySetInnerHTML={ { __html: this.props.description } }
					/>
				</Details>
				<ActionBlock>
					<OutboundLinkButton href={ this.props.ctaButton.ctaButtonUrl }>
						{ this.props.ctaButton.ctaButtonCopy }
					</OutboundLinkButton>
					<OutboundInfoLink href={ this.props.courseUrl }>
						{ this.props.readMoreLinkText }
					</OutboundInfoLink>
				</ActionBlock>
			</Fragment>
		);
	}
}

export default CardDetails;

CardDetails.propTypes = {
	description: PropTypes.string,
	courseUrl: PropTypes.string,
	ctaButton: PropTypes.object,
	readMoreLinkText: PropTypes.string,
};

CardDetails.defaultProps = {
	description: "",
	courseUrl: "",
	ctaButton: {},
	readMoreLinkText: "",
};
