<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Utils;
use WPSEO_Option;
use WPSEO_Option_Tab;
use WPSEO_Option_Tabs;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Form;

/**
 * Crawl_Settings_Integration class
 */
class Crawl_Settings_Integration implements Integration_Interface {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Crawl_Settings_Integration constructor.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct(
		Product_Helper $product_helper
	) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Registers an action to add a new tab to the General page.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_settings_tabs_dashboard', [ $this, 'add_crawl_settings_tab' ] );
		if ( ! $this->product_helper->is_premium() || ! $this->is_premium_upgraded() ) {
			\add_action( 'wpseo_settings_tab_crawl_cleanup', [ $this, 'add_crawl_settings_tab_content' ] );
			\add_action( 'wpseo_settings_tab_crawl_cleanup_network', [ $this, 'add_crawl_settings_tab_content_network' ] );
		}
	}

	/**
	 * Checks if Premium is installed and upgraded to the right version.
	 *
	 * @return bool Whether Premium is installed and upgraded to the right version.
	 */
	public function is_premium_upgraded() {
		$premium_version = $this->product_helper->get_premium_version();
		return $premium_version !== null && \version_compare( $premium_version, '18.6-RC1', '>=' );
	}

	/**
	 * Adds a dedicated tab in the General sub-page.
	 *
	 * @param WPSEO_Option_Tabs $dashboard_tabs Object representing the tabs of the General sub-page.
	 */
	public function add_crawl_settings_tab( $dashboard_tabs ) {
		$premium = $this->product_helper->is_premium() && $this->is_premium_upgraded();

		$dashboard_tabs->add_tab(
			new WPSEO_Option_Tab(
				'crawl-settings',
				\__( 'Crawl settings', 'wordpress-seo' ),
				[
					'save_button' => $premium,
					'beta'        => $premium,
					'premium'     => ! $premium,
				]
			)
		);
	}

	/**
	 * Adds content to the Crawl Cleanup tab.
	 *
	 * @param Yoast_Form $yform The yoast form object.
	 */
	public function add_crawl_settings_tab_content( $yform ) {
		$this->display_premium_upsell_btn();

		echo '<h3 class="yoast-feed-crawl-settings">';
		echo \esc_html__( 'Feed crawl settings', 'wordpress-seo' );
		echo '</h3>';

		$yform->toggle_switch(
			'remove_feed_global_free',
			[
				'off' => __( 'Keep', 'wordpress-seo' ),
				'on'  => __( 'Remove', 'wordpress-seo' ),
			],
			__( 'Global feed', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		$yform->toggle_switch(
			'remove_feed_global_comments_free',
			[
				'off' => __( 'Keep', 'wordpress-seo' ),
				'on'  => __( 'Remove', 'wordpress-seo' ),
			],
			__( 'Global comments feed', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		echo '<p class="yoast-global-comments-feed-help-disabled">';
		echo \esc_html__( 'By removing Global comments feed, Post comments feeds will be removed too.', 'wordpress-seo' );
		echo '</p>';

		$yform->toggle_switch(
			'remove_feed_post_comments_free',
			[
				'off' => __( 'Keep', 'wordpress-seo' ),
				'on'  => __( 'Remove', 'wordpress-seo' ),
			],
			__( 'Post comments feeds', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		$yform->toggle_switch(
			'remove_atom_rdf_feeds_free',
			[
				'off' => __( 'Keep', 'wordpress-seo' ),
				'on'  => __( 'Remove', 'wordpress-seo' ),
			],
			__( 'All Atom and RDF feeds', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);
	}

	/**
	 * Adds content to the Crawl Cleanup network tab.
	 *
	 * @param Yoast_Form $yform The yoast form object.
	 */
	public function add_crawl_settings_tab_content_network( $yform ) {
		$this->display_premium_upsell_btn();

		echo '<h3 class="yoast-feed-crawl-settings">';
		echo \esc_html__( 'Feed crawl settings', 'wordpress-seo' );
		echo '</h3>';

		$yform->toggle_switch(
			WPSEO_Option::ALLOW_KEY_PREFIX . 'remove_feed_global_free',
			[
				'on'  => __( 'Allow Control', 'wordpress-seo' ),
				'off' => __( 'Disable', 'wordpress-seo' ),
			],
			__( 'Global feed', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		$yform->toggle_switch(
			WPSEO_Option::ALLOW_KEY_PREFIX . 'remove_feed_global_comments_free',
			[
				'on'  => __( 'Allow Control', 'wordpress-seo' ),
				'off' => __( 'Disable', 'wordpress-seo' ),
			],
			__( 'Global comments feed', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		$yform->toggle_switch(
			WPSEO_Option::ALLOW_KEY_PREFIX . 'remove_feed_post_comments_free',
			[
				'on'  => __( 'Allow Control', 'wordpress-seo' ),
				'off' => __( 'Disable', 'wordpress-seo' ),
			],
			__( 'Post comments feeds', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);

		$yform->toggle_switch(
			WPSEO_Option::ALLOW_KEY_PREFIX . 'remove_atom_rdf_feeds_free',
			[
				'on'  => __( 'Allow Control', 'wordpress-seo' ),
				'off' => __( 'Disable', 'wordpress-seo' ),
			],
			__( 'All Atom and RDF feeds', 'wordpress-seo' ),
			'',
			[
				'disabled' => true,
			]
		);
	}

	/**
	 * Displays the Premium upsell button.
	 */
	public function display_premium_upsell_btn() {
		echo '<a class="yoast-button-upsell" href="';
		echo \esc_url( WPSEO_Shortlinker::get( 'http://yoa.st/crawl-settings-upsell' ) );
		echo '" target="_blank" style=" margin-top: 16px; margin-bottom: 16px; ">';

		$button_msg = ( $this->product_helper->is_premium() && ! $this->is_premium_upgraded() ) ? \esc_html__( 'Upgrade Premium', 'wordpress-seo' ) : \esc_html__( 'Unlock with Premium', 'wordpress-seo' );
		// phpcs:ignore WordPress.Security.EscapeOutput -- Already escaped.
		echo $button_msg
					// phpcs:ignore WordPress.Security.EscapeOutput -- Already escapes correctly.
					. WPSEO_Admin_Utils::get_new_tab_message();
		echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span></a>';
	}
}
