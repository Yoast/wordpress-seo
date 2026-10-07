import ArrowNarrowRightIcon from "@heroicons/react/solid/ArrowNarrowRightIcon";
import { createInterpolateElement, useCallback, useEffect, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Popover, useSvgAria } from "@yoast/ui-library";
import { ReactComponent as YoastIcon } from "../../../../images/Yoast_icon_kader.svg";

/**
 * Keeps Tab focus within a container.
 *
 * @param {KeyboardEvent} event The Tab keydown event; its `currentTarget` is the container to trap focus inside.
 *
 * @returns {void}
 */
const trapTab = ( event ) => {
	const focusable = [ ...event.currentTarget.querySelectorAll(
		"button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
	) ].filter( ( element ) => ! element.disabled );
	if ( focusable.length === 0 ) {
		return;
	}
	const edge = event.shiftKey ? focusable[ 0 ] : focusable[ focusable.length - 1 ];
	if ( document.activeElement === edge ) {
		event.preventDefault();
		( event.shiftKey ? focusable[ focusable.length - 1 ] : focusable[ 0 ] ).focus();
	}
};

/**
 * A single step of the bulk editor guided tour, rendered as a ui-library Popover anchored to a target element.
 *
 * The card carries the step copy plus the tour navigation (progress, Back, Next/finish). Dismissing the popover ends the whole tour via `onSkip`.
 *
 * @param {Object}          props             The component props.
 * @param {string}          props.id          The unique popover id; also derives the title and content ids.
 * @param {string}          props.title       The step title.
 * @param {React.ReactNode} props.content     The step body copy.
 * @param {number}          props.currentStep The 1-based index of this step.
 * @param {number}          props.totalSteps  The total number of steps.
 * @param {boolean}         props.isLastStep  Whether this is the final step (shows "Got it!" instead of "Next").
 * @param {Function}        props.onNext      Advances to the next step, or finishes on the last step.
 * @param {Function}        [props.onBack]    Goes back a step; omitted on the first step.
 * @param {Function}        props.onSkip      Ends the tour without finishing (close button / backdrop / Escape).
 * @param {string}          [props.position]  The popover position relative to its anchor.
 * @param {string}          [props.className] Optional extra className for the popover.
 *
 * @returns {JSX.Element} The tour step card.
 */
export const TourCard = ( {
	id,
	title,
	content,
	currentStep,
	totalSteps,
	isLastStep,
	onNext,
	onBack = null,
	onSkip,
	position = "right",
	className = "",
} ) => {
	const svgAriaProps = useSvgAria();
	const nextButtonRef = useRef( null );

	// Move focus to the primary action each time the step changes, so keyboard and screen reader users follow along.
	useEffect( () => {
		const timeout = setTimeout( () => nextButtonRef.current?.focus(), 300 );
		return () => clearTimeout( timeout );
	}, [ currentStep ] );

	// The close button and Escape both resolve to hiding the popover, which ends the tour.
	const handleVisibilityChange = useCallback( ( isVisible ) => ! isVisible && onSkip(), [ onSkip ] );

	// The tour blocks the page, so the card behaves as a modal dialog: Escape closes it, and Tab is trapped within its
	// controls, keeping keyboard users out of the page elements behind it.
	const handleKeyDown = useCallback( ( event ) => {
		if ( event.key === "Escape" ) {
			event.preventDefault();
			onSkip();
		} else if ( event.key === "Tab" ) {
			trapTab( event );
		}
	}, [ onSkip ] );

	return <Popover
		id={ id }
		hasBackdrop={ false }
		role="dialog"
		aria-labelledby={ `${ id }-title` }
		aria-describedby={ `${ id }-content` }
		isVisible={ true }
		setIsVisible={ handleVisibilityChange }
		position={ position }
		className={ `yst-bulk-editor-tour-card ${ className }`.trim() }
		onKeyDown={ handleKeyDown }
	>
		<>
			<div className="yst-flex yst-gap-3 yst-items-center">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-grow">
					<Popover.Title id={ `${ id }-title` } as="h3" style={ { textAlign: "start" } }>
						{ sprintf(
							/* translators: %1$d is the step number, %2$s is the step title. */
							__( "Step %1$d: %2$s", "wordpress-seo" ),
							currentStep,
							title
						) }
					</Popover.Title>
				</div>
				<Popover.CloseButton screenReaderLabel={ __( "Close the tour", "wordpress-seo" ) } />
			</div>
			<Popover.Content id={ `${ id }-content` } className="yst-font-normal yst-ms-8 yst-me-5 yst-mt-1" style={ { textAlign: "start" } }>
				{ content }
			</Popover.Content>
			<div className="yst-flex yst-gap-3 yst-justify-between yst-items-center yst-mt-3">
				<span className="yst-ms-8 yst-text-slate-500">
					<span dir="ltr">
						{ createInterpolateElement(
							sprintf(
								/* translators: %1$s is the current step number, %2$s is the total number of steps. */
								__( "<current>%1$s</current> / %2$s", "wordpress-seo" ),
								currentStep,
								totalSteps
							),
							{ current: <span className="yst-font-medium yst-text-slate-600" /> }
						) }
					</span>
				</span>
				<div className="yst-flex yst-gap-3 yst-items-center">
					{ onBack && <Button size="small" variant="tertiary" onClick={ onBack }>
						{ __( "Back", "wordpress-seo" ) }
					</Button> }
					<Button size="small" ref={ nextButtonRef } variant="primary" onClick={ onNext } className="yst-flex yst-gap-1">
						{ isLastStep
							? __( "Got it!", "wordpress-seo" )
							: <>
								{ __( "Next", "wordpress-seo" ) }
								<ArrowNarrowRightIcon className="yst-h-4 yst-w-4 rtl:yst-rotate-180" { ...svgAriaProps } />
							</> }
					</Button>
				</div>
			</div>
		</>
	</Popover>;
};
