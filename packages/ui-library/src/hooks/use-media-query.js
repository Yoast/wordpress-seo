import { useMemo, useCallback, useEffect, useState } from "@wordpress/element";

/**
 * Creates a media query and returns a boolean that informs whether the query is met.
 *
 * @param {string} [mediaQueryString] The media query to check against.
 *
 * @returns {Object} An object with a .matches field that is true if the media query is met.
 */
const useMediaQuery = ( mediaQueryString ) => {
	const mediaQueryList = useMemo( () => window.matchMedia( mediaQueryString ), [ mediaQueryString ] );
	const [ matches, setMatches ] = useState( mediaQueryList.matches );

	const handleEvent = useCallback( ( event ) => {
		setMatches( event.matches );
	}, [ setMatches ] );

	useEffect( () => {
		mediaQueryList.addEventListener( "change", handleEvent );
		return () => {
			mediaQueryList.removeEventListener( "change", handleEvent );
		};
	}, [ mediaQueryList, handleEvent ] );

	return { matches };
};

export default useMediaQuery;
