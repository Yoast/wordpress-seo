import { useEffect } from "@wordpress/element";
import useDispatchRedirects from "./use-dispatch-redirects";
import useSelectRedirects from "./use-select-redirects";

/**
 * useGetRedirects — Custom React hook to fetch and return all redirect entries.
 *
 * This hook:
 * - Dispatches an action to fetch the list of redirects on initial render.
 * - Subscribes to and returns the current list of all redirects from the store.
 *
 * @returns {Array<Object>} An array of redirect objects from the state.
 */
const useGetRedirects = () => {
	const { fetchRedirects  } = useDispatchRedirects();
	const redirects = useSelectRedirects( "selectAllRedirects" );

	useEffect( () => {
		fetchRedirects();
	}, [] );

	return redirects;
};

export default useGetRedirects;
