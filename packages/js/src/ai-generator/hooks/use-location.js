import { useContext } from "@wordpress/element";
import { LocationContext } from "@yoast/externals/contexts";

/**
 * @returns {string} The location.
 */
export const useLocation = () => useContext( LocationContext );
