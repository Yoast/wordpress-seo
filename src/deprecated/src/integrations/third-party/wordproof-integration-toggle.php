<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Feature_Toggle;

/**
 * Class WordProofIntegrationToggle.
 *
 * @deprecated 21.6
 * @codeCoverageIgnore
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */
class Wordproof_Integration_Toggle implements Integration_Interface {

	/**
	 * The WordProof helper instance.
	 *
	 * @var Wordproof_Helper
	 */
	protected $wordproof;

	/**
	 * The WordProof integration toggle constructor.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param Wordproof_Helper $wordproof The WordProof helper instance.
	 */
	public function __construct( Wordproof_Helper $wordproof ) {
		$this->wordproof = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );
	}

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param array $integration_toggles The integration toggles array.
	 *
	 * @return array The updated integration toggles array.
	 */
	public function add_integration_toggle( $integration_toggles ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );

		return $integration_toggles;
	}

	/**
	 * Set the default WordProof integration option value depending if the integration is disabled or not.
	 *
	 * @param array $defaults Array containing default wpseo options.
	 *
	 * @return array
	 */
	public function default_values( $defaults ) {
		if ( $this->wordproof->integration_is_disabled() ) {
			$defaults['wordproof_integration_active'] = false;
		}

		return $defaults;
	}

	/**
	 * Add an explainer when the integration toggle is disabled.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 *
	 * @return void
	 */
	public function after_integration_toggle( $integration ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );
		if ( $integration->setting === 'wordproof_integration_active' ) {
			if ( $integration->disabled ) {

				$conditional = $this->wordproof->integration_is_disabled( true );

				if ( $conditional === 'Non_Multisite_Conditional' ) {
					echo '<p>' . \sprintf(
						/* translators: %s expands to WordProof */
						\esc_html__( 'Currently, the %s integration is not available for multisites.', 'wordpress-seo' ),
						'WordProof'
					) . '</p>';
				}

				if ( $conditional === 'Wordproof_Plugin_Inactive_Conditional' ) {
					echo '<p>' . \esc_html__( 'The WordProof Timestamp plugin needs to be disabled before you can activate this integration.', 'wordpress-seo' ) . '</p>';
				}
			}
		}
	}

	/**
	 * Add an explainer when the network integration toggle is disabled.
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 *
	 * @return void
	 */
	public function after_network_integration_toggle( $integration ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );
	}
}
