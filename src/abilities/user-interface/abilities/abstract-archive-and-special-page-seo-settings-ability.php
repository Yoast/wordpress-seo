<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Shared base for the abilities that read and update the SEO data of the homepage, the archives and the special
 * pages.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Archive_And_Special_Page_SEO_Settings_Ability implements Ability_Interface {

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
	 * The global setting target repository.
	 *
	 * @var Global_Setting_Target_Repository
	 */
	protected $target_repository;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map         $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository $target_repository The global setting target repository.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository
	) {
		$this->capability_helper = $capability_helper;
		$this->field_map         = $field_map;
		$this->target_repository = $target_repository;
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
	 * Gates the ability behind the same capability that gates the settings page where the templates are set.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema of the global settings of a single target.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_target_output_schema(): array {
		return [
			'type'       => 'object',
			'properties' => \array_merge(
				[
					'target'    => [
						'type'        => 'string',
						'enum'        => $this->target_repository->get_names(),
						'description' => \__( 'The pages these settings belong to.', 'wordpress-seo' ),
					],
					'post_type' => [
						'type'        => 'string',
						'description' => \sprintf(
							/* translators: %s expands to the name of a target. */
							\__( 'Only present for the %s target: the post type of the content type.', 'wordpress-seo' ),
							Post_Type_Archive_Target::NAME,
						),
					],
					'label'     => [
						'type'        => 'string',
						'description' => \sprintf(
							/* translators: %s expands to the name of a target. */
							\__( 'Only present for the %s target: the name of the content type.', 'wordpress-seo' ),
							Post_Type_Archive_Target::NAME,
						),
					],
				],
				\array_map( [ $this, 'to_output_schema' ], $this->field_map->get_fields() ),
				[
					'enabled' => [
						'type'        => 'boolean',
						'description' => \__( 'Whether these pages are in use on the site. Read-only: it can only be changed in the Yoast SEO settings. The settings of disabled pages can still be changed, but have no effect until they are enabled.', 'wordpress-seo' ),
					],
					'shared'  => [
						'type'        => 'boolean',
						'description' => \__( 'Whether these settings are shared by many pages, like all author archives. Shared settings apply to every one of those pages, so their templates must not contain text about one specific page; use snippet variables for what differs between them.', 'wordpress-seo' ),
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
