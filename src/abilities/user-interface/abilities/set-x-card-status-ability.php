<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\X_Card_Feature;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that enables or disables the X card data feature.
 *
 * Only the option is written: when the feature is disabled, the front-end integration
 * stops outputting the X card meta tags.
 */
class Set_X_Card_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * The X card data feature.
	 *
	 * @var X_Card_Feature
	 */
	private $x_card_feature;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper      $capability_helper      The capability helper.
	 * @param Feature_Status_Updater $feature_status_updater The feature status updater.
	 * @param X_Card_Feature         $x_card_feature         The X card data feature.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		X_Card_Feature $x_card_feature
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->x_card_feature = $x_card_feature;
	}

	/**
	 * Enables or disables the feature and returns its new status.
	 *
	 * Code like the `wpseo_output_twitter_card` filter can turn the tags off regardless of the setting. Enabling the
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

		if ( $this->x_card_feature->is_disabled_programmatically() ) {
			$result['warning'] = \__( 'The X card data setting is turned on, but code on the site, like a filter, turns the X card meta tags off, so the tags are not output until that code is removed.', 'wordpress-seo' );
		}

		return $result;
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-x-card-status';
	}

	/**
	 * Returns the name of the option that enables the X card data feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return X_Card_Feature::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return X_Card_Feature::NAME;
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set X Card Data Status', 'wordpress-seo' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the warning property that reports the tags being turned off by code.
	 *
	 * @return array<string, array<string, mixed>> The additional output schema properties.
	 */
	protected function get_additional_output_properties(): array {
		return [
			'warning' => [
				'type'        => 'string',
				'description' => \__( 'Only present when the setting is turned on but code on the site turns the X card meta tags off. Meant to be relayed to the user.', 'wordpress-seo' ),
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
			\__( 'Enable or disable %s\'s X card data feature. Enabling it outputs X card meta tags on the site\'s pages, so X can display a preview with an image and a text excerpt when a link to the site is shared; disabling it stops outputting the tags. If code on the site, like a filter, turns the tags off, enabling it has no effect until that code is removed.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}
