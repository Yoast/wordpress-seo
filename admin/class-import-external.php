<?php
/**
 * @package    WPSEO
 * @subpackage Import_External
 */

/**
 * class WPSEO_Import
 *
 * Class with functionality to import WP SEO settings from other plugins
 */
class WPSEO_Import_External {

	/**
	 * Whether or not to delete old data
	 *
	 * @var bool
	 */
	private $replace;

	/**
	 * Message about the import
	 *
	 * @var string
	 */
	public $msg = '';

	/**
	 * Class constructor
	 *
	 * @param bool $replace
	 */
	public function __construct( $replace = false ) {
		$this->replace = $replace;

		WPSEO_Options::initialize();
	}

	/**
	 * Convenience function to set import message
	 *
	 * @param string $msg
	 */
	private function set_msg( $msg ) {
		if ( ! empty( $this->msg ) ) {
			$this->msg .= PHP_EOL;
		}
		$this->msg .= $msg;
	}

	/**
	 * Import WooThemes SEO settings
	 */
	public function import_woothemes_seo() {
		$sep     = get_option( 'seo_woo_seperator' );
		$options = get_option( 'wpseo_titles' );

		switch ( get_option( 'seo_woo_home_layout' ) ) {
			case 'a':
				$options['title-home-wpseo'] = '%%sitename%% ' . $sep . ' %%sitedesc%%';
				break;
			case 'b':
				$options['title-home-wpseo'] = '%%sitename%% ' . get_option( 'seo_woo_paged_var' ) . ' %%pagenum%%';
				break;
			case 'c':
				$options['title-home-wpseo'] = '%%sitedesc%%';
				break;
		}
		if ( $this->replace ) {
			delete_option( 'seo_woo_home_layout' );
		}

		switch ( get_option( 'seo_woo_single_layout' ) ) {
			case 'a':
				$options['title-post'] = '%%title%% ' . $sep . ' %%sitename%%';
				break;
			case 'b':
				$options['title-post'] = '%%title%%';
				break;
			case 'c':
				$options['title-post'] = '%%sitename%% ' . $sep . ' %%title%%';
				break;
			case 'd':
				$options['title-post'] = '%%title%% ' . $sep . ' %%sitedesc%%';
				break;
			case 'e':
				$options['title-post'] = '%%sitename%% ' . $sep . ' %%title%% ' . $sep . ' %%sitedesc%%';
				break;
		}
		if ( $this->replace ) {
			delete_option( 'seo_woo_single_layout' );
		}

		switch ( get_option( 'seo_woo_page_layout' ) ) {
			case 'a':
				$options['title-page'] = '%%title%% ' . $sep . ' %%sitename%%';
				break;
			case 'b':
				$options['title-page'] = '%%title%%';
				break;
			case 'c':
				$options['title-page'] = '%%sitename%% ' . $sep . ' %%title%%';
				break;
			case 'd':
				$options['title-page'] = '%%title%% ' . $sep . ' %%sitedesc%%';
				break;
			case 'e':
				$options['title-page'] = '%%sitename%% ' . $sep . ' %%title%% ' . $sep . ' %%sitedesc%%';
				break;
		}
		if ( $this->replace ) {
			delete_option( 'seo_woo_page_layout' );
		}

		$template = WPSEO_Options::get_default( 'wpseo_titles', 'title-tax-post' ); // the default is the same for all taxonomies, so post will do
		switch ( get_option( 'seo_woo_archive_layout' ) ) {
			case 'a':
				$template = '%%term_title%% ' . $sep . ' %%page%% ' . $sep . ' %%sitename%%';
				break;
			case 'b':
				$template = '%%term_title%%';
				break;
			case 'c':
				$template = '%%sitename%% ' . $sep . ' %%term_title%% ' . $sep . ' %%page%%';
				break;
			case 'd':
				$template = '%%term_title%% ' . $sep . ' %%page%%' . $sep . ' %%sitedesc%%';
				break;
			case 'e':
				$template = '%%sitename%% ' . $sep . ' %%term_title%% ' . $sep . ' %%page%% ' . $sep . ' %%sitedesc%%';
				break;
		}
		$taxonomies = get_taxonomies( array( 'public' => true ), 'names' );
		if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
			foreach ( $taxonomies as $tax ) {
				$options[ 'title-tax-' . $tax ] = $template;
			}
		}
		unset( $taxonomies, $tax, $template );
		if ( $this->replace ) {
			delete_option( 'seo_woo_archive_layout' );
		}

