import { PlusIcon } from "@heroicons/react/outline";
import { createBlock } from "@wordpress/blocks";
import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * AddBlockButton component to render the 'add block' button.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.showUpsellBadge Whether to show the upsell badge.
 * @param {string} props.blockName The name of the block to insert.
 * @param {boolean} props.showTooltip Whether to show the tooltip.
 * @returns {JSX.Element} The AddBlockButton component.
 */
export const AddBlockButton = ( { showUpsellBadge, blockName, showTooltip } ) => {
	const { insertBlock } = useDispatch( "core/block-editor" );

	const handleButtonClick = useCallback( () => {
		if ( showUpsellBadge ) {
			// Open the upsell modal.
		} else {
			const block = createBlock( `${ blockName }` );
			insertBlock( block );
		}
	}, [ showUpsellBadge, blockName ] );

	const buttonClass = "yst-box-border yst-flex yst-flex-row yst-justify-center yst-items-center yst-p-1.5 yst-gap-1.5 yst-w-7 yst-h-7 " +
		"yst-bg-white yst-border yst-border-solid yst-border-slate-300 yst-shadow-sm yst-rounded-md hover:yst-bg-slate-50";

	const ariaLabel = showTooltip
		? __( "Add block to content.", "wordpress-seo" )
		: __( "Add block", "wordpress-seo" );

	return (
		<button
			className={ `${ buttonClass }${ showTooltip ? " yoast-tooltip yoast-tooltip-w" : "" }` }
			aria-label={ ariaLabel }
			onClick={ handleButtonClick }
		>
			<PlusIcon className="yst-h-4 yst-w-4" />
		</button>
	);
};

AddBlockButton.propTypes = {
	showUpsellBadge: PropTypes.bool.isRequired,
	blockName: PropTypes.string.isRequired,
	showTooltip: PropTypes.bool.isRequired,
};
