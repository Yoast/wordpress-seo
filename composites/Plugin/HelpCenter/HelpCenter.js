import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages } from "react-intl";

import { HelpCenterButton } from "../../Plugin/Shared/components/HelpCenterButton";
import Paper from "../../../composites/basic/Paper"
import colors from "../../../style-guide/colors.json";
import YoastTabs from "../Shared/components/YoastTabs";

const messages = defineMessages( {
	buttonText: {
		id: "helpCenter.buttonText",
		defaultMessage: "Need help?",
	},
} );

export const HelpCenterContainer = styled.div`
	margin-bottom: 1em;
`;

/**
 * Returns the HelpCenter component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The HelpCenter component.
 */
class HelpCenter extends React.Component {

	/**
	 * Constructor for the component.
	 * @param {Object} props The props to assign to the current component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isExpanded: false,
		};
	}

	/**
	 * Handles the onButtonClick event.
	 *
	 * @returns {void}
	 */
	onButtonClick() {
		this.setState( { isExpanded: ! this.state.isExpanded } );
	}

	/**
	 * Renders the HelpCenter.
	 *
	 * @returns {ReactElement} The HelpCenter component.
	 */
	render() {
		return (
			<HelpCenterContainer>
				<HelpCenterButton
					onClick={ this.onButtonClick.bind( this ) }
					isExpanded={ this.state.isExpanded }
					backgroundColor={ this.props.buttonBackgroundColor }
					textColor={ this.props.buttonTextColor }
					iconColor={ this.props.buttonIconColor }
					withTextShadow={ this.props.buttonWithTextShadow }
				>
					{ this.props.intl.formatMessage( messages.buttonText ) }
				</HelpCenterButton>
				{ this.state.isExpanded && <Paper minHeight="432px"><YoastTabs items={ this.props.items }/></Paper> }
			</HelpCenterContainer>
		);
	}
}

HelpCenter.propTypes = {
	intl: intlShape.isRequired,
	items: PropTypes.array.isRequired,
	buttonBackgroundColor: PropTypes.string,
	buttonTextColor: PropTypes.string,
	buttonIconColor: PropTypes.string,
	buttonWithTextShadow: PropTypes.bool,
};

HelpCenter.defaultProps = {
	buttonBackgroundColor: colors.$color_green_medium_light,
	buttonTextColor: colors.$color_white,
	buttonIconColor: colors.$color_white,
	buttonWithTextShadow: true,
};

export default injectIntl( HelpCenter );
