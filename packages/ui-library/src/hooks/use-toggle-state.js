import { useCallback, useState } from "react";

/**
 * Creates a toggle state.
 * @param {boolean} [initialState] The initial state. Defaults to true.
 * @returns {[boolean,function,function,function,function]} The state, toggleState, setState, setTrue and setFalse in that order.
 */
const useToggleState = ( initialState = true ) => {
	const [ state, setState ] = useState( initialState );
	const toggleState = useCallback( () => setState( ! state ), [ state, setState ] );
	const setTrue = useCallback( () => setState( true ), [ setState ] );
	const setFalse = useCallback( () => setState( false ), [ setState ] );

	return [ state, toggleState, setState, setTrue, setFalse ];
};

export default useToggleState;
