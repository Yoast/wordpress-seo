import { ImageSelectContext } from "./context";
import { useContext } from "react";

/**
 * @returns {Object} The ImageSelect context.
 */
export const useImageSelectContext = () => useContext( ImageSelectContext );
