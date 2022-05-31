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
	 * Holds the settings + labels for the feeds clean up.
	 *
	 * @var array
	 */
	private $feed_settings;

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
		$this->register_setting_labels();

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
	 * Connects the settings to their labels.
	 *
	 * @return void
	 */
	private function register_setting_labels() {
		$this->feed_settings = [
			'remove_feed_global_free'            => \__( 'Global feed', 'wordpress-seo' ),
			'remove_feed_global_comments_free'   => \__( 'Global comment feeds', 'wordpress-seo' ),
			'remove_feed_post_comments_free'     => \__( 'Post comments feeds', 'wordpress-seo' ),
			'remove_feed_post_types_free'        => \__( 'Post type feeds', 'wordpress-seo' ),
			'remove_feed_authors_free'           => \__( 'Post authors feeds', 'wordpress-seo' ),
			'remove_feed_categories_free'        => \__( 'Category feeds', 'wordpress-seo' ),
			'remove_feed_tags_free'              => \__( 'Tag feeds', 'wordpress-seo' ),
			'remove_feed_custom_taxonomies_free' => \__( 'Custom taxonomy feeds', 'wordpress-seo' ),
			'remove_feed_search_free'            => \__( 'Search results feeds', 'wordpress-seo' ),
			'remove_atom_rdf_feeds_free'         => \__( 'Atom/RDF feeds', 'wordpress-seo' ),
		];
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

		echo '<h3 class="yoast-feed-crawl-settings-free">';
		echo \esc_html__( 'Feed crawl settings', 'wordpress-seo' );
		echo '</h3>';

		$this->add_crawl_settings( $yform, false );
	}

	/**
	 * Adds content to the Crawl Cleanup network tab.
	 *
	 * @param Yoast_Form $yform The yoast form object.
	 */
	public function add_crawl_settings_tab_content_network( $yform ) {
		$this->display_premium_upsell_btn();

		echo '<h3 class="yoast-feed-crawl-settings-free">';
		echo \esc_html__( 'Feed crawl settings', 'wordpress-seo' );
		echo '</h3>';

		$this->add_crawl_settings( $yform, true );
	}

	/**
	 * Print the settings sections.
	 *
	 * @param Yoast_Form $yform  The Yoast form class.
	 * @param boolean    $prefix Whether to prefix options with the allow prefix or not.
	 *
	 * @return void
	 */
	private function add_crawl_settings( $yform, $prefix ) {
		$this->print_toggles( $this->feed_settings, $yform, $prefix );
	}

	/**
	 * Prints a list of toggles for an array of settings with labels.
	 *
	 * @param array      $settings     The settings being displayed.
	 * @param Yoast_Form $yform        The Yoast form class.
	 * @param boolean    $allow_prefix Whether we should prefix with the allow key.
	 *
	 * @return void
	 */
	private function print_toggles( array $settings, Yoast_Form $yform, $allow_prefix ) {
		$setting_prefix = '';
		$toggles        = [
			'off' => __( 'Keep', 'wordpress-seo' ),
			'on'  => __( 'Remove', 'wordpress-seo' ),
		];

		if ( $allow_prefix ) {
			$setting_prefix = WPSEO_Option::ALLOW_KEY_PREFIX;
			$toggles        = [
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'on'  => __( 'Allow Control', 'wordpress-seo' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'off' => __( 'Disable', 'wordpress-seo' ),
			];
		}
		foreach ( $settings as $setting => $label ) {
			$yform->toggle_switch(
				$setting_prefix . $setting,
				$toggles,
				$label,
				'',
				[
					'disabled' => true,
				]
			);
			if ( $setting === 'remove_feed_global_comments_free' && ! $allow_prefix ) {
				echo '<p class="yoast-global-comments-feed-help-free">';
				echo \esc_html__( 'By removing Global comments feed, Post comments feeds will be removed too.', 'wordpress-seo' );
				echo '</p>';
			}
		}
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
