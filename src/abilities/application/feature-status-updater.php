<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that enables or disables a feature that is backed by a boolean option.
 *
 * Only the option is written here: any side effect of the toggle (like generating or removing
 * the llms.txt file) is left to the code that already reacts to the option change, exactly as
 * when the feature is toggled from the settings page.
 */
class Feature_Status_Updater {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Enables or disables the feature behind the given option and returns its new status.
	 *
	 * @param string              $option_name The name of the boolean option that enables the feature.
	 * @param array<string, bool> $input       The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool>|WP_Error The new status, or an error when the input is invalid or the status could not be saved.
	 */
	public function set_status( string $option_name, array $input ) {
		if ( ! isset( $input['enabled'] ) || ! \is_bool( $input['enabled'] ) ) {
			return new WP_Error(
				'yoast_seo_feature_status_invalid_input',
				\__( 'The enabled status is required and must be a boolean.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		$enabled = $input['enabled'];

		if ( $this->options_helper->set( $option_name, $enabled ) !== true ) {
			return new WP_Error(
				'yoast_seo_feature_status_not_saved',
				\__( 'The feature status could not be saved.', 'wordpress-seo' ),
				[ 'status' => 500 ],
			);
		}

		return [ 'enabled' => $enabled ];
	}
}
