import { useEffect, useRef } from "@wordpress/element";

/**
 * A hook that runs an effect only one at a time.
 * @param {function: Promise} effect The effect to run. Needs to return a promise to indicate when it is done.
 * @param {array} [dependencies=[]] The dependencies of the effect.
 */
export const useEffectOneAtATime = ( effect, dependencies = [] ) => {
	const isUsing = useRef( false );

	useEffect( () => {
		if ( isUsing.current ) {
			return;
		}

		isUsing.current = true;
		effect().finally( () => {
			isUsing.current = false;
		} );
	}, [ effect, dependencies ] );
};
