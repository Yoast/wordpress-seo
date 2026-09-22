<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;

/**
 * Base class for the abilities that enable or disable a feature that serves a resource at a URL.
 *
 * On top of the status, the output carries the URL of that resource under a `url` attribute, so that whoever enables the
 * feature learns where to find it without guessing.
 */
abstract class Abstract_Url_Feature_Status_Ability extends Abstract_Set_Feature_Status_Ability {

	/**
	 * Returns the URL at which the resource the feature serves can be reached.
	 *
	 * @return string The URL.
	 */
	abstract protected function get_url(): string;

	/**
	 * Enables or disables the feature and returns its new status, along with the URL of the
	 * resource it serves when it is enabled.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string|null>|WP_Error The new status and URL, or an error when the status could not be saved.
	 */
	public function execute( array $input ) {
		$result = parent::execute( $input );

		if ( $result instanceof WP_Error ) {
			return $result;
		}

		// The URL is only reachable while the feature is enabled, so it is withheld otherwise.
		$result['url'] = ( ( $result['enabled'] === true ) ? $this->get_url() : null );

		return $result;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the JSON schema of the URL attribute.
	 *
	 * @return array<string, array<string, mixed>> The `url` attribute schema.
	 */
	protected function get_additional_output_properties(): array {
		return [
			'url' => [
				'type'        => [ 'string', 'null' ],
				'format'      => 'uri',
				'description' => \sprintf(
					/* translators: %1$s expands to Yoast SEO, %2$s: the name of the feature. */
					\__( 'The URL at which %1$s\'s %2$s is served. null when the feature is disabled.', 'wordpress-seo' ),
					'Yoast SEO',
					$this->get_feature_name(),
				),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
