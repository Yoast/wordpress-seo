<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that enable or disable a feature backed by a boolean option.
 */
abstract class Abstract_Set_Feature_Status_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature status updater.
	 *
	 * @var Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper      $capability_helper      The capability helper.
	 * @param Feature_Status_Updater $feature_status_updater The feature status updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater
	) {
		$this->capability_helper      = $capability_helper;
		$this->feature_status_updater = $feature_status_updater;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	abstract protected function get_slug(): string;

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	abstract protected function get_option_name(): string;

	/**
	 * Returns the human-readable name of the feature, used in the schema descriptions.
	 *
	 * @return string The feature name.
	 */
	abstract protected function get_feature_name(): string;

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	abstract protected function get_label(): string;

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	abstract protected function get_description(): string;

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/' . $this->get_slug();
	}

	/**
	 * Returns whether the ability is available. Features that cannot be enabled in every
	 * environment override this.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return true;
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * Gates the ability behind the same capability that gates the settings page where the
	 * feature is toggled.
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Enables or disables the feature and returns its new status.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool>|WP_Error The new status, or an error when it could not be saved.
	 */
	public function execute( array $input ) {
		return $this->feature_status_updater->set_status( $this->get_option_name(), $input );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$feature_name = $this->get_feature_name();

		return [
			'label'               => $this->get_label(),
			'description'         => $this->get_description(),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'enabled' ],
				'properties'           => [
					'enabled' => [
						'type'        => 'boolean',
						'description' => \sprintf(
							/* translators: %s: the name of the feature. */
							\__( 'Whether the %s feature should be enabled. true enables it; false disables it.', 'wordpress-seo' ),
							$feature_name,
						),
					],
				],
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => [
					'enabled' => [
						'type'        => 'boolean',
						'description' => \sprintf(
							/* translators: %s: the name of the feature. */
							\__( 'Whether the %s feature is enabled.', 'wordpress-seo' ),
							$feature_name,
						),
					],
				],
			],
			'permission_callback' => [ $this, 'can_manage_seo' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
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
