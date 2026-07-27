import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { STORE_NAME, TOUR_OPT_IN_KEY } from "../../constants";
import { TourCard } from "./tour-card";
import { getTourSteps } from "./tour-steps";
import { useTourAnchor } from "./use-tour-anchor";

// The id linking the overlay's rectangle to its cut-out mask. Only one tour is active at a time, so a constant is safe.
const SPOTLIGHT_MASK_ID = "yoast-bulk-editor-tour-spotlight-mask";

/**
 * The first-time guided tour for the bulk editor.
 *
 * Walks a new user through the page's key areas with an anchored card per step. It auto-starts once per user
 * (gated on the `bulk_editor_tour` opt-in flag) and, on finish or dismiss, marks the flag seen so it never
 * returns. The final step points at the generate actions, which only exists with a selection, so the tour selects
 * rows for that step and clears them again when it ends.
 *
 * @param {Object}   props               The props.
 * @param {Function} props.onSelectAll   Selects the editable rows (the page's real select-all handler).
 * @param {Function} props.onDeselectAll Clears the selection.
 * @param {boolean}  props.hasSelection  Whether any rows are currently selected.
 *
 * @returns {JSX.Element|null} The active tour step, or nothing when the tour is done or unavailable.
 */
export const BulkEditorTour = ( { onSelectAll, onDeselectAll, hasSelection } ) => {
	const { isSeen, isAiEnabled } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			isSeen: store.selectIsOptInNotificationSeen( TOUR_OPT_IN_KEY ),
			isAiEnabled: store.selectPreference( "isAiEnabled", false ),
		};
	}, [] );
	const { setOptInNotificationSeen } = useDispatch( STORE_NAME );

	// The generate step's target only exists when AI is enabled, so drop it otherwise.
	const steps = useMemo(
		() => getTourSteps().filter( ( tourStep ) => ! tourStep.requiresSelection || isAiEnabled ),
		[ isAiEnabled ]
	);

	const [ stepIndex, setStepIndex ] = useState( 0 );
	const [ isDismissed, setIsDismissed ] = useState( false );
	// Whether the tour created the selection itself, so it can undo it without clearing a selection the user made.
	const didAutoSelect = useRef( false );

	const isActive = ! isSeen && ! isDismissed;
	const step = steps[ stepIndex ];
	const isLastStep = stepIndex === steps.length - 1;

	useEffect( () => {
		if ( isActive && step.requiresSelection && ! hasSelection ) {
			didAutoSelect.current = true;
			onSelectAll();
		}
	}, [ isActive, step, hasSelection, onSelectAll ] );

	const { spotlight } = useTourAnchor( `[data-tour-id="${ step.tourId }"]`, isActive, {
		endSelector: step.highlightEndSelector,
		perChild: step.highlightChildren,
	} );

	const finish = useCallback( () => {
		if ( didAutoSelect.current ) {
			onDeselectAll();
			didAutoSelect.current = false;
		}
		setIsDismissed( true );
		setOptInNotificationSeen( TOUR_OPT_IN_KEY );
	}, [ onDeselectAll, setOptInNotificationSeen ] );

	const onNext = useCallback( () => {
		// finish() dispatches store updates, so it runs from the event handler, not inside a state updater.
		if ( isLastStep ) {
			finish();
			return;
		}
		setStepIndex( ( index ) => index + 1 );
	}, [ isLastStep, finish ] );

	const onBack = useCallback( () => setStepIndex( ( index ) => Math.max( 0, index - 1 ) ), [] );

	if ( ! isActive || ! spotlight ) {
		return null;
	}

	const { rects, bounds, viewport } = spotlight;

	return (
		<>
			<div className="yst-fixed yst-inset-0 yst-z-[100000]" />
			<svg
				className="yst-tour-spotlight yst-fixed yst-inset-0 yst-z-[100000]"
				width={ viewport.width }
				height={ viewport.height }
				aria-hidden="true"
			>
				<defs>
					<mask id={ SPOTLIGHT_MASK_ID } maskUnits="userSpaceOnUse" x="0" y="0" width={ viewport.width } height={ viewport.height }>
						<rect x="0" y="0" width={ viewport.width } height={ viewport.height } fill="#fff" />
						{ rects.map( ( rect, index ) => (
							<rect
								key={ index }
								x={ rect.left }
								y={ rect.top }
								width={ rect.width }
								height={ rect.height }
								rx={ rect.rx }
								fill="#000"
							/>
						) ) }
					</mask>
				</defs>
				<rect
					x="0"
					y="0"
					width={ viewport.width }
					height={ viewport.height }
					fill="#64748b"
					fillOpacity="0.75"
					mask={ `url(#${ SPOTLIGHT_MASK_ID })` }
				/>
			</svg>
			<div className="yst-fixed yst-z-[100000]" style={ bounds }>
				<TourCard
					id={ step.id }
					title={ step.title }
					content={ step.content }
					position={ step.position }
					currentStep={ stepIndex + 1 }
					totalSteps={ steps.length }
					isLastStep={ isLastStep }
					onNext={ onNext }
					onBack={ stepIndex > 0 ? onBack : null }
					onSkip={ finish }
				/>
			</div>
		</>
	);
};
