<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Framework_Feature;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that enables or disables the Schema Framework feature.
 *
 * Only the option is written: when the feature is disabled, the schema disabled conditional
 * stops the JSON-LD output on the front end.
 */
class Set_Schema_Framework_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * The Schema Framework feature.
	 *
	 * @var Schema_Framework_Feature
	 */
	private $schema_framework_feature;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper        $capability_helper        The capability helper.
	 * @param Feature_Status_Updater   $feature_status_updater   The feature status updater.
	 * @param Schema_Framework_Feature $schema_framework_feature The Schema Framework feature.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		Schema_Framework_Feature $schema_framework_feature
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->schema_framework_feature = $schema_framework_feature;
	}

	/**
	 * Enables or disables the feature and returns its new status.
	 *
	 * Code like the `wpseo_json_ld_output` filter can turn the graph off regardless of the setting. Enabling the
	 * feature then still saves the setting, so it is reported as a warning rather than an error.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string>|WP_Error The new status, or an error when it could not be saved.
	 */
	public function execute( array $input ) {
		$result = parent::execute( $input );

		if ( ! \is_array( $result ) || $result['enabled'] !== true ) {
			return $result;
		}

		if ( $this->schema_framework_feature->is_disabled_programmatically() ) {
			$result['warning'] = \__( 'The Schema Framework feature is enabled, but code on the site, like a filter, turns the structured data graph off, so the graph is not output until that code is removed.', 'wordpress-seo' );
		}

		return $result;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-schema-framework-status';
	}

	/**
	 * Returns the name of the option that enables the Schema Framework feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return Schema_Framework_Feature::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return Schema_Framework_Feature::NAME;
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set Schema Framework Status', 'wordpress-seo' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the warning property that reports the graph being turned off by code.
	 *
	 * @return array<string, array<string, mixed>> The additional output schema properties.
	 */
	protected function get_additional_output_properties(): array {
		return [
			'warning' => [
				'type'        => 'string',
				'description' => \__( 'Only present when the feature is enabled but code on the site turns the structured data graph off. Meant to be relayed to the user.', 'wordpress-seo' ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s Schema Framework feature. Enabling it outputs a single structured data graph (JSON-LD) on the site\'s pages, so search engines and language models can consistently read every person, product, organization, and piece of content; disabling it stops outputting the graph. If code on the site, like a filter, turns the graph off, enabling it has no effect until that code is removed.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}
