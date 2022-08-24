import { useMemo } from "@wordpress/element";
import { flatten, slice } from "lodash";
import PropTypes from "prop-types";
import { useToggleState } from "../../hooks";

/**
 * @param {number} limit Maximum amount of children to render before more/less. Use < 0 for no limit.
 * @param {JSX.node[]} children The children.
 * @param {function} renderButton Render the more/less button. Receives `show` and `toggle`.
 * @param {boolean} [initialShow] Whether to initially show all the children. Defaults to false.
 * @returns {JSX.Element|JSX.node[]} The children or the limited children with more/less.
 */
const ChildrenLimiter = ( { limit, children, renderButton, initialShow = false } ) => {
	const [ show, toggle ] = useToggleState( initialShow );
	const flattened = useMemo( () => flatten( children ), [ children ] );
	const before = useMemo( () => slice( flattened, 0, limit ), [ flattened ] );
	const after = useMemo( () => slice( flattened, limit ), [ flattened ] );

	if ( limit < 0 || flattened.length <= limit ) {
		return children;
	}

	return <>
		{ before }
		{ renderButton( { show, toggle } ) }
		{ show && after }
	</>;
};

ChildrenLimiter.propTypes = {
	limit: PropTypes.number.isRequired,
	children: PropTypes.arrayOf( PropTypes.node ).isRequired,
	renderButton: PropTypes.func.isRequired,
	initialShow: PropTypes.bool,
};

export default ChildrenLimiter;
