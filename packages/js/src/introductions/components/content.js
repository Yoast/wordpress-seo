import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { GoogleDocsAddonUpsell } from "../../shared-admin/components";
import { STORE_NAME_INTRODUCTIONS } from "../constants";
import { Modal } from "./modal";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * @returns {JSX.Element} The element.
 */
export const Content = () => {
	const learnMoreLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoast.com/products/google-docs-addon/" ), [] );
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "google-docs-addon-thumbnail.png" ), [] );
	const isPremium = useMemo( () => Boolean( get( window, "wpseoIntroductions.isPremium", false ) ), [] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	const buttonLabel = useMemo( () => {
		if ( isPremium ) {
			return __( "Get started for free", "wordpress-seo" );
		}


		return sprintf(
			/* translators: %1$s expands to Yoast SEO Premium. */
			__( "Unlock with %1$s", "wordpress-seo" ),
			"Yoast SEO Premium"
		);
	}
	, [ isPremium ] );

	const buttonLink = useMemo( () => {
		if ( isPremium ) {
			return useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/google-docs-add-on-introduction-get-started/" ), [] );
		}

		return useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/google-docs-add-on-introduction-upsell/" ), [] );
	}, [ isPremium ] );

	return (
		<Modal>
			<GoogleDocsAddonUpsell
				learnMoreLink={ learnMoreLink }
				buttonLink={ buttonLink }
				thumbnail={ thumbnail }
				buttonLabel={ buttonLabel }
				isPremium={ isPremium }
			/>
		</Modal>
	);
};
