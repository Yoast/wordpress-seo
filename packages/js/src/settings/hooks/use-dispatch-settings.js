import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @returns {*} The dispatchers for the settings store.
 */
const useDispatchSettings = () => useDispatch( STORE_NAME );

export default useDispatchSettings;
