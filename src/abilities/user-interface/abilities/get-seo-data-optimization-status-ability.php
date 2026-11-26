<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use stdClass;
use Yoast\WP\SEO\Abilities\Application\SEO_Data_Optimization_Status_Collector;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets whether the indexables are enabled and whether the SEO data optimization has finished, which
 * the abilities that read from the indexables depend on.
 */
class Get_SEO_Data_Optimization_Status_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The SEO data optimization status collector.
	 *
	 * @var SEO_Data_Optimization_Status_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                 $capability_helper The capability helper.
	 * @param SEO_Data_Optimization_Status_Collector $collector         The SEO data optimization status collector.
	 */
	public function __construct( Capability_Helper $capability_helper, SEO_Data_Optimization_Status_Collector $collector ) {
		$this->capability_helper = $capability_helper;
		$this->collector         = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-seo-data-optimization-status';
	}

	/**
	 * Returns whether the ability is available: always, so that agents can learn that the indexables are disabled,
	 * which explains why the abilities that read from them are missing.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return true;
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * Gates the ability behind the capability of the Tools page, where the SEO data optimization is started.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Returns the SEO data optimization status.
	 *
	 * @return array<string, bool> The SEO data optimization status.
	 */
	public function execute(): array {
		return $this->collector->get();
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		return [
			'label'               => \__( 'Get SEO Data Optimization Status', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Get whether %s stores the SEO data of the site in its indexables, and whether it has finished optimizing that SEO data. The abilities that get or update the SEO data of posts, terms and authors, and the abilities that get the scores, are only available when the indexables are enabled, and only find content whose SEO data has been optimized, so while the SEO data optimization has not finished, they can miss content that exists. Check this status when those abilities are missing or don\'t find content you expect. A user who can manage the SEO settings can start the SEO data optimization from the Tools page of the plugin.', 'wordpress-seo' ),
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
				'properties' => [
					'indexables_enabled' => [
						'type'        => 'boolean',
						'description' => \__( 'Whether the indexables are enabled. They are disabled on non-production environments, unless a developer enables them, and a developer can also disable them on any environment.', 'wordpress-seo' ),
					],
					'is_optimized'       => [
						'type'        => 'boolean',
						'description' => \__( 'Whether the SEO data of all the content of the site has been optimized. Always false when the indexables are disabled.', 'wordpress-seo' ),
					],
				],
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
