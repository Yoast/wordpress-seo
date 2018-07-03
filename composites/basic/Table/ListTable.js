import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import colors from "../../../style-guide/colors.json";

const List = styled.ul`
	margin: 0;
 	padding: 0;
 	list-style: none;
 	position: relative;
 	width: 100%;

 	li:first-child {
		& > span::before {
			left: auto;
		}
	}
`;

List.propTypes = {
	children: PropTypes.any,
};

/**
 * Makes an element full-width in the mobile responsive view.
 *
 * @param {ReactElement} component The original element.
 * @returns {ReactElement} The element with full width responsive style.
 */
export function makeFullWidth( component ) {
	return styled( component )`
		@media screen and ( max-width: 800px ) {
			min-width: 100%;
			margin-top: 1em;
			padding-right: 0;
			padding-left: 0;
		}
	`;
}

/**
 * Creates a list table component.
 */
class ListTable extends React.Component {
	/**
	 * Constructor for the component.
	 *
	 * @param {Object} props The props to assign to the current component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Retrieves the child nodes of the ListTable and ensures that single results are wrapped in an array.
	 *
	 * @returns {Array} The children to use within the ListTable.
	 */
	getChildren() {
		if ( this.props.children === 1 ) {
			return [ this.props.children ];
		}

		return this.props.children;
	}

	/**
	 * Renders the ListTable.
	 *
	 * @returns {ReactElement} The ListTable component.
	 */
	render() {
		let children = this.getChildren();

		return (
			<List role="list">{ children }</List>
		);
	}
}

/**
 * A zebrafied variant of the ListTable component.
 */
class ZebrafiedListTable extends ListTable {
	/**
	 * Constructor for the component. Also makes a shadow copy of the props that we can manipulate.
	 * @param {Object} props The props to assign to the current component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );
		this.zebraProps = Object.assign( {}, props );
	}

	/**
	 * Zebrafies the child items of the ListTable.
	 *
	 * @returns {Array} Array containing the zebrafied rows.
	 */
	zebrafyChildren() {
		let children = this.props.children;

		// If there is only one child, there is no array, meaning there is no map method.
		if ( ! this.props.children.map ) {
			children = [ children ];
		}

		this.zebraProps.children = children.map( ( child, index ) => {
			return React.cloneElement( child, {
				background: ( index % 2 === 1 ) ? colors.$color_white : colors.$color_background_light,
				key: index,
			} );
		} );
	}

	/**
	 * Renders the zebrafied ListTable.
	 *
	 * @returns {ReactElement} The zebrafied ListTable.
	 */
	render() {
		this.zebrafyChildren();

		return ( <List role="list" { ...this.zebraProps } /> );
	}
}

ListTable.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

export { ListTable, ZebrafiedListTable };
