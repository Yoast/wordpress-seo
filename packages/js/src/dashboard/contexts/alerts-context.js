import { createContext } from "@wordpress/element";

/**
 * The context for the alerts.
 */
export const AlertsContext = createContext( { Icon: null, bulletClass: "", iconClass: "" } );
