import { useEffect, useRef } from "react";

/**
 * @param {*} value The initial value.
 * @returns {*} The previous value.
 */
const usePrevious = ( value ) => {
	const previous = useRef( value );

	useEffect( () => {
		previous.current = value;
	}, [ value ] );

	return previous.current;
};

export default usePrevious;
