<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Feature_Toggle;

/**
 * Adds the Wincher integration.
 */
class Wincher implements Integration_Interface {

	/**
	 * The Wincher helper instance.
	 *
	 * @var Wincher_Helper
	 */
	protected $wincher;

	/**
	 * The Wincher integration toggle constructor.
	 *
	 * @param Wincher_Helper $wincher The Wincher helper instance.
	 */
	public function __construct( Wincher_Helper $wincher ) {
		$this->wincher = $wincher;
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * Called by Yoast_Integration_Toggles to add extra toggles to the ones defined there.
		 */
		\add_filter( 'wpseo_integration_toggles', [ $this, 'add_integration_toggle' ] );

		/**
		 * Update the default wincher_integration_active depending on the integration is disabled or not.
		 */
		\add_filter( 'wpseo_option_wpseo_defaults', [ $this, 'default_values' ] );

		/**
		 * Called in dashboard/integrations.php to put additional content after the toggle.
		 */
		\add_action( 'Yoast\WP\SEO\admin_integration_after', [ $this, 'after_integration_toggle' ] );

		/**
		 * Add extra text after the network integration toggle if the toggle is disabled.
		 */
		\add_action( 'Yoast\WP\SEO\admin_network_integration_after', [ $this, 'after_network_integration_toggle' ] );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Adds the Wincher integration toggle to the array.
	 *
	 * @param array $integration_toggles The integration toggles array.
	 *
	 * @return array The updated integration toggles array.
	 */
	public function add_integration_toggle( $integration_toggles ) {
		if ( \is_array( $integration_toggles ) ) {
			$integration_toggles[] = (object) [
				/* translators: %s: 'Wincher' */
				'name'     => \sprintf( \__( '%s integration', 'wordpress-seo' ), 'Wincher' ),
				'setting'  => 'wincher_integration_active',
				'label'    => \sprintf(
				/* translators: %s: 'Wincher' */
					\__( 'The %s integration offers the option to track specific keyphrases and gain insights in their positions.', 'wordpress-seo' ),
					'Wincher'
				),
				'order'    => 11,
				'disabled' => $this->wincher->integration_is_disabled(),
			];
		}

		return $integration_toggles;
	}

	/**
	 * Set the default Wincher integration option value depending on the integration is disabled or not.
	 *
	 * @param array $defaults Array containing default wpseo options.
	 *
	 * @return array
	 */
	public function default_values( $defaults ) {
		if ( $this->wincher->integration_is_disabled() ) {
			$defaults['wincher_integration_active'] = false;
		}

		return $defaults;
	}

	/**
	 * Add an explainer when the integration toggle is disabled.
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_integration_toggle( $integration ) {
		if ( $integration->setting === 'wincher_integration_active' ) {

			require \WPSEO_PATH . 'admin/views/tabs/metas/paper-content/integrations/wincher.php';

			if ( $integration->disabled ) {

				$conditional = $this->wincher->integration_is_disabled( true );

				if ( $conditional === 'Non_Multisite_Conditional' ) {
					echo '<p>' . \sprintf(
						/* translators: %s expands to Wincher */
							\esc_html__( 'Currently, the %s integration is not available for multisites.', 'wordpress-seo' ),
							'Wincher'
						) . '</p>';
				}
			}
		}
	}

	/**
	 * Add an explainer when the network integration toggle is disabled.
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_network_integration_toggle( $integration ) {
		if ( $integration->setting === 'wincher_integration_active' ) {
			if ( $integration->disabled ) {
				echo '<p>' . \sprintf(
					/* translators: %s expands to Wincher */
						\esc_html__( 'Currently, the %s integration is not available for multisites.', 'wordpress-seo' ),
						'Wincher'
					) . '</p>';
			}
		}
	}
}
