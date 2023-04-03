import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * Wraps WP data's useDispatch.
 * @returns {Object} The dispatchers for the admin store.
 */
const useDispatchAdmin = () => useDispatch( STORE_NAME );

export default useDispatchAdmin;
