import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useState } from "@wordpress/element";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { ALERT_KEY, STORE_NAME } from "./constants";

/**
 * Returns the props for the Trustpilot review notification.
 * @returns {{dismiss: (function(): *), shouldShow: boolean}} The props.
 */
export const useTrustpilotReviewNotification = () => {
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).getIsPremium(), [] );
	const isDismissed = useSelect( ( select ) => select( STORE_NAME ).isAlertDismissed( ALERT_KEY ), [] );
	const { overallScore } = useSelect( ( select ) => select( STORE_NAME ).getResultsForFocusKeyword(), [] );
	const { dismissAlert } = useDispatch( STORE_NAME );
	const dismiss = useCallback( () => dismissAlert( ALERT_KEY ), [ dismissAlert ] );
	const [ hadGoodRating, setHadGoodRating ] = useState( false );

	useEffect( () => {
		if ( getIndicatorForScore( overallScore )?.className === "good" ) {
			setHadGoodRating( true );
		}
	}, [ overallScore ] );

	return {
		shouldShow: ! isPremium && ! isDismissed && hadGoodRating,
		dismiss,
	};
};
