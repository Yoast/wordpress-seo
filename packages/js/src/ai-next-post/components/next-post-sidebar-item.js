import { NextPostButton } from "./next-post-button";
import { NextPostApproveModal } from "./next-post-approve-modal";
import { __ } from "@wordpress/i18n";
import { useToggleState } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";

/**
 * The section for the next post feature in the Yoast sidebar.
 *
 * @returns {JSX.Element} The Next Post section in the sidebar.
 */
export const NextPostSidebarItem = () => {
	const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );
	const isPremium = useSelect( select => select( "yoast-seo/editor" ).getIsPremium() );

	return <div className="yst-p-4">
		<p className="yst-text-slate-600 yst-mn-3">
			{ __( "Optimize your content’s SEO or start with new content suggestions.", "wordpress-seo" ) }
		</p>
		<NextPostButton onClick={ openModal } className="yst-w-full" />
		<NextPostApproveModal
			isOpen={ isModalOpen }
			onClose={ closeModal }
			isEmptyCanvas={ true }
			isPremium={ isPremium }
			isUpsell={ ! isPremium }
		/>
	</div>;
};
