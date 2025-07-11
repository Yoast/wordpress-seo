import { __ } from "@wordpress/i18n";
import { Popover, usePopoverContext, useSvgAria, Button, useToggleState } from "@yoast/ui-library";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { useRef, useEffect } from "@wordpress/element";

/**
 * A button component that dismisses the popover when clicked.
 * On mount, it automatically focuses and scrolls itself into view for better accessibility.
 *
 * @returns {JSX.Element} The dismiss button element.
 */
const DismissButton = () => {
	const { handleDismiss } = usePopoverContext();
	const dismissButtonText = __( "Got it!", "wordpress-seo-premium" );
	const dismissButtonRef = useRef( null );

	// useEffect to focus and scroll to the popover dismiss button
	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( dismissButtonRef.current ) {
				dismissButtonRef.current.focus();
				dismissButtonRef.current.scrollIntoView( { behavior: "smooth", block: "center" } );
			}
		}, 300 );

		return () => clearTimeout( timeout );
	}, [] );

	return <Button
		ref={ dismissButtonRef }
		type="button" variant="primary"
		onClick={ handleDismiss }
		className="yst-self-end"
	>
		{ dismissButtonText }
	</Button>;
};


/**
 * The LLM txt popover component for the opt in.
 * @returns {JSX.Element} The LLM txt popover element.
 */
export const LlmTxtPopover = () => {
	const svgAriaProps = useSvgAria();
	const [ isPopoverVisible, toggleIsPopoverVisible ] = useToggleState( true );

	return <Popover
		id="llm-txt-popover"
		hasBackdrop={ true }
		role="dialog"
		isVisible={ isPopoverVisible }
		setIsVisible={ toggleIsPopoverVisible }
		position="right"
		className="yst-top-3"
	>
		<>
			<div className="yst-flex yst-gap-3">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-1">
					<Popover.Title
						id="llmt-txt-popover-title"
						as="h3"
					>
						{ __( "Enable the llms.txt feature", "wordpress-seo" ) }
					</Popover.Title>
					<Popover.Content
						id="llmt-txt-popover-content"
						className="yst-font-normal"
					>
						{ __( "Automatically generate an llms.txt file that points LLMs to your site's most relevant content. We also gave you editor access.", "wordpress-seo" ) }
					</Popover.Content>
				</div>
			</div>
			<Popover.CloseButton dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) } />
			<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
				<DismissButton />
			</div>
		</>
	</Popover>;
};
