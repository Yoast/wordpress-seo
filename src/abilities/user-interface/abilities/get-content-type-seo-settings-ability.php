<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use stdClass;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets the default SEO settings of the content types.
 */
class Get_Content_Type_SEO_Settings_Ability extends Abstract_Content_Type_SEO_Settings_Ability {

	/**
	 * The global SEO settings collector.
	 *
	 * @var Global_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper             $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map      $field_map         The global setting field map.
	 * @param Content_Type_Target_Factory   $target_factory    The factory of the content type targets.
	 * @param Global_SEO_Settings_Collector $collector         The global SEO settings collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Content_Type_Target_Factory $target_factory,
		Global_SEO_Settings_Collector $collector
	) {
		parent::__construct( $capability_helper, $field_map, $target_factory );

		$this->collector = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-content-type-seo-settings';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Returns the default SEO settings of all content types.
	 *
	 * @return array<array<string, mixed>> The default SEO settings of each content type.
	 */
	public function execute(): array {
		return \array_map( [ $this->collector, 'get_target_settings' ], $this->target_factory->create_all() );
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get SEO Settings for Content Types', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: 1: the name of an ability, 2: the name of an ability. */
				\__( 'Get the default SEO settings of the content types, like posts, pages or products, as found under "Content types" in the Yoast SEO settings. They apply to each post of the content type that does not set its own value, which the %1$s ability returns. The archive of a content type and the homepage, which are on the same settings pages, are read with the %2$s ability. The title and description templates can contain snippet variables, and are returned as stored rather than as shown on the site.', 'wordpress-seo' ),
				'yoast-seo/get-post-seo-data',
				'yoast-seo/get-archive-and-special-page-seo-settings',
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
