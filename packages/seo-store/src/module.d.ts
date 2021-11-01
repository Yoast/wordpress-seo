/* eslint-disable @typescript-eslint/ban-types */

/**
 * Overwrite types for @wordpress/data
 */
declare module "@wordpress/data" {
    export function register( store: object ): void;
    export function createReduxStore( name: string, config: object ): object;
    export function combineReducers( reducers: object ): object;
}
