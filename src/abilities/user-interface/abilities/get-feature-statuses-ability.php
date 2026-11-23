<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use stdClass;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Collector;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that gets whether each feature is enabled, including the features that agents cannot enable or disable
 * on the site.
 */
class Get_Feature_Statuses_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature repository.
	 *
	 * @var Feature_Repository
	 */
	private $feature_repository;

	/**
	 * The feature status collector.
	 *
	 * @var Feature_Status_Collector
	 */
	private $feature_status_collector;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper        $capability_helper        The capability helper.
	 * @param Feature_Repository       $feature_repository       The feature repository.
	 * @param Feature_Status_Collector $feature_status_collector The feature status collector.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Repository $feature_repository,
		Feature_Status_Collector $feature_status_collector
	) {
		$this->capability_helper        = $capability_helper;
		$this->feature_repository       = $feature_repository;
		$this->feature_status_collector = $feature_status_collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-feature-statuses';
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
	 * Gates the ability behind the same capability as the abilities that enable or disable the features.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Returns whether each feature is enabled.
	 *
	 * @return array<string, bool> Whether each feature is enabled, keyed by feature key.
	 */
	public function execute(): array {
		return $this->feature_status_collector->get_all();
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$properties = [];

		foreach ( $this->feature_repository->get_all() as $feature ) {
			$properties[ $feature->get_key() ] = [
				'type'        => 'boolean',
				'description' => \sprintf(
					/* translators: %1$s expands to Yoast SEO, %2$s: the name of the feature. */
					\__( 'Whether %1$s\'s %2$s feature is enabled and in effect on the site.', 'wordpress-seo' ),
					'Yoast SEO',
					$feature->get_name(),
				),
			];
		}

		return [
			'label'               => \__( 'Get Feature Statuses', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Check whether %s features like the XML sitemap and Open Graph data are enabled. A feature that cannot be turned on or off on this site is listed too: for example, llms.txt on multisite, or XML sitemaps when a network admin has disallowed them for the sites of the network. A feature counts as disabled when code on the site, like a filter, turns it off, even if its setting is on. Turning such a feature on with its set ability saves the setting and returns a warning.', 'wordpress-seo' ),
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
				'properties' => $properties,
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
