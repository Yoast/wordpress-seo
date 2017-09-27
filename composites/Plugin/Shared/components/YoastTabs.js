import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import colors from "../../../../style-guide/colors.json";

const YoastTabsContainer = styled( Tabs )`
	font-size: 1em;

	.react-tabs__tab-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		list-style: none;
		padding: 0;
		margin: 0;
		text-transform: uppercase;
		border-bottom: 1px solid ${ colors.$color_grey_light };
	}

	.react-tabs__tab {
		display: inline-block;
		text-align: center;
		margin: 0 30px;
		padding: 10px;
		color: ${ colors.$color_pink_dark };
		cursor: pointer;

		&.react-tabs__tab--selected {
			box-shadow: inset 0 -5px 0 0 ${ colors.$color_pink_dark };
		}
	}

	.react-tabs__tab-panel {
		padding: 18px 20px;
		display: none;

		&.react-tabs__tab-panel--selected {
			display: block;
		}
	}
`;

/**
 * Creates a Yoast styled ARIA tabs widget.
 */
class YoastTabs extends React.Component {
	/**
	 * Gets all the defined tabs and returns an array of Tab components.
	 *
	 * @returns {Array} Array containing a Tab component for each item in the props.
	 */
	getTabs() {
		return this.props.items.map( ( item ) => {
			return <Tab key={ item.id }>{ item.label }</Tab>;
		} );
	}

	/**
	 * Gets all the defined tabpanels and returns an array of TabPanel components.
	 *
	 * @returns {Array} Array containing a Tabpanel component for each item in the props.
	 */
	getTabPanels() {
		return this.props.items.map( ( item ) => {
			return(
				<TabPanel
					key={ item.id }
					tabIndex="0">
					{ item.content }
				</TabPanel>
			);
		} );
	}

	/**
	 * Renders the ARIA tabs widget.
	 *
	 * @returns {ReactElement} The ARIA tabs widget.
	 */
	render() {
		return(
			<YoastTabsContainer>
				<TabList>
					{ this.getTabs() }
				</TabList>
				{ this.getTabPanels() }
			</YoastTabsContainer>
		);
	}
}

YoastTabs.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			content: PropTypes.object.isRequired,
		} )
	),
};

YoastTabs.defaultProps = {
	items: [],
};

export default YoastTabs;
