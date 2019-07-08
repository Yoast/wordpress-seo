import { createContext } from "@wordpress/element";

export const LocationContext = createContext();

export const LocationProvider = LocationContext.Provider;
export const LocationConsumer = LocationContext.Consumer;

