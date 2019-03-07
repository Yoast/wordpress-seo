import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import colors from "../../../../style-guide/colors.json";
import breakpoints from "../../../../style-guide/responsive-breakpoints.json";

const YoastTabsContainer = styled.div`
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
		flex: 0 1 ${ props => props.tabsBaseWidth };
		text-align: center;
		margin: 0 16px;
		padding: 16px 0;
		cursor: pointer;
		font-family: "Open Sans", sans-serif;
		font-size: ${ props => props.tabsFontSize };
		line-height: 1.33333333;
		font-weight: ${ props => props.tabsFontWeight };
		color: ${ props => props.tabsTextColor };
		text-transform: ${ props => props.tabsTextTransform };

		&.react-tabs__tab--selected {
			box-shadow: 0 4px 0 0 ${ colors.$color_pink_dark };
		}
	}

	.react-tabs__tab-panel {
		display: none;
		padding: 24px 40px;

		@media screen and ( max-width: ${ breakpoints.mobile } ) {
			padding: 16px 16px;
		}

		:focus {
			outline: none;
		}

		&.react-tabs__tab-panel--selected {
			display: block;
		}
	}
`;

YoastTabsContainer.propTypes = {
	tabsTextColor: PropTypes.string,
	tabsTextTransform: PropTypes.string,
	tabsFontSize: PropTypes.string,
	tabsFontWeight: PropTypes.string,
	tabsBaseWidth: PropTypes.string,
};

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
			return (
				<TabPanel
					key={ item.id }
					tabIndex="0"
				>
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
		return (
			<YoastTabsContainer
				tabsTextColor={ this.props.tabsTextColor }
				tabsTextTransform={ this.props.tabsTextTransform }
				tabsFontSize={ this.props.tabsFontSize }
				tabsFontWeight={ this.props.tabsFontWeight }
				tabsBaseWidth={ this.props.tabsBaseWidth }
			>
				<Tabs onSelect={ this.props.onTabSelect }>
					<TabList>
						{ this.getTabs() }
					</TabList>
					{ this.getTabPanels() }
				</Tabs>
			</YoastTabsContainer>
		);
	}

	/**
	 * Calls a callback after this component has been mounted.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.props.onTabsMounted();
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
	tabsTextColor: PropTypes.string,
	tabsTextTransform: PropTypes.string,
	tabsFontSize: PropTypes.string,
	tabsFontWeight: PropTypes.string,
	tabsBaseWidth: PropTypes.string,
	onTabSelect: PropTypes.func,
	onTabsMounted: PropTypes.func,
};

YoastTabs.defaultProps = {
	items: [],
	tabsTextColor: colors.$color_grey_dark,
	tabsTextTransform: "none",
	tabsFontSize: "1.5em",
	tabsFontWeight: "200",
	tabsBaseWidth: "200px",
	onTabsMounted: () => {},
};

export default YoastTabs;
