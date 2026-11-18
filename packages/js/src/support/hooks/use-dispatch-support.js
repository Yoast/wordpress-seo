import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @returns {*} The dispatchers for the support store.
 */
export const useDispatchSupport = () => useDispatch( STORE_NAME );
