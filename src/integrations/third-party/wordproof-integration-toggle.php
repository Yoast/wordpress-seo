<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\Helpers\PostMetaHelper;
use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Config\WordProofAppConfig;
use Yoast\WP\SEO\Config\WordProofTranslations;
use Yoast\WP\SEO\Helpers\WordProof_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class WordProofIntegrationToggle.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */
class WordProof_Integration_Toggle implements Integration_Interface {

	/**
	 * The WordProof helper instance.
	 *
	 * @var WordProof_Helper
	 */
	protected $wordproof;

	/**
	 * The WordProof integration toggle constructor.
	 *
	 * @param WordProof_Helper $wordproof The WordProof helper instance.
	 */
	public function __construct( WordProof_Helper $wordproof ) {
		$this->wordproof = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
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
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * Called by Yoast_Integration_Toggles to add extra toggles to the ones defined there.
		 */
		\add_filter( 'wpseo_integration_toggles', [ $this, 'add_integration_toggle' ] );

		/**
		 * Update the default wordproof_integration_active depending if the integration is disabled or not.
		 */
		\add_filter( 'wpseo_option_wpseo_defaults', [ $this, 'default_values' ] );

		/**
		 * Add extra text after the integration toggle if the toggle is disabled.
		 */
		\add_action( 'Yoast\WP\SEO\admin_integration_after', [ $this, 'after_integration_toggle' ] );

		/**
		 * Add extra text after the network integration toggle if the toggle is disabled.
		 */
		\add_action( 'Yoast\WP\SEO\admin_network_integration_after', [ $this, 'after_network_integration_toggle' ] );
	}

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @param array $integration_toggles The integration toggles array.
	 *
	 * @return array The updated integration toggles array.
	 */
	public function add_integration_toggle( $integration_toggles ) {
		if ( \is_array( $integration_toggles ) ) {
			$integration_toggles[] = (object) [
				/* translators: %s expands to WordProof */
				'name'            => \sprintf( \__( '%s integration', 'wordpress-seo' ), 'WordProof' ),
				'setting'         => 'wordproof_integration_active',
				'label'           => \sprintf(
				/* translators: %s expands to WordProof */
					\__( '%1$s can be used to timestamp your privacy page.', 'wordpress-seo' ),
					'WordProof'
				),
				/* translators: %s expands to WordProof */
				'read_more_label' => \sprintf( \__( 'Read more about how %s works.', 'wordpress-seo' ), 'WordProof ' ),
				'read_more_url'   => 'https://yoa.st/wordproof-integration',
				'order'           => 16,
				'disabled'        => $this->wordproof->integration_is_disabled(),
				'new'             => true,
			];
		}

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
	 * @param \Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_integration_toggle( $integration ) {
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

				if ( $conditional === 'WordProof_Plugin_Inactive_Conditional' ) {
					echo '<p>' . \esc_html__( 'The WordProof Timestamp plugin needs to be disabled before you can activate this integration.', 'wordpress-seo' ) . '</p>';
				}
			}
		}
	}

	/**
	 * Add an explainer when the network integration toggle is disabled.
	 *
	 * @param \Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_network_integration_toggle( $integration ) {
		if ( $integration->setting === 'wordproof_integration_active' ) {
			if ( $integration->disabled ) {
				echo '<p>' . \sprintf(
					/* translators: %s expands to WordProof */
					\esc_html__( 'Currently, the %s integration is not available for multisites.', 'wordpress-seo' ),
					'WordProof'
				) . '</p>';
			}
		}
	}
}
