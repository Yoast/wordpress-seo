import { nanoid } from "@reduxjs/toolkit";
import { flatten, slice } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import AnimateHeight from "react-animate-height";
import { useToggleState } from "../../hooks";

/**
 * @param {number} limit Maximum amount of children to render before more/less. Use < 0 for no limit.
 * @param {JSX.node[]} children The children.
 * @param {function} renderButton Render the more/less button. Receives `show`, `toggle` and `ariaProps`.
 * @param {boolean} [initialShow] Whether to initially show all the children. Defaults to false.
 * @param {string} [id] Optional ID.
 * @returns {JSX.Element|JSX.node[]} The children or the limited children with more/less.
 */
const ChildrenLimiter = ( { limit, children, renderButton, initialShow = false, id: requestedId = "" } ) => {
	const [ show, toggle ] = useToggleState( initialShow );
	const flattened = useMemo( () => flatten( children ), [ children ] );
	const before = useMemo( () => slice( flattened, 0, limit ), [ flattened ] );
	const after = useMemo( () => slice( flattened, limit ), [ flattened ] );
	const id = useMemo( () => requestedId || `yst-animate-height-${ nanoid() }`, [ requestedId ] );
	const ariaProps = useMemo( () => ( {
		"aria-expanded": show,
		"aria-controls": id,
	} ), [ show, id ] );

	if ( limit < 0 || flattened.length <= limit ) {
		return children;
	}

	return <>
		{ before }
		<AnimateHeight
			id={ id }
			easing="ease-in-out"
			duration={ 300 }
			height={ show ? "auto" : 0 }
			animateOpacity={ true }
		>
			{ after }
		</AnimateHeight>
		{ renderButton( { show, toggle, ariaProps } ) }
	</>;
};

ChildrenLimiter.propTypes = {
	limit: PropTypes.number.isRequired,
	children: PropTypes.arrayOf( PropTypes.node ).isRequired,
	renderButton: PropTypes.func.isRequired,
	initialShow: PropTypes.bool,
	id: PropTypes.string,
};

export default ChildrenLimiter;
