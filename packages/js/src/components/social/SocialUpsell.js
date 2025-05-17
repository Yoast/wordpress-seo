/* global wpseoAdminL10n */
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { noop } from "lodash";
import { FeatureUpsell, Label, Root, useRootContext } from "@yoast/ui-library";
import styled from "styled-components";
import { addQueryArgs } from "@wordpress/url";
import { FacebookPreview } from "../../../../social-metadata-previews/src";

const FeatureUpsellContainer = styled.div`
	max-width: calc(527px + 1.5rem);
`;

/**
 *
 * @param {Object} props The properties passed to this component.
 * @param {string} props.socialMediumName The social medium platform.
 *
 * @returns {wp.Element} The FacebookView Component.
 */
const SocialUpsell = ( props ) => {
	const premiumUpsellConfig = {
		"data-action": "load-nfd-ctb",
		"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
	};

	const labelText = props.socialMediumName === "X"
		? __( "X share preview", "wordpress-seo" )
		: __( "Social share preview", "wordpress-seo" );

	const { locationContext } = useRootContext();

	return (
		<Root>
			<FeatureUpsellContainer>
				<FeatureUpsell
					shouldUpsell={ true }
					variant="card"
					cardLink={ addQueryArgs(
						wpseoAdminL10n[ "shortlinks.upsell.social_preview." + props.socialMediumName.toLowerCase() ],
						{ context: locationContext } ) }
					cardText={ sprintf(
						/* translators: %1$s expands to Yoast SEO Premium. */
						__( "Unlock with %1$s", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
					{ ...premiumUpsellConfig }
				>
					<div className={ "yst-grayscale yst-opacity-50" }>
						<Label>
							{ labelText }
						</Label>

						<FacebookPreview
							title={ "" }
							description={ "" }
							siteUrl={ "" }
							imageUrl={ "" }
							imageFallbackUrl={ "" }
							alt={ "" }
							onSelect={ noop }
							onImageClick={ noop }
							onMouseHover={ noop }
						/>
					</div>
				</FeatureUpsell>
			</FeatureUpsellContainer>
		</Root>
	);
};

SocialUpsell.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Social", "Twitter", "X" ] ).isRequired,
};

export default SocialUpsell;
