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
	 * Holds the settings + labels for the head clean up piece.
	 *
	 * @var array
	 */
	private $basic_settings;

	/**
	 * Holds the settings + labels for the feeds clean up.
	 *
	 * @var array
	 */
	private $feed_settings;

	/**
	 * Holds the settings + labels for permalink cleanup settings.
	 *
	 * @var array
	 */
	private $permalink_cleanup_settings;

	/**
	 * Holds the settings + labels for search cleanup settings.
	 *
	 * @var array
	 */
	private $search_cleanup_settings;

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
			'remove_feed_global'            => \__( 'Global feed', 'wordpress-seo' ),
			'remove_feed_global_comments'   => \__( 'Global comment feeds', 'wordpress-seo' ),
			'remove_feed_post_comments'     => \__( 'Post comments feeds', 'wordpress-seo' ),
			'remove_feed_authors'           => \__( 'Post authors feeds', 'wordpress-seo' ),
			'remove_feed_post_types'        => \__( 'Post type feeds', 'wordpress-seo' ),
			'remove_feed_categories'        => \__( 'Category feeds', 'wordpress-seo' ),
			'remove_feed_tags'              => \__( 'Tag feeds', 'wordpress-seo' ),
			'remove_feed_custom_taxonomies' => \__( 'Custom taxonomy feeds', 'wordpress-seo' ),
			'remove_feed_search'            => \__( 'Search results feeds', 'wordpress-seo' ),
			'remove_atom_rdf_feeds'         => \__( 'Atom/RDF feeds', 'wordpress-seo' ),
		];

		$this->basic_settings = [
			'remove_shortlinks'        => \__( 'Shortlinks', 'wordpress-seo' ),
			'remove_rest_api_links'    => \__( 'REST API links', 'wordpress-seo' ),
			'remove_rsd_wlw_links'     => \__( 'RSD / WLW links', 'wordpress-seo' ),
			'remove_oembed_links'      => \__( 'oEmbed links', 'wordpress-seo' ),
			'remove_generator'         => \__( 'Generator tag', 'wordpress-seo' ),
			'remove_emoji_scripts'     => \__( 'Emoji scripts', 'wordpress-seo' ),
			'remove_pingback_header'   => \__( 'Pingback HTTP header', 'wordpress-seo' ),
			'remove_powered_by_header' => \__( 'Powered by HTTP header', 'wordpress-seo' ),
		];

		$this->permalink_cleanup_settings = [
			'clean_campaign_tracking_urls' => \__( 'Campaign tracking URL parameters', 'wordpress-seo' ),
			'clean_permalinks'             => \__( 'Unregistered URL parameters', 'wordpress-seo' ),
		];

		$this->search_cleanup_settings = [
			'search_cleanup'          => \__( 'Filter search terms', 'wordpress-seo' ),
			'search_cleanup_emoji'    => \__( 'Filter searches with emoji', 'wordpress-seo' ),
			'search_cleanup_patterns' => \__( 'Filter searches with common spam patterns', 'wordpress-seo' ),
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
		$this->add_crawl_settings( $yform, false );
	}

	/**
	 * Adds content to the Crawl Cleanup network tab.
	 *
	 * @param Yoast_Form $yform The yoast form object.
	 */
	public function add_crawl_settings_tab_content_network( $yform ) {
		$this->add_crawl_settings( $yform, true );
	}

	/**
	 * Print the settings sections.
	 *
	 * @param Yoast_Form $yform        The Yoast form class.
	 * @param boolean    $is_network   Whether we're on the network site.
	 *
	 * @return void
	 */
	private function add_crawl_settings( $yform, $is_network ) {
		$this->display_premium_upsell_btn();

		$this->print_toggles( $this->basic_settings, $yform, $is_network, \__( 'Basic crawl settings', 'wordpress-seo' ), \__( 'Remove links added by WordPress to the header and &lt;head&gt;.', 'wordpress-seo' ) );
		$this->print_toggles( $this->feed_settings, $yform, $is_network, \__( 'Feed crawl settings', 'wordpress-seo' ), \__( "Remove feed links added by WordPress that aren't needed for this site.", 'wordpress-seo' ) );

		$first_search_setting    = \array_slice( $this->search_cleanup_settings, 0, 1 );
		$rest_search_settings    = \array_slice( $this->search_cleanup_settings, 1 );
		$search_settings_toggles = [
			'off' => \__( 'Disabled', 'wordpress-seo' ),
			'on'  => \__( 'Enabled', 'wordpress-seo' ),
		];

		$this->print_toggles( $first_search_setting, $yform, $is_network, \__( 'Search cleanup settings', 'wordpress-seo' ), \__( 'Clean up and filter searches to prevent search spam.', 'wordpress-seo' ), $search_settings_toggles );

		if ( ! $is_network ) {
			$yform->number(
				'search_character_limit_free',
				\__( 'Max number of characters to allow in searches', 'wordpress-seo' ),
				[
					'min'      => 1,
					'max'      => 1000,
					'disabled' => true,
				]
			);
			$yform->hidden( 'search_character_limit', 'search_character_limit' );
		}

		$this->print_toggles( $rest_search_settings, $yform, $is_network, '', '', $search_settings_toggles );

		$this->print_toggles( $this->permalink_cleanup_settings, $yform, $is_network, \__( 'Permalink cleanup settings', 'wordpress-seo' ), \__( 'Remove unwanted URL parameters from your URLs.', 'wordpress-seo' ) );

		if ( ! $is_network ) {
			$yform->textinput(
				'clean_permalinks_extra_variables_free',
				\__( 'Additional URL parameters to allow', 'wordpress-seo' ),
				[
					'disabled' => true,
				]
			);
			$yform->hidden( 'clean_permalinks_extra_variables', 'clean_permalinks_extra_variables' );
		}
	}

	/**
	 * Prints a list of toggles for an array of settings with labels.
	 *
	 * @param array      $settings     The settings being displayed.
	 * @param Yoast_Form $yform        The Yoast form class.
	 * @param boolean    $is_network   Whether we're on the network site.
	 * @param string     $title        Optional title for the settings being displayed.
	 * @param string     $description  Optional description of the settings being displayed.
	 * @param array      $toggles      Optional naming of the toggle buttons.
	 *
	 * @return void
	 */
	private function print_toggles( array $settings, Yoast_Form $yform, $is_network, $title = '', $description = '', $toggles = [] ) {
		if ( ! empty( $title ) ) {
			echo '<h3 class="yoast-crawl-settings-free">', \esc_html( $title ), '</h3>';
		}
		if ( ! $is_network && ! empty( $description ) ) {
			echo '<p class="yoast-crawl-settings-explanation-free">', \esc_html( $description ), '</p>';
		}

		if ( empty( $toggles ) ) {
			$toggles = [
				'off' => \__( 'Keep', 'wordpress-seo' ),
				'on'  => \__( 'Remove', 'wordpress-seo' ),
			];
		}

		$setting_prefix = '';

		if ( $is_network ) {
			$setting_prefix = WPSEO_Option::ALLOW_KEY_PREFIX;
			// NOTE: the off/on labels here are flipped from their actual would-be values in premium for cosmetic reasons and limitations with disabled toggles.
			$toggles = [
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'off' => __( 'Allow Control', 'wordpress-seo' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'on'  => __( 'Disable', 'wordpress-seo' ),
			];
		}
		foreach ( $settings as $setting => $label ) {
			$yform->toggle_switch(
				$setting_prefix . $setting . '_free',
				$toggles,
				$label,
				'',
				[
					'disabled' => true,
				]
			);
			if ( $setting === 'remove_feed_global_comments_free' && ! $is_network ) {
				echo '<p class="yoast-global-comments-feed-help-free">';
				echo \esc_html__( 'By removing Global comments feed, Post comments feeds will be removed too.', 'wordpress-seo' );
				echo '</p>';
			}

			$setting_name = $setting_prefix . $setting;
			$yform->hidden( $setting_name, $setting_name );
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
