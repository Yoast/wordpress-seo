<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Shared base for the abilities that read and update the site representation settings: whether the site represents
 * an organization or a person, along with their name, logo and social profiles.
 */
abstract class Abstract_Site_Representation_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The site representation field map.
	 *
	 * @var Site_Representation_Field_Map
	 */
	protected $field_map;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper             $capability_helper The capability helper.
	 * @param Site_Representation_Field_Map $field_map         The site representation field map.
	 */
	public function __construct( Capability_Helper $capability_helper, Site_Representation_Field_Map $field_map ) {
		$this->capability_helper = $capability_helper;
		$this->field_map         = $field_map;
	}

	/**
	 * Returns whether the ability is available.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return true;
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * Gates the ability behind the same capability that gates the settings page where the site
	 * representation is set.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema of each site representation setting.
	 *
	 * @return array<string, array<string, mixed>> The output schema of each setting, keyed by option name.
	 */
	protected function get_settings_output_schema(): array {
		return \array_map( [ $this, 'to_output_schema' ], $this->field_map->get_fields() );
	}

	/**
	 * Reduces a field's input schema to its output schema: the input constraints (like the minimum of
	 * an ID) would only make the output validation fail on values that were saved before.
	 *
	 * @param array<string, mixed> $schema The input schema of the field.
	 *
	 * @return array<string, mixed> The output schema of the field.
	 */
	private function to_output_schema( array $schema ): array {
		return \array_intersect_key( $schema, \array_flip( [ 'type', 'description' ] ) );
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
