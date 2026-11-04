<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the SEO data of the homepage, an archive or a special page.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Update_Archive_And_Special_Page_SEO_Settings_Ability extends Abstract_Archive_And_Special_Page_SEO_Settings_Ability {

	/**
	 * The global SEO settings updater.
	 *
	 * @var Global_SEO_Settings_Updater
	 */
	private $updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map         $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository $target_repository The global setting target repository.
	 * @param Global_SEO_Settings_Updater      $updater           The global SEO settings updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository,
		Global_SEO_Settings_Updater $updater
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

	/**
	 * Returns the available target that the input identifies.
	 *
	 * @param array<string, string> $input The target and, for the archives that exist once per content type or
	 *                                     taxonomy, the post type or the taxonomy.
	 *
	 * @return Global_Setting_Target_Interface The target.
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When no target matches, or it is not available.
	 */
	private function resolve_target( array $input ): Global_Setting_Target_Interface {
		$target = $this->target_repository->get(
			(string) ( $input['target'] ?? '' ),
			(string) ( $input['post_type'] ?? '' ),
			(string) ( $input['taxonomy'] ?? '' ),
		);
		$target->ensure_available();

		return $target;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Updates the global settings of a target and returns its new state.
	 *
	 * @param array<string, mixed> $input The target, the post type or the taxonomy for the archives that exist once per
	 *                                    content type or taxonomy, and the fields to change.
	 *
	 * @return array<string, mixed>|WP_Error The new global settings of the target, or an error.
	 */
	public function execute( array $input ) {
		try {
			$target = $this->resolve_target( $input );
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			return $this->to_wp_error( $exception );
		}

		return $this->updater->update( $target, $input );
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
				/* translators: 1: the name of an ability, 2: the name of an ability. */
				\__( 'Update the SEO settings of the homepage when it shows the latest posts, an archive or a special page. Only the settings you provide are changed. The settings of a taxonomy apply to each of its terms that does not set its own value, so to change all terms of a taxonomy, update them here rather than each term with the %1$s ability. The default settings of the posts of a content type are updated with the %2$s ability instead. Only use snippet variables that apply to the pages you update, as the ones that do not are silently removed when the page is rendered.', 'wordpress-seo' ),
				'yoast-seo/update-term-seo-data',
				'yoast-seo/update-content-type-seo-settings',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'target' ],
				'minProperties'        => 2,
				'properties'           => \array_merge(
					$this->get_identifier_input_schema(),
					$this->field_map->get_fields_for_targets( $this->target_repository->get_names() ),
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

	/**
	 * Returns the input schema of what identifies the target to update.
	 *
	 * @return array<string, array<string, mixed>> The input schema of each identifier, keyed by input name.
	 */
	private function get_identifier_input_schema(): array {
		return [
			'target'    => [
				'type'        => 'string',
				'enum'        => $this->target_repository->get_names(),
				'description' => \__( 'The pages to update.', 'wordpress-seo' ) . ' ' . $this->get_targets_description(),
			],
			'post_type' => [
				'type'        => 'string',
				'description' => \sprintf(
					/* translators: %s expands to the name of a target. */
					\__( 'The post type of the content type, required for the %s target and ignored for the others.', 'wordpress-seo' ),
					Post_Type_Archive_Target::NAME,
				),
			],
			'taxonomy'  => [
				'type'        => 'string',
				'description' => \sprintf(
					/* translators: %s expands to the name of a target. */
					\__( 'The taxonomy, like category or post_tag, required for the %s target and ignored for the others.', 'wordpress-seo' ),
					Taxonomy_Archive_Target::NAME,
				),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
