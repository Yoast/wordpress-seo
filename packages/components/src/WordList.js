// External dependencies.
import React from "react";
import PropTypes from "prop-types";

/**
 * @summary WordList component.
 *
 * @param {object}   props                 The props to use.
 * @param {string}   props.title           The title of the list.
 * @param {string}   props.classNamePrefix CSS classname prefix for the elements.
 * @param {array}    props.words           The relevant words.
 * @param {function} props.showBeforeList  Function to call before list is shown.
 * @param {function} props.showAfterList   Function to call after list is shown.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const WordList = ( props ) => {
	const { title, classNamePrefix, words, showBeforeList, showAfterList } = props;

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
			{ showBeforeList }
			{ list }
			{ showAfterList }
		</div>
	);
};

WordList.propTypes = {
	words: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	showBeforeList: PropTypes.func,
	showAfterList: PropTypes.func,
	classNamePrefix: PropTypes.string,
};

WordList.defaultProps = {
	classNamePrefix: "",
	showBeforeList: () => {
		return "";
	},
	showAfterList: () => {
		return "";
	},
};

export default WordList;
