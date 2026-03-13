/* eslint-disable complexity */
import { NextPostButton } from "./next-post-button";
import { NextPostApproveModal } from "./next-post-approve-modal";
import { __ } from "@wordpress/i18n";
import { useToggleState } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";

/**
 * The section for the next post feature in the Yoast sidebar.
 *
 * @param {string} location The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @returns {JSX.Element} The Next Post section in the sidebar.
 */
export const NextPostEditorItem = ( { location } ) => {
	const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );
	const isPremium = useSelect( select => select( "yoast-seo/editor" ).getIsPremium() );
	const blocks  = useSelect( select => select( "core/block-editor" ).getBlocks(), [] );

	const isFirstBlockEmptyParagraph = blocks.length === 1 &&
		blocks[ 0 ]?.name === "core/paragraph" &&
		! blocks[ 0 ]?.attributes?.content?.trim();

	const isBannerPresent = blocks.some( b => b.name === "yoast-seo/next-post-inline-banner" );

	// The canvas is empty when there are no blocks, exactly one block that is
	// an empty core/paragraph (the default new-post state), or a banner is present.
	const isEmptyCanvas = blocks.length === 0 || isFirstBlockEmptyParagraph || isBannerPresent;

	return <div className="yst-p-4">
		<p className="yst-text-slate-600 yst-mn-3">
			{ __( "Optimize your content’s SEO or start with new content suggestions.", "wordpress-seo" ) }
		</p>
		<NextPostButton onClick={ openModal } className={ location === "sidebar" ? "yst-w-full" : "" } />
		<NextPostApproveModal
			isOpen={ isModalOpen }
			onClose={ closeModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			isUpsell={ false }
		/>
	</div>;
};
