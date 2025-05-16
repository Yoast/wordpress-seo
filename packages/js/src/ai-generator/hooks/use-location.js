import { createContext, useContext } from "@wordpress/element";
import { get } from "lodash";

const LocationContext = get( window, "yoast.editorModules.components.contexts.location.LocationContext", createContext( "unknown" ) );

/**
 * @returns {string} The location.
 */
export const useLocation = () => useContext( LocationContext );
