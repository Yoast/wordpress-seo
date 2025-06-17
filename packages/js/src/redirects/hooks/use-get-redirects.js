import { useEffect } from "@wordpress/element";
import useDispatchRedirects from "./use-dispatch-redirects";
import useSelectRedirects from "./use-select-redirects";
import { FORMAT_PLAIN } from "../constants";

/**
 * useGetRedirects — Custom React hook to fetch and return all redirect entries.
 *
 * This hook:
 * - Dispatches an action to fetch the list of redirects on initial render.
 * - Subscribes to and returns the current list of all redirects from the store.
 * @param {string} format - The format of the redirects being managed. Can be "plain" or "regex".
 *
 * @returns {Array<Object>} An array of redirect objects from the state.
 */
const useGetRedirects = ( format = FORMAT_PLAIN ) => {
	const { fetchRedirects  } = useDispatchRedirects();
	const redirects = useSelectRedirects( "selectAllRedirects" );

	useEffect( () => {
		fetchRedirects( format );
	}, [] );

	return redirects;
};

export default useGetRedirects;
