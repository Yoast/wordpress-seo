// import { useWooBlockProps } from "@woocommerce/block-templates";
import { useBlockProps } from "@wordpress/block-editor";
import { Slot } from "@wordpress/components";
// import { useEntityProp } from "@wordpress/core-data";
import { LocationProvider, Root } from "@yoast/externals/contexts";
import sortComponentsByRenderPriority from "../../../helpers/sortComponentsByRenderPriority";
import { SLOTS } from "../../constants";

const ROOT_CONTEXT = { locationContext: "product-seo" };

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @returns {JSX.Element} The element.
 */
export const Edit = ( { attributes, context: { postType } } ) => {
	/**
	 * React hook that is used to mark the block wrapper element.
	 * It provides all the necessary props like the class name.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
	 */
	//	const blockProps = useWooBlockProps();
	const blockProps = useBlockProps();

	//	const validation = useValidation( "testing", async function validate( ...args ) {
	//		console.error( "validating!", ...args );
	//		return false;// "TEST ERROR";
	//	} );

	// The "context.postType" is there because of the usesContext in the block.json.
	console.log( { attributes, postType, blockProps } );

	//	const postType = useContext( PostTypeContext );
	//	const [ id ] = useEntityProp( "postType", postType, "id" );
	//	const [ sku ] = useEntityProp( "postType", postType, "sku" );
	//	// This has an internal check to also get/set meta_data.
	//	const [ sku2 ] = useProductEntityProp( "sku", { postType, fallbackValue: "" } );

	// Editor data:
	//	const { editedRecord } = useEntityRecord( "postType", postType, id );
	//	const [ content ] = useEntityProp( "postType", postType, "description" );
	//	const [ title ] = useEntityProp( "postType", postType, "name" );
	//	const [ excerptOnly ] = useEntityProp( "postType", postType, "short_description" );
	//	// Excerpt: get from the content when excerptOnly is empty.
	//	// Maybe some more logic needed here for the decodeURI and auto-draft slug?
	//	const [ slug ] = useEntityProp( "postType", postType, "slug" );
	//	const [ generatedSlug ] = useEntityProp( "postType", postType, "generated_slug" );
	//	const [ images ] = useEntityProp( "postType", postType, "images" );
	//	const snippetPreviewImageUrl = images?.[ 0 ]?.src || null;
	// Content image: get from the content.
	// Base url: there is a permalink_template in the record. WC has a getPermalinkParts selector, but doesn't seem to work?
	//	const PERMALINK_PRODUCT_REGEX = /%(?:postname|pagename)%/;
	//	const postName = product.slug || product.generated_slug;
	//	const [ prefix, suffix ] = product.permalink_template.split( PERMALINK_PRODUCT_REGEX );

	//	const [ metaFocusKeyphrase, setMetaFocusKeyphrase ] = useProductEntityProp( "meta_data._yoast_wpseo_focuskw", { postType, fallbackValue: ""
	// } );

	// NOTE: the block.json NEEDS to have an attribute or this will not be interactive.
	return <div { ...blockProps }>
		<LocationProvider value="sidebar">
			<Root context={ ROOT_CONTEXT }>
				<Slot name={ SLOTS.seo }>
					{ ( fills ) => sortComponentsByRenderPriority( fills ) }
				</Slot>
			</Root>
		</LocationProvider>
	</div>;
};