		// Import the custom homepage description
		if ( 'c' == get_option( 'seo_woo_meta_home_desc' ) ) {
			$options['metadesc-home-wpseo'] = get_option( 'seo_woo_meta_home_desc_custom' );
		}
		if ( $this->replace ) {
			delete_option( 'seo_woo_meta_home_desc' );
		}

		// Import the custom homepage keywords
		if ( 'c' == get_option( 'seo_woo_meta_home_key' ) ) {
			$options['metakey-home-wpseo'] = get_option( 'seo_woo_meta_home_key_custom' );
		}
		if ( $this->replace ) {
			delete_option( 'seo_woo_meta_home_key' );
		}

		// If WooSEO is set to use the Woo titles, import those
		if ( 'true' == get_option( 'seo_woo_wp_title' ) ) {
			WPSEO_Meta::replace_meta( 'seo_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );
		}

		// If WooSEO is set to use the Woo meta descriptions, import those
		if ( 'b' == get_option( 'seo_woo_meta_single_desc' ) ) {
			WPSEO_Meta::replace_meta( 'seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		}

		// If WooSEO is set to use the Woo meta keywords, import those
		if ( 'b' == get_option( 'seo_woo_meta_single_key' ) ) {
			WPSEO_Meta::replace_meta( 'seo_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $this->replace );
		}

		/* @todo [JRF => whomever] verify how WooSEO sets these metas ( 'noindex', 'follow' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2) */
		WPSEO_Meta::replace_meta( 'seo_follow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $this->replace );
		WPSEO_Meta::replace_meta( 'seo_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $this->replace );

		update_option( 'wpseo_titles', $options );
		$this->set_msg( __( 'WooThemes SEO framework settings &amp; data successfully imported.', 'wordpress-seo' ) );
	}

	/**
	 * Import HeadSpace SEO settings
	 */
	public function import_headspace() {
		global $wpdb;

		WPSEO_Meta::replace_meta( '_headspace_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_page_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );
		/* @todo [JRF => whomever] verify how headspace sets these metas ( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2) */
		WPSEO_Meta::replace_meta( '_headspace_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $this->replace );

		/* @todo - [JRF => whomever] check if this can be done more efficiently by querying only the meta table
		 * possibly directly changing it using concat on the existing values
		 */
		$posts = $wpdb->get_results( "SELECT ID FROM $wpdb->posts" );
		if ( is_array( $posts ) && $posts !== array() ) {
			foreach ( $posts as $post ) {
				$custom         = get_post_custom( $post->ID );
				$robotsmeta_adv = '';
				if ( isset( $custom['_headspace_noarchive'] ) ) {
					$robotsmeta_adv .= 'noarchive,';
				}
				if ( isset( $custom['_headspace_noodp'] ) ) {
					$robotsmeta_adv .= 'noodp,';
				}
				if ( isset( $custom['_headspace_noydir'] ) ) {
					$robotsmeta_adv .= 'noydir';
				}
				$robotsmeta_adv = preg_replace( '`,$`', '', $robotsmeta_adv );
				WPSEO_Meta::set_value( 'meta-robots-adv', $robotsmeta_adv, $post->ID );
			}
		}

		if ( $this->replace ) {
			$hs_meta = array( 'noarchive', 'noodp', 'noydir' );
			foreach ( $hs_meta as $meta ) {
				delete_post_meta_by_key( '_headspace_' . $meta );
			}
			unset( $hs_meta, $meta );
		}
		$this->set_msg( __( 'HeadSpace2 data successfully imported', 'wordpress-seo' ) );
	}

	/**
	 * Import All In One SEO settings
	 */
	public function import_aioseo() {
		WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $this->replace );
		WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );
		$options_aiosep = get_option( 'aioseop_options' );

		if ( isset( $options_aiosep['aiosp_google_analytics_id'] ) ) {
			/**
			 * The Google Analytics settings are used
			 */
			$ga_universal     = 0;
			$ga_trackoutbound = 0;
			$ga_anomip        = 0;

			if ( $options_aiosep['aiosp_ga_use_universal_analytics'] == 'on' ) {
				$ga_universal = 1;
			}
			if ( $options_aiosep['aiosp_ga_track_outbound_links'] == 'on' ) {
				$ga_trackoutbound = 1;
			}
			if ( $options_aiosep['aiosp_ga_anonymize_ip'] == 'on' ) {

			}

			$ga_settings = array(
				'manual_ua_code'       => (int) 1,
				'manual_ua_code_field' => $options_aiosep['aiosp_google_analytics_id'],
				'enable_universal'     => (int) $ga_universal,
				'track_outbound'       => (int) $ga_trackoutbound,
				'ignore_users'         => (array) $options_aiosep['aiosp_ga_exclude_users'],
				'anonymize_ips'        => (int) $ga_anomip,
			);

			if ( get_option( 'yst_ga' ) == false ) {
				$options['ga_general'] = $ga_settings;
				update_option( 'yst_ga', $options );
			}

			$plugin_install_nonce = wp_create_nonce( 'install-plugin_google-analytics-for-wordpress' ); // Use the old name because that's the WordPress.org repo

			$this->set_msg( __( sprintf(
				'All in One SEO data successfully imported. Would you like to %sdisable the All in One SEO plugin%s. You\'ve had Google Analytics enabled in All in One SEO, would you like to install our %sGoogle Analytics plugin%s?',
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_aioseo=1' ) ) . '">',
				'</a>',
				'<a href="' . esc_url( admin_url( 'update.php?action=install-plugin&plugin=google-analytics-for-wordpress&_wpnonce=' . $plugin_install_nonce ) ) . '">',
				'</a>'
			), 'wordpress-seo' ) );
		}
		else {
			$this->set_msg( __( sprintf( 'All in One SEO data successfully imported. Would you like to %sdisable the All in One SEO plugin%s.', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_aioseo=1' ) ) . '">', '</a>' ), 'wordpress-seo' ) );
		}
	}

	/**
	 * Import from Joost's old robots meta plugin
	 */
	public function import_robots_meta() {
		global $wpdb;

		$posts = $wpdb->get_results( "SELECT ID, robotsmeta FROM $wpdb->posts" );

		if ( ! $posts ) {
			$this->set_msg( __( 'Error: no Robots Meta data found to import.', 'wordpress-seo' ) );
			return;
		}
		if ( is_array( $posts ) && $posts !== array() ) {
			foreach ( $posts as $post ) {
				// sync all possible settings
				if ( $post->robotsmeta ) {
					$pieces = explode( ',', $post->robotsmeta );
					foreach ( $pieces as $meta ) {
						switch ( $meta ) {
							case 'noindex':
								WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post->ID );
								break;

							case 'index':
								WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post->ID );
								break;

							case 'nofollow':
								WPSEO_Meta::set_value( 'meta-robots-nofollow', '1', $post->ID );
								break;
						}
					}
				}
			}
		}
		$this->set_msg( __( sprintf( 'Robots Meta values imported. We recommend %sdisabling the Robots-Meta plugin%s to avoid any conflicts.', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_robots_meta=1' ) ) . '">', '</a>' ), 'wordpress-seo' ) );
	}

	/**
	 * Import from old Yoast RSS Footer plugin
	 */
	public function import_rss_footer() {
		$optold = get_option( 'RSSFooterOptions' );
		$optnew = get_option( 'wpseo_rss' );
		if ( $optold['position'] == 'after' ) {
			if ( $optnew['rssafter'] === '' || $optnew['rssafter'] === WPSEO_Options::get_default( 'wpseo_rss', 'rssafter' ) ) {
				$optnew['rssafter'] = $optold['footerstring'];
			}
		}
		else {
			/* @internal Uncomment the second part if a default would be given to the rssbefore value */
			if ( $optnew['rssbefore'] === '' /*|| $optnew['rssbefore'] === WPSEO_Options::get_default( 'wpseo_rss', 'rssbefore' )*/ ) {
				$optnew['rssbefore'] = $optold['footerstring'];
			}
		}
		update_option( 'wpseo_rss', $optnew );
		$this->set_msg( __( 'RSS Footer options imported successfully.', 'wordpress-seo' ) );
	}

	/**
	 * Import from Yoast Breadcrumbs plugin
	 */
	public function import_yoast_breadcrumbs() {
		$optold = get_option( 'yoast_breadcrumbs' );
		$optnew = get_option( 'wpseo_internallinks' );

		if ( is_array( $optold ) && $optold !== array() ) {
			foreach ( $optold as $opt => $val ) {
				if ( is_bool( $val ) && $val == true ) {
					$optnew[ 'breadcrumbs-' . $opt ] = true;
				} else {
					$optnew[ 'breadcrumbs-' . $opt ] = $val;
				}
			}
			unset( $opt, $val );
			update_option( 'wpseo_internallinks', $optnew );
			$this->set_msg( __( 'Yoast Breadcrumbs options imported successfully.', 'wordpress-seo' ) );
		} else {
			$this->set_msg( __( 'Yoast Breadcrumbs options could not be found', 'wordpress-seo' ) );
		}
	}
}