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
	/* translators: Hidden accessibility text; %d expands to number of occurrences. */
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

// Stable reference matching the old defaultProps single instance, so it keeps a constant identity across renders.
const DEFAULT_ITEMS = [];

/**
 * Creates a DataModel based on props.
 *
 * @param {object} props The properties.
 *
 * @returns {HTMLElement} A <ul> with <li> items.
 */
const DataModel = ( { items = DEFAULT_ITEMS } ) => (
	<ul
		className="yoast-data-model"
		aria-label={
			/* translators: Hidden accessibility text. */
			__( "Prominent words", "wordpress-seo" ) }
	>
		{ items.map( DataItem ) }
	</ul>
);

DataModel.propTypes = {
	items: PropTypes.arrayOf( PropTypes.shape( dataItemProps ) ),
};

export default DataModel;
