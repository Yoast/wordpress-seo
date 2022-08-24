import { useMemo } from "@wordpress/element";
import { flatten, slice } from "lodash";
import PropTypes from "prop-types";
import { useToggleState } from "../../hooks";

/**
 * @param {number} limit Maximum amount of children to render before more/less. Use < 0 for no limit.
 * @param {JSX.node[]} children The children.
 * @param {function} renderButton Render the more/less button. Receives `show` / `toggle`
 * @returns {JSX.Element|JSX.node[]} The children or the limited children with more/less.
 */
const ChildrenLimiter = ( { limit, children, renderButton } ) => {
	const [ show, toggle ] = useToggleState( false );
	const flattened = useMemo( () => flatten( children ), [ children ] );
	const sliced = useMemo( () => slice( flattened, 0, limit ), [ flattened ] );

	if ( limit < 0 || flattened.length <= limit ) {
		return children;
	}

	return <>
		{ show ? children : sliced }
		{ renderButton( { show, toggle } ) }
	</>;
};

ChildrenLimiter.propTypes = {
	limit: PropTypes.number.isRequired,
	children: PropTypes.arrayOf( PropTypes.node ).isRequired,
	renderButton: PropTypes.func.isRequired,
};

export default ChildrenLimiter;
