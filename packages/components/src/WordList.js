// External dependencies.
import React from "react";
import PropTypes from "prop-types";

/**
 * @summary WordList component.
 *
 * @param {string}   title           The title of the list.
 * @param {string}   classNamePrefix CSS classname prefix for the elements.
 * @param {array}    words           The relevant words.
 * @param {number}   limit           The maximum number of keywords to display.
 * @param {function} showBeforeList  Function to call before list is shown.
 * @param {function} showAfterList   Function to call after list is shown.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const WordList = ( { title, classNamePrefix, words, limit, showBeforeList, showAfterList } ) => {
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
			{ showBeforeList( words ) }
			{ list }
			{ showAfterList() }
		</div>
	);
};

WordList.propTypes = {
	words          : PropTypes.array.isRequired,
	limit          : PropTypes.number,
	title          : PropTypes.string.isRequired,
	showBeforeList : PropTypes.func,
	showAfterList  : PropTypes.func,
	classNamePrefix: PropTypes.string,
};

WordList.defaultProps = {
	limit: 5,
	classNamePrefix: "",
	showBeforeList: words => {
		return '';
	},
	showAfterList: () => {
		return '';
	}
};

export default WordList;
