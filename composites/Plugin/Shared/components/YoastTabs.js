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
		border-bottom: 4px solid ${ colors.$color_grey_light };
	}

	.react-tabs__tab {
		flex: 0 1 200px;
		text-align: center;
		margin: 0 16px;
		padding: 16px 0;
		color: ${ colors.$color_grey_dark };
		cursor: pointer;
		font: 200 1.5em/32px "Open Sans", sans-serif;

		&.react-tabs__tab--selected {
			box-shadow: 0 4px 0 0 ${ colors.$color_pink_dark };
		}
	}

	.react-tabs__tab-panel {
		display: none;
		padding: 16px;

		:focus {
			outline: none;
		}

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
