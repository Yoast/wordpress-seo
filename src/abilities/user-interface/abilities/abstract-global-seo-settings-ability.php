<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Shared base for the abilities that read and update global SEO settings: those of the homepage, the archives and the
 * special pages, and the default settings of the content types.
 */
abstract class Abstract_Global_SEO_Settings_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The global setting field map.
	 *
	 * @var Global_Setting_Field_Map
	 */
	protected $field_map;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper        $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map $field_map         The global setting field map.
	 */
	public function __construct( Capability_Helper $capability_helper, Global_Setting_Field_Map $field_map ) {
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
	 * Gates the ability behind the same capability that gates the settings page where these settings are set.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Turns an unavailable target into the error the ability returns.
	 *
	 * @param Unavailable_Global_Setting_Target_Exception $exception The exception.
	 *
	 * @return WP_Error The error.
	 */
	protected function to_wp_error( Unavailable_Global_Setting_Target_Exception $exception ): WP_Error {
		return new WP_Error( $exception->get_error_code(), $exception->getMessage(), [ 'status' => $exception->getCode() ] );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Builds the output schema of the global settings of a single target: what identifies it, the fields its kind of
	 * target has, and whether it is enabled and shared.
	 *
	 * @param array<string>                       $target_names          The names of the targets of the ability.
	 * @param array<string, array<string, mixed>> $identifier_properties The output schema of what identifies a
	 *                                                                   target, keyed by property name.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function build_target_output_schema( array $target_names, array $identifier_properties ): array {
		return [
			'type'       => 'object',
			'properties' => \array_merge(
				$identifier_properties,
				\array_map( [ $this, 'to_output_schema' ], $this->field_map->get_fields_for_targets( $target_names ) ),
				[
					'enabled' => [
						'type'        => 'boolean',
						'description' => \__( 'Whether these pages are in use on the site. Read-only: it can only be changed in the Yoast SEO settings. The settings of disabled pages can still be changed, but have no effect until they are enabled.', 'wordpress-seo' ),
					],
					'shared'  => [
						'type'        => 'boolean',
						'description' => \__( 'Whether these settings are shared by many pages, like all author archives or all posts of a content type. Shared settings apply to every one of those pages, so their templates must not contain text about one specific page; use snippet variables for what differs between them.', 'wordpress-seo' ),
					],
				],
			),
		];
	}

	/**
	 * Reduces a field's input schema to its output schema: the input constraints would only make the output
	 * validation fail on values that were saved before.
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
