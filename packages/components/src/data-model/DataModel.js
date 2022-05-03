import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";

import "./data-model.css";

/**
 * Props for dataItem.
 */
const dataItemProps = {
	width: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
};

/**
 * Creates a list item from the props.
 *
 * @param {object} props The properties.
 *
 * @returns {HTMLElement} A list item.
 */
const DataItem = ( props ) => {
	/* Translators: %d expands to number of occurrences. */
	const screenReaderText = sprintf( __( "%d occurrences", "wordpress-seo" ), props.number );
	return (
		<li
			key={ props.name + "_dataItem" }
			style={ { "--yoast-width": `${ props.width}%` } }
		>
			{ props.name }
			<span>{ props.number }</span>
			<span className="screen-reader-text">{ screenReaderText }</span>
		</li>
	);
};

DataItem.propTypes = dataItemProps;

/**
 * Creates a DataModel based on props.
 *
 * @param {object} props The properties.
 *
 * @returns {HTMLElement} A <ul> with <li> items.
 */
const DataModel = ( props ) => (
	<ul
		className="yoast-data-model"
		aria-label={ __( "Prominent words", "wordpress-seo" ) }
	>
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
