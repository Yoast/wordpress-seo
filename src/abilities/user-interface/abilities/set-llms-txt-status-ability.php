<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Llms_Txt_Status_Updater;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that enables or disables the llms.txt feature.
 *
 * Disabling removes the generated file and re-enabling regenerates it. The destructive
 * annotation is left unknown so that clients decide how to confirm the toggle.
 */
class Set_Llms_Txt_Status_Ability extends Abstract_Set_Feature_Status_Ability {

	/**
	 * The non-multisite conditional.
	 *
	 * @var Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * The llms.txt status updater.
	 *
	 * @var Llms_Txt_Status_Updater
	 */
	private $llms_txt_status_updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper         $capability_helper         The capability helper.
	 * @param Non_Multisite_Conditional $non_multisite_conditional The non-multisite conditional.
	 * @param Llms_Txt_Status_Updater   $llms_txt_status_updater   The llms.txt status updater.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Non_Multisite_Conditional $non_multisite_conditional,
		Llms_Txt_Status_Updater $llms_txt_status_updater
	) {
		parent::__construct( $capability_helper );

		$this->non_multisite_conditional = $non_multisite_conditional;
		$this->llms_txt_status_updater   = $llms_txt_status_updater;
	}

	/**
	 * Returns whether the ability is available: the llms.txt feature cannot be enabled on
	 * multisite installations, so the ability is only offered outside of them.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return $this->non_multisite_conditional->is_met();
	}

	/**
	 * Enables or disables the feature and returns its new status, reporting whether the file could be generated.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string>|WP_Error The new status, or an error when it could not be saved.
	 */
	public function execute( array $input ) {
		return $this->llms_txt_status_updater->set_status( $input );
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-llms-txt-status';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'llms.txt';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set llms.txt Status', 'wordpress-seo' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the warning property that reports a failed file generation.
	 *
	 * @return array<string, array<string, mixed>> The additional output schema properties.
	 */
	protected function get_additional_output_properties(): array {
		return [
			'warning' => [
				'type'        => 'string',
				'description' => \__( 'Only present when the feature is enabled but the llms.txt file could not be generated. Meant to be relayed to the user.', 'wordpress-seo' ),
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
			\__( 'Enable or disable %s\'s llms.txt feature. Enabling it generates an llms.txt file for the site and keeps it up to date; disabling it removes the file.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}
