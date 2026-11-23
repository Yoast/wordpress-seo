// External dependencies.
import React from "react";

/**
 * @summary WordList component.
 *
 * @deprecated
 *
 * @param {Object} props The props to use.
 * @param {Array} props.words The relevant words.
 * @param {string} props.title The title of the list.
 * @param {string} [props.header=""] Content to show before the list.
 * @param {string} [props.footer=""] Content to show after the list.
 * @param {string} [props.classNamePrefix=""] CSS classname prefix for the elements.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const WordList = ( { title, classNamePrefix = "", words, header = "", footer = "" } ) => {
	console.warn( "The WordList component has been deprecated and will be removed in a future release." );

	const list = (
		<ol className={ classNamePrefix + "__list" }>
			{ words.map( word => {
				return (
					<li
						key={ word }
						className={ classNamePrefix + "__item" }
					>
						{ word }
					</li>
				);
			} ) }
		</ol>
	);

	return (
		<div className={ classNamePrefix }>
			<p><strong>{ title }</strong></p>
			{ header }
			{ list }
			{ footer }
		</div>
	);
};

export default WordList;
