// External dependencies
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import uniqueId from "lodash/uniqueId";

// Internal dependencies
import HelpText from "../../Shared/components/HelpText";
import colors from "../../../../style-guide/colors.json";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";
import { rgba } from "../../../../style-guide/helpers";


const HelpTextContainer = styled.div`
	max-width: 600px;
	font-weight: normal;
	margin: 0 20px 10px 25px;
`;

const HelpTextDiv = styled.div`
	max-width: 400px;
	display: block;
	transition: all 0.5s ease;
	overflow: hidden;
	max-height: 0;
`;

const HelpTextButton = styled( Button )`
	min-width: 14px;
	min-height: 14px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: 1px solid transparent;
	clip: rect(1px 1px 1px 1px);
	box-shadow: none;
	position: relative;
	display: block;
	margin: -44px -10px 10px 0;
	background-color: transparent;
	float: right;
	padding: 3px 0 0 6px;
	&:hover {
		color: ${ colors.$color_blue };
	}
	&:focus {
		border: 1px solid ${ colors.$color_blue };
		outline: none;
		box-shadow: 0 0 3px ${ rgba( colors.$color_blue_dark, .8 ) };

		svg {
			fill: ${ colors.$color_blue };
			color: ${ colors.$color_blue };
		}
	}
	&:active {
		box-shadow: none;
	}
`;

const StyledSvg = styled( SvgIcon )`
	vertical-align: center;
	position: relative;
	&:hover {
		fill: ${ colors.$color_blue };
	}
`;

class HelpTextWrapper extends React.Component {
	/**
	 * Renders the HelpTextWrapper component.
	 *
	 * @param {Object}       props           The passed props.
	 * @param {string}       props.className The class name.
	 * @param {String|Array} props.helpText  The help text to be displayed.
	 *
	 * @returns {ReactComponent} The HelpTextWrapper component.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isExpanded: false,
		};

		this.uniqueId = uniqueId( "yoast-help-" );
	}

	/**
	 * Toggles the help text expanded state.
	 *
	 * @returns {void}
	 */
	onButtonClick() {
		this.setState( { isExpanded: ! this.state.isExpanded } );
	}

	/**
	 * Renders the help text wrapper.
	 *
	 * @returns {ReactElement} The rendered help text wrapper.
	 */
	render() {
		const helpTextId = `${ this.uniqueId }-text`;

		return (
			<HelpTextContainer
				className={ this.props.className }>
				<HelpTextButton
					className={ this.props.className + "__yoast-help-button" }
					onClick={ this.onButtonClick.bind( this ) }
					aria-expanded={ this.state.isExpanded }
					aria-controls={ helpTextId }
					aria-label={ "yoast-help-text" }
				>
					<StyledSvg
						size="16px"
						color={ colors.$color_grey_text }
						icon="question-circle"
					/>
				</HelpTextButton>
				<HelpTextDiv
					id={ helpTextId }
					className={ this.props.className + "__helpDiv" }
					aria-hidden={ ! this.state.isExpanded }
					style={ { maxHeight: this.state.isExpanded ? "200px" : "0" } }
				>
					<HelpText text={ this.props.helpText } />
				</HelpTextDiv>
			</HelpTextContainer>
		);
	}
}

HelpTextWrapper.propTypes = {
	className: PropTypes.string,
	helpText: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ),
};

HelpTextWrapper.defaultProps = {
	className: "yoast-help-button",
	helpText: "",
};

export default HelpTextWrapper;
