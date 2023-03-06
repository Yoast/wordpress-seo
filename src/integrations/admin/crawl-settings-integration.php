<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Option;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
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
	 * Holds the settings + labels for unused resources settings.
	 *
	 * @var array
	 */
	private $unused_resources_settings;

	/**
	 * The shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Crawl_Settings_Integration constructor.
	 *
	 * @param Options_Helper    $options_helper The options helper.
	 * @param WPSEO_Shortlinker $shortlinker    The shortlinker.
	 */
	public function __construct( Options_Helper $options_helper, WPSEO_Shortlinker $shortlinker ) {
		$this->options_helper = $options_helper;
		$this->shortlinker    = $shortlinker;
	}

	/**
	 * Registers an action to add a new tab to the General page.
	 */
	public function register_hooks() {
		$this->register_setting_labels();

		\add_action( 'wpseo_settings_tab_crawl_cleanup_internal', [ $this, 'add_crawl_settings_tab_content' ] );
		\add_action( 'wpseo_settings_tab_crawl_cleanup_network', [ $this, 'add_crawl_settings_tab_content_network' ] );
	}

	/**
	 * Enqueue the workouts app.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_dashboard' ) {
			return;
		}

		\wp_enqueue_script( 'wp-seo-premium-crawl-settings' );
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
			'remove_pingback_header'   => \__( 'Pingback HTTP header', 'wordpress-seo' ),
			'remove_powered_by_header' => \__( 'Powered by HTTP header', 'wordpress-seo' ),
		];

		$this->permalink_cleanup_settings = [
			'clean_campaign_tracking_urls' => \__( 'Campaign tracking URL parameters', 'wordpress-seo' ),
			'clean_permalinks'             => \__( 'Unregistered URL parameters', 'wordpress-seo' ),
		];

		$this->search_cleanup_settings = [
			'search_cleanup'              => \__( 'Filter search terms', 'wordpress-seo' ),
			'search_cleanup_emoji'        => \__( 'Filter searches with emojis and other special characters', 'wordpress-seo' ),
			'search_cleanup_patterns'     => \__( 'Filter searches with common spam patterns', 'wordpress-seo' ),
			'deny_search_crawling'        => \__( 'Prevent search engines from crawling site search URLs', 'wordpress-seo' ),
			'redirect_search_pretty_urls' => \__( 'Redirect pretty URLs for search pages to raw format', 'wordpress-seo' ),
		];

		$this->unused_resources_settings = [
			'remove_emoji_scripts'  => \__( 'Emoji scripts', 'wordpress-seo' ),
			'deny_wp_json_crawling' => \__( 'Prevent search engines from crawling /wp-json/', 'wordpress-seo' ),
		];
	}

	/**
	 * Adds content to the Crawl Cleanup tab.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Form $yform The yoast form object.
	 */
	public function add_crawl_settings_tab_content( $yform ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );
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
	 * @param Yoast_Form $yform      The Yoast form class.
	 * @param bool       $is_network Whether we're on the network site.
	 *
	 * @return void
	 */
	private function add_crawl_settings( $yform, $is_network ) {
		$this->print_toggles( $this->basic_settings, $yform, $is_network, \__( 'Basic crawl settings', 'wordpress-seo' ), \__( 'Remove links added by WordPress to the header and &lt;head&gt;.', 'wordpress-seo' ) );

		$this->print_toggles( $this->feed_settings, $yform, $is_network, \__( 'Feed crawl settings', 'wordpress-seo' ), \__( "Remove feed links added by WordPress that aren't needed for this site.", 'wordpress-seo' ) );
		$this->print_toggles( $this->unused_resources_settings, $yform, $is_network, \__( 'Remove unused resources', 'wordpress-seo' ), \__( 'WordPress loads lots of resources, some of which your site might not need. If you’re not using these, removing them can speed up your pages and save resources.', 'wordpress-seo' ) );

		$first_search_setting    = \array_slice( $this->search_cleanup_settings, 0, 1 );
		$rest_search_settings    = \array_slice( $this->search_cleanup_settings, 1 );
		$search_settings_toggles = [
			'off' => \__( 'Disabled', 'wordpress-seo' ),
			'on'  => \__( 'Enabled', 'wordpress-seo' ),
		];

		$this->print_toggles( $first_search_setting, $yform, $is_network, \__( 'Search cleanup settings', 'wordpress-seo' ), \__( 'Clean up and filter searches to prevent search spam.', 'wordpress-seo' ), $search_settings_toggles );

		if ( ! $is_network ) {
			echo '<div id="search_character_limit_container" class="yoast-crawl-single-setting">';
			$yform->number(
				'search_character_limit',
				\__( 'Max number of characters to allow in searches', 'wordpress-seo' ),
				[
					'min' => 1,
					'max' => 1000,
				]
			);
			echo '</div>';
		}

		$this->print_toggles( $rest_search_settings, $yform, $is_network, '', '', $search_settings_toggles );

		$permalink_warning = \sprintf(
		/* Translators: %1$s expands to an opening anchor tag for a link leading to the Yoast SEO page of the Permalink Cleanup features, %2$s expands to a closing anchor tag. */
			\esc_html__(
				'These are expert features, so make sure you know what you\'re doing before removing the parameters. %1$sRead more about how your site can be affected%2$s.',
				'wordpress-seo'
			),
			'<a href="' . \esc_url( $this->shortlinker->build_shortlink( 'https://yoa.st/permalink-cleanup' ) ) . '" target="_blank" rel="noopener noreferrer">',
			'</a>'
		);


		$this->print_toggles( $this->permalink_cleanup_settings, $yform, $is_network, \__( 'Permalink cleanup settings', 'wordpress-seo' ), \__( 'Remove unwanted URL parameters from your URLs.', 'wordpress-seo' ), [], $permalink_warning );

		if ( ! $is_network && ! empty( \get_option( 'permalink_structure' ) ) ) {
			echo '<div id="clean_permalinks_extra_variables_container" class="yoast-crawl-single-setting">';
			$yform->textinput( 'clean_permalinks_extra_variables', \__( 'Additional URL parameters to allow', 'wordpress-seo' ) );
			echo '<p class="desc label yoast-extra-variables-label">';
			\esc_html_e( 'Please use a comma to separate multiple URL parameters.', 'wordpress-seo' );
			echo '</p>';
			echo '</div>';
		}
		else {
			// Also add the original option as hidden, so as not to lose any values if it's disabled and the form is saved.
			$yform->hidden( 'clean_permalinks_extra_variables', 'clean_permalinks_extra_variables' );
		}
	}

	/**
	 * Prints a list of toggles for an array of settings with labels.
	 *
	 * @param array      $settings    The settings being displayed.
	 * @param Yoast_Form $yform       The Yoast form class.
	 * @param bool       $is_network  Whether we're on the network site.
	 * @param string     $title       Optional title for the settings being displayed.
	 * @param string     $description Optional description of the settings being displayed.
	 * @param array      $toggles     Optional naming of the toggle buttons.
	 * @param string     $warning     Optional warning to be displayed above the toggles.
	 *
	 * @return void
	 */
	private function print_toggles( array $settings, Yoast_Form $yform, $is_network = false, $title = '', $description = '', $toggles = [], $warning = '' ) {
		if ( ! empty( $title ) ) {
			echo '<h3 class="yoast-crawl-settings">', \esc_html( $title ), '</h3>';
		}
		if ( ! $is_network && ! empty( $description ) ) {
			echo '<p class="yoast-crawl-settings-explanation">', \esc_html( $description ), '</p>';
		}

		if ( ! empty( $warning ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output escaped in Alert_Presenter.
			echo new Alert_Presenter( $warning, 'warning' );
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
			$toggles        = [
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'on'  => \__( 'Allow Control', 'wordpress-seo' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Reason: text is originally from Yoast SEO.
				'off' => \__( 'Disable', 'wordpress-seo' ),
			];
		}

		foreach ( $settings as $setting => $label ) {
			$attr     = [];
			$variable = $setting_prefix . $setting;

			if ( $this->should_feature_be_disabled_permalink( $setting, $is_network ) ) {
				$attr     = [
					'disabled' => true,
				];
				$variable = $setting_prefix . $setting . '_disabled';

				// Also add the original option as hidden, so as not to lose any values if it's disabled and the form is saved.
				$yform->hidden( $setting_prefix . $setting, $setting_prefix . $setting );
			}
			elseif ( $this->should_feature_be_disabled_multisite( $setting ) ) {
				$attr = [
					'disabled'                => true,
					'preserve_disabled_value' => false,
				];
			}

			$yform->toggle_switch(
				$variable,
				$toggles,
				$label,
				'',
				$attr
			);
			if ( $setting === 'remove_feed_global_comments' && ! $is_network ) {
				echo '<p class="yoast-crawl-settings-help">';
				echo \esc_html__( 'By removing Global comments feed, Post comments feeds will be removed too.', 'wordpress-seo' );
				echo '</p>';
			}
			if ( $this->should_feature_be_disabled_permalink( $setting, $is_network ) ) {
				echo '<p class="yoast-crawl-settings-help">';
				if ( \current_user_can( 'manage_options' ) ) {
					echo \sprintf(
					/* translators: 1: Link start tag to the Permalinks settings page, 2: Link closing tag. */
						\esc_html__( 'This feature is disabled when your site is not using %1$spretty permalinks%2$s.', 'wordpress-seo' ),
						'<a href="' . \esc_url( \admin_url( 'options-permalink.php' ) ) . '">',
						'</a>'
					);
				}
				else {
					echo \esc_html__( 'This feature is disabled when your site is not using pretty permalinks.', 'wordpress-seo' );
				}
				echo '</p>';
			}
			elseif ( $this->should_feature_be_disabled_multisite( $setting ) ) {
				echo '<p>';
				\esc_html_e( 'This feature is not available for multisites.', 'wordpress-seo' );
				echo '</p>';
			}
		}
	}

	/**
	 * Checks if the feature should be disabled due to non-pretty permalinks.
	 *
	 * @param string $setting    The setting to be displayed.
	 * @param bool   $is_network Whether we're on the network site.
	 *
	 * @return bool
	 */
	protected function should_feature_be_disabled_permalink( $setting, $is_network ) {
		return (
			\in_array( $setting, [ 'clean_permalinks', 'clean_campaign_tracking_urls' ], true )
			&& ! $is_network
			&& empty( \get_option( 'permalink_structure' ) )
			&& ! $this->is_control_disabled( $setting )
		);
	}

	/**
	 * Checks if the feature should be disabled due to the site being a multisite.
	 *
	 * @param string $setting The setting to be displayed.
	 *
	 * @return bool
	 */
	protected function should_feature_be_disabled_multisite( $setting ) {
		return (
			\in_array( $setting, [ 'deny_search_crawling', 'deny_wp_json_crawling' ], true )
			&& \is_multisite()
		);
	}

	/**
	 * Checks whether a given control should be disabled, because of the network admin.
	 *
	 * @param string $variable The variable within the option to check whether its control should be disabled.
	 *
	 * @return bool True if control should be disabled, false otherwise.
	 */
	protected function is_control_disabled( $variable ) {
		return ! $this->options_helper->get( 'allow_' . $variable, true );
	}
}
