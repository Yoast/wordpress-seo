// External dependencies.
import React from "react";
import PropTypes from "prop-types";

/**
 * @summary WordList component.
 *
 * @deprecated
 *
 * @param {object}      props                 The props to use.
 * @param {string}      props.title           The title of the list.
 * @param {string}      props.classNamePrefix CSS classname prefix for the elements.
 * @param {array}       props.words           The relevant words.
 * @param {HTMLElement} props.header          Function to call before list is shown.
 * @param {HTMLElement} props.footer          Function to call after list is shown.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const WordList = ( props ) => {
	console.warn( "The WordList component has been deprecated and will be removed in a future release." );

	const { title, classNamePrefix, words, header, footer } = props;

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

WordList.propTypes = {
	words: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	header: PropTypes.string,
	footer: PropTypes.string,
	classNamePrefix: PropTypes.string,
};

WordList.defaultProps = {
	classNamePrefix: "",
	header: "",
	footer: "",
};

export default WordList;
