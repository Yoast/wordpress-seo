<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that collects the site representation settings.
 *
 * The settings are returned as stored, which is also what the schema on the site is built from, so they can be
 * passed back to the update ability as they are.
 *
 * @internal Backs the site representation abilities. Not meant to be used outside of Yoast SEO, so it can change
 *           at any time without notice.
 */
class Site_Representation_Collector {

	use Schema_Type_Cast_Trait;

	/**
	 * The site representation field map.
	 *
	 * @var Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Site_Representation_Field_Map $field_map      The site representation field map.
	 * @param Options_Helper                $options_helper The options helper.
	 */
	public function __construct( Site_Representation_Field_Map $field_map, Options_Helper $options_helper ) {
		$this->field_map      = $field_map;
		$this->options_helper = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Returns the current value of each site representation setting, cast to the type its schema declares.
	 *
	 * @return array<string, mixed> The site representation settings, keyed by option name.
	 */
	public function get(): array {
		$settings = [];

		foreach ( $this->field_map->get_fields() as $field_name => $schema ) {
			$settings[ $field_name ] = $this->cast_to_schema_type( $this->options_helper->get( $field_name ), $schema );
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
