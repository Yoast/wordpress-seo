<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the default SEO settings of a content type.
 */
class Update_Content_Type_SEO_Settings_Ability extends Abstract_Content_Type_SEO_Settings_Ability {

	/**
	 * The global SEO settings updater.
	 *
	 * @var Global_SEO_Settings_Updater
	 */
	private $updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper           $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map    $field_map         The global setting field map.
	 * @param Content_Type_Target_Factory $target_factory    The factory of the content type targets.
	 * @param Global_SEO_Settings_Updater $updater           The global SEO settings updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Content_Type_Target_Factory $target_factory,
		Global_SEO_Settings_Updater $updater
	) {
		parent::__construct( $capability_helper, $field_map, $target_factory );

		$this->updater = $updater;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-content-type-seo-settings';
	}

	/**
	 * Returns the target of a content type, once it is available.
	 *
	 * @param string $post_type The post type of the content type.
	 *
	 * @return Content_Type_Target The target.
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the post type is missing or has no default SEO
	 *                                                     settings.
	 */
	private function resolve_target( string $post_type ): Content_Type_Target {
		$target = $this->target_factory->create( $post_type );
		$target->ensure_available();

		return $target;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Updates the default SEO settings of a content type and returns their new state.
	 *
	 * @param array<string, mixed> $input The post type of the content type, and the fields to change.
	 *
	 * @return array<string, mixed>|WP_Error The new default SEO settings of the content type, or an error.
	 */
	public function execute( array $input ) {
		try {
			$target = $this->resolve_target( (string) ( $input['post_type'] ?? '' ) );
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
			'label'               => \__( 'Update SEO Settings for Content Types', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: 1: the name of an ability, 2: the name of an ability. */
				\__( 'Update the default SEO settings of a content type, like posts, pages or products. Only the settings you provide are changed. They apply to each post of the content type that does not set its own value, so to change all posts of a content type, update its defaults here rather than each post with the %1$s ability. The archive of a content type and the homepage are updated with the %2$s ability. Only use snippet variables that apply to single posts, as the ones that do not are silently removed when the page is rendered.', 'wordpress-seo' ),
				'yoast-seo/update-post-seo-data',
				'yoast-seo/update-archive-and-special-page-seo-settings',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'post_type' ],
				'minProperties'        => 2,
				'properties'           => \array_merge(
					[
						'post_type' => [
							'type'        => 'string',
							'description' => \__( 'The post type of the content type to update.', 'wordpress-seo' ),
						],
					],
					$this->field_map->get_fields_for_targets( [ Content_Type_Target::NAME ] ),
				),
			],
			'output_schema'       => $output_schema,
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
					// We can't claim this is truly non-destructive because noindex can remove every post of the content type from search results.
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
