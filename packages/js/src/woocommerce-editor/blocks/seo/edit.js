import { useWooBlockProps } from "@woocommerce/block-templates";
import { LocationProvider, Root } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import { SeoSlot } from "../../components/seo-slot-fill";

/**
 * Represent the Yoast SEO block in the editor.
 *
 * @param {Object} attributes The block attributes.
 * @param {Object} context The block context. Contains the post type.
 *
 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/
 *
 * @returns {JSX.Element} The element.
 */
export const Edit = ( { attributes, context: { postType } } ) => {
	/**
	 * Provides all the necessary block props like the class name.
	 *
	 * Note: the `block.json` NEEDS to have an attribute or this will not be interactive.
	 *
	 * @link https://github.com/woocommerce/woocommerce/blob/trunk/packages/js/block-templates/src/hooks/use-woo-block-props/use-woo-block-props.ts
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
	 */
	const blockProps = useWooBlockProps( attributes );

	return <div { ...blockProps }>
		<LocationProvider value="sidebar">
			<Root context={ { locationContext: "product-seo", postType } }>
				<SeoSlot />
			</Root>
		</LocationProvider>
	</div>;
};

Edit.propTypes = {
	attributes: PropTypes.object.isRequired,
	context: PropTypes.object.isRequired,
};
