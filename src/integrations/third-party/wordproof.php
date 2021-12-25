<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\Support\Authentication;
use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Core_Inactive_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WooCommerce integration.
 */
class WordProof implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The WordProof WordPress SDK.
	 *
	 * @var WordPress
	 */
	private $SDK;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ WordProof_Core_Inactive_Conditional::class ];
	}

	/**
	 * WooCommerce constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options
	) {
		$this->options = $options;
		$this->SDK = new WordPressSDK();
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'plugins_loaded', [ $this, 'init' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	public function init() {
		$this->SDK->certificate();
	}

	public function enqueue_assets() {
		global $pagenow;

		if ( ! \WPSEO_Metabox::is_post_edit( $pagenow ) ) {
			return;
		}

		$asset_manager = new \WPSEO_Admin_Asset_Manager();

		$data = [
			'data' => [
				'is_authenticated' => Authentication::isAuthenticated(),
				'popup_redirect_authentication_url' => \admin_url('admin.php?page=wordproof-redirect-authenticate'),
				'popup_redirect_settings_url' => \admin_url('admin.php?page=wordproof-redirect-settings'),
				'rest_is_authenticated_url' => get_rest_url(null, '')
			]
		];

		$asset_manager->localize_script( 'post-edit', 'wpseoWordProof', $data );
		$asset_manager->localize_script( 'post-edit-classic', 'wpseoWordProof', $data );
	}
}
