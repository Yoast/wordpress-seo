<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Option_Tab;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Beta_Badge_Presenter;

/**
 * Crawl_Settings_Integration class
 */
class Crawl_Settings_Integration implements Integration_Interface {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Crawl_Settings_Integration constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'wpseo_settings_tabs_dashboard', [ $this, 'add_crawl_settings_tab' ] );
	}

	/**
	 * Adds a dedicated tab in the General sub-page.
	 *
	 * @param WPSEO_Options_Tabs $dashboard_tabs Object representing the tabs of the General sub-page.
	 */
	public function add_crawl_settings_tab( $dashboard_tabs ) {
		$dashboard_tabs->add_tab(
			new WPSEO_Option_Tab(
				'crawl-settings',
				__( 'Crawl settings', 'wordpress-seo' ),
				[
					'save_button' => true,
					'beta'        => true,
				]
			)
		);
	}
}
