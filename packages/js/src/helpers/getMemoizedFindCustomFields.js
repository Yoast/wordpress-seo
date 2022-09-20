import { debounce, memoize, noop } from "lodash-es";

// Memoize this so that prop changes of the container don't lead to a new debounce working on a different timer than the previous one.
const getMemoizedFindCustomFields = memoize(
	( postId, findCustomFields ) => {
		// If the post ID is 0 there can be no custom fields as it's a newly created post so noop.
		if ( postId === 0 ) {
			return noop;
		}

		return debounce(
			value => findCustomFields( value, postId ),
			500
		);
	}
);

export default getMemoizedFindCustomFields;
