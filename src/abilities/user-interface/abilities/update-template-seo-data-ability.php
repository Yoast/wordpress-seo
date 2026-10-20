<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Template_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Template_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the template SEO data of one of the page types that are neither posts nor terms, like
 * the homepage or the author archives.
 */
class Update_Template_SEO_Data_Ability extends Abstract_Template_SEO_Data_Ability {

	/**
	 * The template SEO data updater.
	 *
	 * @var Template_SEO_Data_Updater
	 */
	private $updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper          $capability_helper The capability helper.
	 * @param Template_Field_Repository  $field_repository  The template field repository.
	 * @param Template_Target_Repository $target_repository The template target repository.
	 * @param Template_SEO_Data_Updater  $updater           The template SEO data updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Template_Field_Repository $field_repository,
		Template_Target_Repository $target_repository,
		Template_SEO_Data_Updater $updater
	) {
		parent::__construct( $capability_helper, $field_repository, $target_repository );

		$this->updater = $updater;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-template-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Updates the template SEO data of a target and returns its new state.
	 *
	 * @param array<string, mixed> $input The target, the post type for the archive of a content type, and the fields
	 *                                    to change.
	 *
	 * @return array<string, mixed>|WP_Error The new template SEO data of the target, or an error.
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
			'label'               => \__( 'Update Template SEO Data', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Update the %s SEO data of one page type that is neither a post nor a term: the homepage when it shows the latest posts, the author archives, the date archives, the search results page, the 404 page or the archive of a content type. Only the settings you provide are changed, and each page type only supports the settings that yoast-seo/get-template-seo-data returns for it. The author archives, date archives, search results page and 404 page share one template across all their pages, so use replacement variables in them instead of text about one specific page. Only use replacement variables that are appropriate to each page type, as the ones that do not apply to a page are silently removed from it. Setting noindex to true removes these pages from search results and the XML sitemaps, so confirm it with the user before saving. Use yoast-seo/update-post-seo-data instead for a static homepage or the WooCommerce Shop page.', 'wordpress-seo' ),
				'Yoast SEO',
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
							'description' => \__( 'The page type to update.', 'wordpress-seo' ),
						],
						'post_type' => [
							'type'        => 'string',
							'description' => \__( 'The post type of the content type whose archive to update. Required for the post_type_archive target, ignored for the others.', 'wordpress-seo' ),
						],
					],
					$this->field_repository->get_schemas( $this->field_repository->get_all() ),
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
