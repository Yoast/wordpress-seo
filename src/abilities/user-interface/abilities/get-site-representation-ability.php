<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use stdClass;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets the site representation settings: whether the site represents an organization or a
 * person, along with their name, logo and social profiles.
 */
class Get_Site_Representation_Ability extends Abstract_Site_Representation_Ability {

	/**
	 * The site representation collector.
	 *
	 * @var Site_Representation_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper             $capability_helper The capability helper.
	 * @param Site_Representation_Field_Map $field_map         The site representation field map.
	 * @param Site_Representation_Collector $collector         The site representation collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Site_Representation_Field_Map $field_map,
		Site_Representation_Collector $collector
	) {
		parent::__construct( $capability_helper, $field_map );

		$this->collector = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-site-representation';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Returns the site representation settings.
	 *
	 * @return array<string, mixed> The site representation settings, keyed by option name.
	 */
	public function execute(): array {
		return $this->collector->get();
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get Site Representation', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Get %s\'s site representation settings, which tell search engines whether the site represents an organization or a person, and provide its name, logo, social profiles and, depending on the active add-ons, other details for the site\'s organization schema. The settings are returned as stored, so an empty value means the setting is not set, and the site falls back to what the description of that setting says.', 'wordpress-seo' ),
				'Yoast SEO',
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
				'type'       => 'object',
				'properties' => $this->get_settings_output_schema(),
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
