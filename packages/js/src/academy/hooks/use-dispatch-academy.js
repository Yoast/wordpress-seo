import { useDispatch } from "@wordpress/data";
import { STORE_NAME } from "../constants";

/**
 * @returns {*} The dispatchers for the academy store.
 */
const useDispatchAcademy = () => useDispatch( STORE_NAME );

export default useDispatchAcademy;
