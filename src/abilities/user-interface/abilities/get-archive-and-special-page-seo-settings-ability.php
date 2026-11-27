<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use stdClass;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets the SEO data of the homepage, the archives and the special pages.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Get_Archive_And_Special_Page_SEO_Settings_Ability extends Abstract_Archive_And_Special_Page_SEO_Settings_Ability {

	/**
	 * The archive and special page SEO settings collector.
	 *
	 * @var Archive_And_Special_Page_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                               $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map                        $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository                $target_repository The global setting target repository.
	 * @param Archive_And_Special_Page_SEO_Settings_Collector $collector         The archive and special page SEO settings collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository,
		Archive_And_Special_Page_SEO_Settings_Collector $collector
	) {
		parent::__construct( $capability_helper, $field_map, $target_repository );

		$this->collector = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-archive-and-special-page-seo-settings';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Returns the global settings of all targets.
	 *
	 * @return array<array<string, mixed>> The global settings of each target.
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
			'label'               => \__( 'Get SEO Settings for Archives and Special Pages', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: 1: the name of an ability, 2: the name of an ability. */
				\__( 'Get the SEO settings of the homepage when it shows the latest posts, the archives and the special pages. Category, tag and other taxonomy archives are not included; use the %1$s ability for their individual terms. A static homepage is not included either, as it is a page whose SEO data is read with the %2$s ability. The title and description templates can contain snippet variables, and are returned as stored rather than as shown on the site.', 'wordpress-seo' ),
				'yoast-seo/get-term-seo-data',
				'yoast-seo/get-post-seo-data',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			// Core rejects any input for an ability without an input schema, and some callers always send `{}`. The
			// default lets a call without input pass validation, and is an object so that it serializes to `{}` where
			// the schema is output as is, like in the REST API.
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'default'              => new stdClass(),
			],
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
