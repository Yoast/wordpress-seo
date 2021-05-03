import { createContext } from "@wordpress/element";

export const LocationContext = createContext( "location" );

export const LocationProvider = LocationContext.Provider;
export const LocationConsumer = LocationContext.Consumer;
