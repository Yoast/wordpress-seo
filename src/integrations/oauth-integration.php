<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class Front_End_Integration.
 */
class OAuth_Integration implements Integration_Interface {

	use No_Conditionals;

	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ] );
	}

	public function load_authorize_template() {
		include_once WPSEO_PATH . 'src/oauth/authorize.php';
	}

	/**
	 * Add an admin page for authorization but do not add it to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		add_menu_page( 'Yoast SEO OAuth', 'Yoast SEO OAuth', 'edit_plugins', 'wpseo_oauth_authorize', [ $this, 'load_authorize_template' ]);
		remove_menu_page('wpseo_oauth_authorize');
	}
}
