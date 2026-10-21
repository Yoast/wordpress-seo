<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Template_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Template_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets the template SEO data of the pages that are neither posts nor terms, like the homepage and
 * the archives.
 */
class Get_Template_SEO_Data_Ability extends Abstract_Template_SEO_Data_Ability {

	/**
	 * The template SEO data collector.
	 *
	 * @var Template_SEO_Data_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper           $capability_helper The capability helper.
	 * @param Template_Field_Repository   $field_repository  The template field repository.
	 * @param Template_Target_Repository  $target_repository The template target repository.
	 * @param Template_SEO_Data_Collector $collector         The template SEO data collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Template_Field_Repository $field_repository,
		Template_Target_Repository $target_repository,
		Template_SEO_Data_Collector $collector
	) {
		parent::__construct( $capability_helper, $field_repository, $target_repository );

		$this->collector = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-template-seo-data';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Returns the template SEO data of all targets.
	 *
	 * @return array<array<string, mixed>> The template SEO data of each target.
	 */
	public function execute(): array {
		return $this->collector->get_all();
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get Template SEO Data', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Get the SEO title template, meta description template and other %s settings of the pages that are not posts or terms, like the homepage when it shows the latest posts, the author archives, the date archives, the search results page, the 404 page and the archives of content types. The templates can contain replacement variables, and are returned as stored rather than as shown on the site. Each result also tells whether its pages are in use, whether its settings are shared by many pages, and its URL or URL pattern.', 'wordpress-seo' ),
				'Yoast SEO',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'output_schema'       => [
				'type'  => 'array',
				'items' => $this->get_target_output_schema(),
			],
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => true,
					'destructive' => false,
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
