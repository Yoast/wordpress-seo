import { syncFromMetadata } from "./sync-from-metadata";
import { syncToMetadata } from "./sync-to-metadata";

/**
 * Initializes the metadata synchronization.
 * @param {number} productId The product ID.
 * @returns {function} The unsubscribe function.
 */
export const initializeSync = ( productId ) => {
	const unsubscribeFrom = syncFromMetadata( productId );
	const unsubscribeTo = syncToMetadata( productId );

	return () => {
		unsubscribeFrom();
		unsubscribeTo();
	};
};
