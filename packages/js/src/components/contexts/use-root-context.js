import { useContext } from "@wordpress/element";
import { RootContext } from "./root";

/**
 * @returns {Object} The root context.
 */
const useRootContext = () => useContext( RootContext );

export default useRootContext;
