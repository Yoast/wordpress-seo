import { useContext } from "@wordpress/element";
import { RootContext } from "../components/root";

/**
 * @returns {{ isRtl: boolean }} The root context.
 */
const useRootContext = () => useContext( RootContext );

export default useRootContext;
