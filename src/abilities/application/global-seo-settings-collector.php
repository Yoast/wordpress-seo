<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Collects the global SEO settings of a target.
 */
class Global_SEO_Settings_Collector {

	use Schema_Type_Cast_Trait;

	/**
	 * The global setting field map.
	 *
	 * @var Global_Setting_Field_Map
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
	 * @param Global_Setting_Field_Map $field_map      The global setting field map.
	 * @param Options_Helper           $options_helper The options helper.
	 */
	public function __construct( Global_Setting_Field_Map $field_map, Options_Helper $options_helper ) {
		$this->field_map      = $field_map;
		$this->options_helper = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Returns the global settings of a target: what identifies it, the value of each field it has, and whether it
	 * is enabled and shared.
	 *
	 * @param Global_Setting_Target_Interface $target The target.
	 *
	 * @return array<string, mixed> The global settings of the target.
	 */
	public function get_target_settings( Global_Setting_Target_Interface $target ): array {
		$data = $target->get_identifiers();

		foreach ( $this->field_map->get_fields() as $field_name => $schema ) {
			$option_name = $this->field_map->get_option_name( $field_name, $target );
			if ( $option_name === null ) {
				continue;
			}

			$data[ $field_name ] = $this->cast_to_schema_type( $this->options_helper->get( $option_name ), $schema );
		}

		$data['enabled'] = $target->is_enabled();
		$data['shared']  = $target->is_shared();

		return $data;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
