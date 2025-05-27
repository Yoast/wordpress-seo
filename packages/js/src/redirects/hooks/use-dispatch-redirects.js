import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @returns {*} The dispatchers for the redirects store.
 */
const useDispatchRedirects = () => useDispatch( STORE_NAME );

export default useDispatchRedirects;
