import { useEffect } from "@wordpress/element";
import useDispatchRedirects from "./use-dispatch-redirects";
import useSelectRedirects from "./use-select-redirects";

/**
 * useGetRedirectsSettings — Custom React hook to fetch and return redirects settings
 *
 * This hook:
 * - Dispatches an action to fetch the settings
 * - Subscribes to and returns the current redirects settings
 *
 * @returns {Array<Object>} An array of redirect objects from the state.
 */
const useGetRedirectsSettings = () => {
	const { fetchRedirectsSettings  } = useDispatchRedirects();
	const settings = useSelectRedirects( "selectSettings" );

	useEffect( () => {
		fetchRedirectsSettings();
	}, [] );

	return settings;
};

export default useGetRedirectsSettings;
