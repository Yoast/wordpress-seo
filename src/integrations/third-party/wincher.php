<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Wincher_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds the Wincher integration.
 */
class Wincher implements Integration_Interface {

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
		\add_action( 'Yoast\WP\SEO\admin_integration_after', [ $this, 'load_toggle_additional_content' ] );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Wincher_Conditional::class ];
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
				'name'    => \sprintf( \__( '%s integration', 'wordpress-seo' ), 'Wincher' ),
				'setting' => 'wincher_integration_active',
				'label'   => \sprintf(
				/* translators: %s: 'Wincher' */
					\__( 'The %s integration offers the option to track specific keyphrases and gain insights in their positions.', 'wordpress-seo' ),
					'Wincher'
				),
				'order'   => 11,
			];
		}

		return $integration_toggles;
	}

	/**
	 * Loads additional content for the passed integration.
	 *
	 * @param Object $integration The integration object.
	 *
	 * @return void
	 */
	public function load_toggle_additional_content( $integration ) {
		switch ( $integration->setting ) {
			case 'wincher_integration_active':
				require WPSEO_PATH . 'admin/views/tabs/metas/paper-content/integrations/wincher.php';
				break;
			default:
				break;
		}
	}
}
