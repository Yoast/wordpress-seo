import { PlusIcon } from "@heroicons/react/outline";
import { createBlock } from "@wordpress/blocks";
import { useDispatch } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * AddBlockButton component to render the 'add block' button.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.showUpsellBadge Whether to show the upsell badge.
 * @param {string} props.blockName The name of the block to insert.
 * @returns {JSX.Element} The AddBlockButton component.
 */
export const AddBlockButton = ( { showUpsellBadge, blockName } ) => {
	const { insertBlock } = useDispatch( "core/block-editor" );
	const [ isClicked, setIsClicked ] = useState( false );
	const [ showTooltip, setShowTooltip ] = useState( false );

	const handleButtonClick = useCallback( () => {
		if ( showUpsellBadge ) {
			// We don't want to show the clicked state when the upsell modal is opened.
			// Open the upsell modal.
		} else {
			setIsClicked( true );

			setTimeout( () => {
				const block = createBlock( blockName );
				insertBlock( block );
				setIsClicked( false );
			}, 300 );
		}
	}, [ showUpsellBadge, blockName, insertBlock ] );

	const handleMouseEnter = useCallback( () => {
		setShowTooltip( true );
	}, [] );

	const handleMouseLeave = useCallback( () => {
		setShowTooltip( false );
	}, [] );


	const baseButtonClass = "yst-box-border yst-flex yst-flex-row yst-p-1.5 yst-w-7 yst-h-7 " +
		"yst-border yst-border-solid yst-border-slate-300 yst-shadow-sm yst-rounded-md";
	// The background color for the clicked state is the same color as the highlighting button when is clicked.
	const backgroundClass = isClicked ? "yst-bg-primary-500" : "yst-bg-white";
	// The check for `! isClicked` is to prevent `hover:yst-bg-slate-50` to override `yst-bg-primary-500` when the button is clicked.
	// This is because the `hover` class has higher specificity than the normal class.
	const tooltipClass = showTooltip && ! isClicked ? "hover:yst-bg-slate-50 yoast-tooltip yoast-tooltip-w" : "";
	const buttonClass = `${baseButtonClass} ${backgroundClass} ${tooltipClass}`;
	const plusIconClass = isClicked ? "yst-h-4 yst-w-4 yst-stroke-white" : "yst-h-4 yst-w-4";

	const ariaLabel = showTooltip
		? __( "Add block to content.", "wordpress-seo" )
		: __( "Add block", "wordpress-seo" );

	return (
		<button
			className={ buttonClass }
			aria-label={ ariaLabel }
			onClick={ handleButtonClick }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<PlusIcon className={ plusIconClass } />
		</button>
	);
};

AddBlockButton.propTypes = {
	showUpsellBadge: PropTypes.bool.isRequired,
	blockName: PropTypes.string.isRequired,
};
