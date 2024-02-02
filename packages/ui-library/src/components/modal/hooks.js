import { createContext, useContext } from "@wordpress/element";
import { noop } from "lodash";

export const ModalContext = createContext( { isOpen: false, onClose: noop } );

/**
 * @returns {Object} The modal context.
 */
export const useModalContext = () => useContext( ModalContext );
