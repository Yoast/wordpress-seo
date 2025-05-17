import { noop } from "lodash";
import { createContext, useContext } from "react";

export const ModalContext = createContext( { isOpen: false, onClose: noop } );

/**
 * @returns {Object} The modal context.
 */
export const useModalContext = () => useContext( ModalContext );
