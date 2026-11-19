<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that enable or disable a feature.
 *
 * Features toggled by writing a boolean option and nothing else extend Abstract_Set_Option_Status_Ability.
 * Features whose toggle has side effects worth reporting extend this class directly and bring their own updater.
 */
abstract class Abstract_Set_Feature_Status_Ability implements Ability_Interface {

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
	 * Constructor.
	 *
	 * @param Capability_Helper  $capability_helper  The capability helper.
	 * @param Feature_Repository $feature_repository The feature repository.
	 */
	public function __construct( Capability_Helper $capability_helper, Feature_Repository $feature_repository ) {
		$this->capability_helper  = $capability_helper;
		$this->feature_repository = $feature_repository;
	}

	/**
	 * Enables or disables the feature and returns its new status.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string>|WP_Error The new status, or an error when it could not be saved.
	 */
	abstract public function execute( array $input );

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	abstract protected function get_slug(): string;

	/**
	 * Returns the key of the feature in the feature repository.
	 *
	 * @return string The feature key.
	 */
	abstract protected function get_feature_key(): string;

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
	 * Returns the feature the ability enables or disables.
	 *
	 * Only returns null when the feature is not registered. The ability is then not available, so it is never
	 * registered and its other methods never run.
	 *
	 * @return Feature_Interface|null The feature, or null if it is not registered.
	 */
	protected function get_feature(): ?Feature_Interface {
		return $this->feature_repository->get( $this->get_feature_key() );
	}

	/**
	 * Returns whether the ability is available: only features that are registered and can be changed on the site
	 * are offered.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		$feature = $this->get_feature();

		return ( $feature !== null && $feature->is_available() );
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

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema properties a feature adds next to `enabled`. Features whose
	 * toggle has side effects worth reporting override this.
	 *
	 * @return array<string, array<string, mixed>> The additional output schema properties.
	 */
	protected function get_additional_output_properties(): array {
		return [];
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$feature_name = $this->get_feature()->get_name();

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
							/* translators: %1$s expands to Yoast SEO, %2$s: the name of the feature. */
							\__( 'Whether %1$s\'s %2$s feature should be enabled. true enables it; false disables it.', 'wordpress-seo' ),
							'Yoast SEO',
							$feature_name,
						),
					],
				],
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => \array_merge(
					[
						'enabled' => [
							'type'        => 'boolean',
							'description' => \sprintf(
								/* translators: %1$s expands to Yoast SEO, %2$s: the name of the feature. */
								\__( 'Whether %1$s\'s %2$s feature is enabled.', 'wordpress-seo' ),
								'Yoast SEO',
								$feature_name,
							),
						],
					],
					$this->get_additional_output_properties(),
				),
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
