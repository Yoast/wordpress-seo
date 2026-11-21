import React from "react";
import { __, sprintf } from "@wordpress/i18n";

import "./data-model.css";

/**
 * Creates a list item from the props.
 *
 * @param {Object} props The properties.
 * @param {number} props.width The width of the item bar, as a percentage.
 * @param {string} props.name The name of the item.
 * @param {number} props.number The number of occurrences of the item.
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

// Stable reference matching the old defaultProps single instance, so it keeps a constant identity across renders.
const DEFAULT_ITEMS = [];

/**
 * Creates a DataModel based on props.
 *
 * @param {Object} props The properties.
 * @param {Object[]} [props.items] The items to render.
 * @param {number} props.items[].width The width of the item bar, as a percentage.
 * @param {string} props.items[].name The name of the item.
 * @param {number} props.items[].number The number of occurrences of the item.
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

export default DataModel;
