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

const HelpTextPanel = styled.div`
	max-width: ${ props => props.maxWidth };
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
	 * Constructs the component and sets its initial state.
	 *
	 * @param {Object} props The props to use for this component.
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
		const helpPanelId = `${ this.uniqueId }-panel`;
		const { isExpanded } = this.state;

		return (
			<HelpTextContainer
				className={ this.props.className }
			>
				<HelpTextButton
					className={ this.props.className + "__button" }
					onClick={ this.onButtonClick.bind( this ) }
					aria-expanded={ isExpanded }
					aria-controls={ isExpanded ? helpPanelId : null }
					aria-label={ this.props.helpTextButtonLabel }
				>
					<StyledSvg
						size="16px"
						color={ colors.$color_grey_text }
						icon="question-circle"
					/>
				</HelpTextButton>
				{ isExpanded &&
					<HelpTextPanel
						id={ helpPanelId }
						className={ this.props.className + "__panel" }
						maxWidth={ this.props.maxWidth }
					>
						<HelpText text={ this.props.helpText } />
					</HelpTextPanel>
				}
			</HelpTextContainer>
		);
	}
}

HelpTextWrapper.propTypes = {
	className: PropTypes.string,
	helpTextButtonLabel: PropTypes.string.isRequired,
	maxWidth: PropTypes.string,
	helpText: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ),
};

HelpTextWrapper.defaultProps = {
	className: "yoast-help",
	maxWidth: null,
	helpText: "",
};

export default HelpTextWrapper;
