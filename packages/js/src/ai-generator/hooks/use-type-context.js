import { useContext } from "@wordpress/element";
import { TypeContext } from "../components/type-provider";

/**
 * @returns {Object} The type context.
 */
export const useTypeContext = () => useContext( TypeContext );
