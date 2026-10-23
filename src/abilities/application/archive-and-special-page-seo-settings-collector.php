<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that collects the SEO data of the homepage, the archives and the special pages.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Archive_And_Special_Page_SEO_Settings_Collector {

	use Schema_Type_Cast_Trait;

	/**
	 * The global setting field map.
	 *
	 * @var Global_Setting_Field_Map
	 */
	private $field_map;

	/**
	 * The global setting target repository.
	 *
	 * @var Global_Setting_Target_Repository
	 */
	private $target_repository;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Global_Setting_Field_Map         $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository $target_repository The global setting target repository.
	 * @param Options_Helper                   $options_helper    The options helper.
	 */
	public function __construct(
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository,
		Options_Helper $options_helper
	) {
		$this->field_map         = $field_map;
		$this->target_repository = $target_repository;
		$this->options_helper    = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Returns the global settings of all targets whose global settings exists on the site.
	 *
	 * @return array<array<string, mixed>> The global settings of each target.
	 */
	public function get_all(): array {
		return \array_map( [ $this, 'get_target_settings' ], $this->target_repository->get_all() );
	}

	/**
	 * Returns the global settings of a target: what identifies it like the update ability expects it, the
	 * current value of each field it has, and what agents need to know to change them.
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
