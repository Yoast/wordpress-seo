import React from "react";
import PropTypes from "prop-types";

import "./data-model.css";

/**
 * Props for dataItem.
 */
const dataItemProps = {
	width: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
};

/**
 * Creates a list item from the props.
 *
 * @param {object} props The properties.
 *
 * @returns {HTMLElement} A list item.
 */
const DataItem = ( props ) => (
	<li key={ props.name + "_dataItem" } style={ { "--width": `${ props.width}%` } }>{ props.name }<span>{ props.label }</span></li>
);

DataItem.propTypes = dataItemProps;

/**
 * Creates a DataModel based on props.
 *
 * @param {object} props The properties.
 *
 * @returns {HTMLElement} A <ul> with <li> items.
 */
const DataModel = ( props ) => (
	<ul className="yoast-data-model">
		{ props.items.map( DataItem ) }
	</ul>
);

DataModel.propTypes = {
	items: PropTypes.arrayOf( PropTypes.shape( dataItemProps ) ),
};

DataModel.defaultProps = {
	items: [],
};

export default DataModel;
