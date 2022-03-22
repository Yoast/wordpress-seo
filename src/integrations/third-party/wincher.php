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
	 * Adds the Wincher integration toggle to the $integration_toggles array.
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
				'disabled' => ( ! $this->wincher->is_active() ),
			];
		}

		return $integration_toggles;
	}

	/**
	 * Adds the disabled note when the integration toggle is disabled.
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_integration_toggle( $integration ) {
		if ( $integration->setting === 'wincher_integration_active' ) {

			// Check if 'WPSEO_PATH' is defined else the relevant unittest will require the file.
			if ( defined( 'WPSEO_PATH' ) ) {
				require \WPSEO_PATH . 'admin/views/tabs/metas/paper-content/integrations/wincher.php';
			}

			if ( $integration->disabled ) {

				$conditional = $this->wincher->is_active( true );

				if ( $conditional === 'Non_Multisite_Conditional' ) {
					echo $this->get_disabled_note();
				}
			}
		}
	}

	/**
	 * Adds the disabled note when the network integration toggle is disabled.
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 */
	public function after_network_integration_toggle( $integration ) {
		if ( $integration->setting === 'wincher_integration_active' ) {
			if ( $integration->disabled ) {
				echo $this->get_disabled_note();
			}
		}
	}

	/** The disabled note */
	protected function get_disabled_note() {
		return '<p>' . \sprintf(
			/* translators: %s expands to Wincher */
				\esc_html__( 'Currently, the %s integration is not available for multisites.', 'wordpress-seo' ),
				'Wincher'
			) . '</p>';
	}
}
