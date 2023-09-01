/* global wpseoAdminL10n */
import {Fragment} from "@wordpress/element";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { SimulatedLabel } from "@yoast/components";
import { FacebookPreview } from "@yoast/social-metadata-previews";
import {get, noop} from "lodash";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Button, Root } from "@yoast/ui-library";
import styled from "styled-components";

const UpsellContainer = styled.div`
	position: relative;
`;

/**
 *
 * @param {Object} props The properties passed to this component.
 * @param {string} props.socialMediumName The social medium platform.
 *
 * @returns {wp.Element} The FacebookView Component.
 */
const SocialUpsell = ( props ) => {
	const woocommerceUpsellLink = get( window, "wpseoScriptData.metabox.woocommerceUpsellGooglePreviewLink", "" );

	const premiumUpsellConfig = {
		'data-action': "load-nfd-ctb",
		'data-ctb-id': "f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
	};

	return (
		<Root>
			<SimulatedLabel>
				{ __( "Social share preview", "wordpress-seo" ) }
			</SimulatedLabel>
			<UpsellContainer>
				<FacebookPreview
					title={ '' }
					description={ '' }
					siteUrl={ '' }
					imageUrl={ '' }
					imageFallbackUrl={ '' }
					alt={ '' }
					onSelect={ noop }
					onImageClick={ noop }
					onMouseHover={ noop }
				/>
				<div className="yst-absolute yst-inset-0 yst-flex yst-items-center yst-justify-center">
					<Button
						href={ woocommerceUpsellLink }
						as="a"
						className="yst-gap-2 yst-mb-5 yst-mt-2"
						variant="upsell"
						target="_blank"
						rel="noopener"
					>
						<LockOpenIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-shrink-0" />
						{ sprintf(
							/* translators: %1$s expands to Yoast WooCommerce SEO. */
							__( "Unlock with %1$s", "wordpress-seo" ),
							"Yoast SEO Premium"
						) }
					</Button>
				</div>
			</UpsellContainer>
		</Root>
	);
};

SocialUpsell.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
};

export default SocialUpsell;
