import { useCallback, useState } from "@wordpress/element";

/**
 * Creates a toggle state.
 * @param {boolean} [initialState] The initial state. Defaults to true.
 * @returns {[boolean,function,function]} The state, toggleState and setState in that order.
 */
const useToggleState = ( initialState = true ) => {
	const [ state, setState ] = useState( initialState );
	const toggleState = useCallback( () => setState( ! state ), [ state, setState ] );

	return [ state, toggleState, setState ];
};

export default useToggleState;
