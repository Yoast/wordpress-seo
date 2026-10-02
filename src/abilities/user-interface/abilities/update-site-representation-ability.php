<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that updates the site representation settings: whether the site represents an
 * organization or a person, along with their name, logo and social profiles.
 */
class Update_Site_Representation_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The site representation field map.
	 *
	 * @var Site_Representation_Field_Map
	 */
	private $field_map;

	/**
	 * The site representation updater.
	 *
	 * @var Site_Representation_Updater
	 */
	private $site_representation_updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper             $capability_helper           The capability helper.
	 * @param Site_Representation_Field_Map $field_map                   The site representation field map.
	 * @param Site_Representation_Updater   $site_representation_updater The site representation updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Site_Representation_Field_Map $field_map,
		Site_Representation_Updater $site_representation_updater
	) {
		$this->capability_helper           = $capability_helper;
		$this->field_map                   = $field_map;
		$this->site_representation_updater = $site_representation_updater;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-site-representation';
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
	 * Gates the ability behind the same capability that gates the settings page where the site
	 * representation is set.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the option values are heterogeneous by nature.

	/**
	 * Updates the site representation settings and returns their new state.
	 *
	 * @param array<string, mixed> $input The site representation settings to change, keyed by option name.
	 *
	 * @return array<string, mixed> The new site representation settings, plus a warning when some could not be changed.
	 */
	public function execute( array $input ): array {
		return $this->site_representation_updater->update( $input );
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$fields = $this->field_map->get_fields();

		return [
			'label'               => \__( 'Update Site Representation', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Update %s\'s site representation settings, which tell search engines whether the site represents an organization or a person, and provide its name, logo and social profiles for the structured data. Only the settings you provide are changed; a provided empty value (an empty string, 0 or an empty array) clears that setting, and a provided list replaces the current one.', 'wordpress-seo' ),
				'Yoast SEO',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'minProperties'        => 1,
				'properties'           => $fields,
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => \array_merge(
					\array_map( [ $this, 'to_output_schema' ], $fields ),
					[
						'warning' => [
							'type'        => 'string',
							'description' => \__( 'Only present when a requested setting could not be applied or saved, for example when Yoast Local SEO requires the site to represent an organization or when the user to represent does not exist. Meant to be relayed to the user.', 'wordpress-seo' ),
						],
					],
				),
			],
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
					// We can't claim this is truly non-destructive because settings can be cleared.
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
	 * Reduces a field's input schema to its output schema: the input constraints (like the minimum of
	 * an ID) would only make the output validation fail on values that were saved before.
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
