import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { IconButton } from "@yoast/components";
import styled from "styled-components";

const IconButtonWithoutStyle = styled( IconButton )`
	font-family: inherit;
	font-size: "100%";
	border: 0;
	padding: 0;
	background: transparent;
	outline: none;
	box-shadow: none;
	&:focus {
		box-shadow: none;
		border: none;
		background: transparent;
	}
	&:active {
		box-shadow: none;
		border: none;
		background: transparent;
	}
`;

class CollapsibleHelpText extends Component {
	constructor() {
		super();
		this.state = {
			displayHelpText: false,
			color: "#707070",
		}
	}

	toggleHelpText(){
		this.setState({
			displayHelpText: ! this.state.displayHelpText,
		} )
	};

	changeIconColor( color ){
		this.setState({
			color,
		} )
	}

	render() {
		return (
			<Fragment>
				<div>
					<label>{ this.props.label }</label>
					<IconButtonWithoutStyle
						icon="question-circle"
						iconColor={ this.state.color }
						onClick={ () => this.toggleHelpText() }
						onMouseEnter={ () => this.changeIconColor( "#0000FF" ) }
						onMouseLeave={ () => this.changeIconColor( "#707070" ) }
					/>
					{ this.state.displayHelpText &&
						<p
							dangerouslySetInnerHTML={ { __html: this.props.helpText } }
						/>
					}
				</div>
			</Fragment>
		)
	}
}

CollapsibleHelpText.propTypes = {
	label: PropTypes.string.isRequired,
	helpText: PropTypes.string.isRequired,
};

export default CollapsibleHelpText;
