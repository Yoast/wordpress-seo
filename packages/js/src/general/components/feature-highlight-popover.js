import { __ } from "@wordpress/i18n";
import { useRef, useEffect } from "@wordpress/element";
import { Popover, usePopoverContext, useSvgAria, Button } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";

/**
 * A button that dismisses the popover when clicked.
 * On mount it focuses and scrolls itself into view, so keyboard and screen reader users land on it.
 *
 * @param {Object} props The component props.
 * @param {string} props.label The button label.
 *
 * @returns {JSX.Element} The dismiss button element.
 */
const DismissButton = ( { label } ) => {
	const { handleDismiss } = usePopoverContext();
	const dismissButtonRef = useRef( null );

	useEffect( () => {
		// Wait for the popover to settle before moving focus and scrolling it into view.
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
		type="button"
		variant="primary"
		onClick={ handleDismiss }
		className="yst-self-end"
	>
		{ label }
	</Button>;
};

DismissButton.propTypes = {
	label: PropTypes.string.isRequired,
};

/**
 * A reusable popover that draws attention to a feature behind a backdrop.
 * The consumer owns visibility and supplies the copy, so it can highlight any feature.
 *
 * @param {Object} props The component props.
 * @param {string} props.id The unique popover id; also used to derive the title and content ids.
 * @param {string} props.title The popover title.
 * @param {React.ReactNode} props.content The popover content.
 * @param {boolean} props.isVisible Whether the popover is visible.
 * @param {Function} props.setIsVisible Setter for the visibility, wired to the backdrop and close button.
 * @param {boolean} [props.hasBackdrop] Whether to render the full-screen backdrop. Defaults to false; the consumer dims via CSS.
 * @param {string} [props.position] The popover position relative to its anchor.
 * @param {string} [props.className] Optional extra className for the popover.
 * @param {string} [props.dismissLabel] The label of the primary dismiss button.
 * @param {string} [props.closeLabel] The screen reader label of the close button.
 *
 * @returns {JSX.Element} The feature highlight popover element.
 */
export const FeatureHighlightPopover = ( {
	id,
	title,
	content,
	isVisible,
	setIsVisible,
	hasBackdrop = false,
	position = "right",
	className = "",
	dismissLabel = __( "Got it!", "wordpress-seo" ),
	closeLabel = __( "Dismiss", "wordpress-seo" ),
} ) => {
	const svgAriaProps = useSvgAria();

	return <Popover
		id={ id }
		hasBackdrop={ hasBackdrop }
		role="dialog"
		aria-labelledby={ `${ id }-title` }
		aria-describedby={ `${ id }-content` }
		isVisible={ isVisible }
		setIsVisible={ setIsVisible }
		position={ position }
		className={ className }
	>
		<>
			<div className="yst-flex yst-gap-3 yst-items-center">
				<div className="yst-flex-shrink-0">
					<YoastIcon className="yst-w-5 yst-h-5 yst-fill-primary-500" { ...svgAriaProps } />
				</div>
				<div className="yst-flex-grow">
					<Popover.Title id={ `${ id }-title` } as="h3">
						{ title }
					</Popover.Title>
				</div>
				<Popover.CloseButton screenReaderLabel={ closeLabel } />
			</div>
			<Popover.Content
				id={ `${ id }-content` }
				className="yst-font-normal yst-ms-8 yst-me-5 yst-mt-1"
			>
				{ content }
			</Popover.Content>
			<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
				<DismissButton label={ dismissLabel } />
			</div>
		</>
	</Popover>;
};

FeatureHighlightPopover.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
	hasBackdrop: PropTypes.bool,
	position: PropTypes.string,
	className: PropTypes.string,
	dismissLabel: PropTypes.string,
	closeLabel: PropTypes.string,
};
