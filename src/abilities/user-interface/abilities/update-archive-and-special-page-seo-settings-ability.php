<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of the homepage, an archive or a special page.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Update_Archive_And_Special_Page_SEO_Settings_Ability extends Abstract_Archive_And_Special_Page_SEO_Settings_Ability {

	/**
	 * The archive and special page SEO settings updater.
	 *
	 * @var Archive_And_Special_Page_SEO_Settings_Updater
	 */
	private $updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                             $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map                      $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository              $target_repository The global setting target repository.
	 * @param Archive_And_Special_Page_SEO_Settings_Updater $updater           The archive and special page SEO settings updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository,
		Archive_And_Special_Page_SEO_Settings_Updater $updater
	) {
		parent::__construct( $capability_helper, $field_map, $target_repository );

		$this->updater = $updater;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-archive-and-special-page-seo-settings';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Updates the global settings of a target and returns its new state.
	 *
	 * @param array<string, mixed> $input The target, the post type for the archive of a content type, and the fields
	 *                                    to change.
	 *
	 * @return array<string, mixed>|WP_Error The new global settings of the target, or an error.
	 */
	public function execute( array $input ) {
		return $this->updater->update( $input );
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$output_schema                          = $this->get_target_output_schema();
		$output_schema['properties']['warning'] = [
			'type'        => 'string',
			'description' => \__( 'Only present when some of the provided settings were not saved, or when the pages are disabled so the saved settings have no effect yet. Meant to be relayed to the user.', 'wordpress-seo' ),
		];

		return [
			'label'               => \__( 'Update SEO Settings for Archives and Special Pages', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s: the name of an ability. */
				\__( 'Update the SEO settings of the homepage when it shows the latest posts, an archive or a special page. Category, tag and other taxonomy archives are not included; use the %s ability for their individual terms. Only the settings you provide are changed. Only use snippet variables that apply to the pages you update, as the ones that do not are silently removed when the page is rendered.', 'wordpress-seo' ),
				'yoast-seo/update-term-seo-data',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'target' ],
				'minProperties'        => 2,
				'properties'           => \array_merge(
					[
						'target'    => [
							'type'        => 'string',
							'enum'        => $this->target_repository->get_names(),
							'description' => \__( 'The pages to update.', 'wordpress-seo' ),
						],
						'post_type' => [
							'type'        => 'string',
							'description' => \sprintf(
								/* translators: %s expands to the name of a target. */
								\__( 'The post type of the content type whose archive to update. Required for the %s target, ignored for the others.', 'wordpress-seo' ),
								Post_Type_Archive_Target::NAME,
							),
						],
					],
					$this->field_map->get_fields(),
				),
			],
			'output_schema'       => $output_schema,
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
					// We can't claim this is truly non-destructive because noindex can remove pages from search results.
					'destructive' => null,
					'idempotent'  => true,
				],
				'mcp'          => [
					'public' => true,
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
