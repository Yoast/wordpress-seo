<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
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
	 * Constructor.
	 *
	 * @param Capability_Helper         $capability_helper         The capability helper.
	 * @param Feature_Status_Updater    $feature_status_updater    The feature status updater.
	 * @param Non_Multisite_Conditional $non_multisite_conditional The non-multisite conditional.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		Non_Multisite_Conditional $non_multisite_conditional
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->non_multisite_conditional = $non_multisite_conditional;
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
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-llms-txt-status';
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'enable_llms_txt';
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
