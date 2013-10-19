<?php
/**
 * @package Internals
 */

// Avoid direct calls to this file
if ( !function_exists( 'add_action' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSeo_Options' ) ) {
	/**
	 * @package WordPress\Plugins\WPSeo
	 * @subpackage Internals
	 * @version 1.4.19
	 */
	class WPSEO_Options {

		/**
		 * @static
		 * @var	array	Array of defaults for all the options the plugin uses
		 */
		static $defaults = array(
			'wpseo'					=> array(
			),
			'wpseo_permalinks'		=> array(
			),
			'wpseo_titles'			=> array(
			),
			'wpseo_rss'				=> array(
			),
			'wpseo_internallinks'	=> array(
			),
			'wpseo_xml'				=> array(
			),
			'wpseo_social'			=> array(
			),
		);
		
		
		
		/**
		 * Intelligently set/get the plugin settings property
		 *
		 * @static	bool|array	$original_settings	remember originally retrieved settings array for reference
		 * @param	array|null	$update				New settings to save to db - make sure the
		 *											new array is validated first!
		 * @return	void|bool	if an update took place: whether it worked
		 */
		private function _get_set_settings( $update = null ) {
			static $original_settings = false;
			$updated = null;

			/* Do we have something to update ? */
			if ( !is_null( $update ) ) {
				if ( $update !== $original_settings ) {
					$updated = update_option( self::SETTINGS_OPTION, $update );
					if ( $updated === true ) {
						$this->settings = $original_settings = $update;
					}
				}
				else {
					$updated = true; // no update necessary
				}
				return $updated;
			}

			/* No update received or update failed -> get the option from db */
			if ( ( is_null( $this->settings ) || false === $this->settings ) || ( false === is_array( $this->settings ) || 0 === count( $this->settings ) ) ) {
				// returns either the option array or false if option not found
				$option = get_option( self::SETTINGS_OPTION );

				if ( $option === false ) {
					// Option was not found, set settings to the defaults
					$option = $this->defaults;
				}
				else {
					// Otherwise merge with the defaults array to ensure all options are always set
					$option = wp_parse_args( $option, $this->defaults );
				}
				$this->settings = $original_settings = $option;
				unset( $option );
			}
			return;
		}


		static function get( $option_name ) {
		}
		

		/**
		 * Retrieve all the options for the SEO plugin in one go.
		 *
		 * @static
		 * @since 1.4.19
		 * @return array of options
		 */
		static function get_all() {
// @todo !!!! merge with defaults etc
/*			static $options;

			if ( !isset( $options ) ) {
				$options = array();
				foreach ( get_wpseo_options_arr() as $opt ) {
					$options = array_merge( $options, (array) get_option( $opt ) );
				}
			}
*/
			return $options;
		}

/**
 * Retrieve all the options for the SEO plugin in one go.
 *
 * @deprecated 1.4.19
 * @deprecated use WPSEO_Options::get_all()
 * @see WPSEO_Options::get_all()
 *
 * @return array of options
 */
function get_wpseo_options() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.4.19', 'WPSEO_Options::get_all()' );
	return WPSEO_Options::get_all();
}


		static function update( $option_name, $value ) {
		}

		static function set( $option_name, $value ) {
			self::update( $option_name, $value );
		}

		static function reset() {
		}

		static function clean_up() {
		}

		/**
		 * Retrieve an array of all the options the plugin uses. It can't use only one due to limitations of the options API.
		 *
		 * @static
		 * @since 1.4.19
		 * @return array of option names.
		 */
		static function get_option_names() {
			$option_names = array_keys( self::$defaults );
			return apply_filters( 'wpseo_options', $option_names );
		}
		
		
		
/* FROM: wordpress-seo\inc\wpseo-non-ajax-functions.php
/**
 * Set the default settings.
 *
 * This uses the currently available custom post types and taxonomies.
 */
function wpseo_defaults() {
	$options = get_option( 'wpseo' );
	if ( ! is_array( $options ) ) {
		$opt = array(
			'disableadvanced_meta' => 'on',
			'version'              => WPSEO_VERSION,
		);
		update_option( 'wpseo', $opt );

		// Test theme on activate
		wpseo_description_test();
	}
	else {
		// Re-check theme on re-activate
		wpseo_description_test();
		return;
	}

	if ( ! is_array( get_option( 'wpseo_titles' ) ) ) {
		$opt = array(
			'title-home'          => '%%sitename%% %%page%% %%sep%% %%sitedesc%%',
			'title-author'        => sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ',
			'title-archive'       => '%%date%% %%page%% %%sep%% %%sitename%%',
			'title-search'        => sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%',
			'title-404'           => __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%',
			'noindex-archive'     => 'on',
			'noindex-post_format' => 'on',
		);
		foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
			$opt['title-' . $pt->name] = '%%title%% %%page%% %%sep%% %%sitename%%';
			if ( $pt->has_archive )
				$opt['title-ptarchive-' . $pt->name] = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			$opt['title-' . $tax] = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		update_option( 'wpseo_titles', $opt );

		wpseo_title_test();
	}

	if ( ! is_array( get_option( 'wpseo_xml' ) ) ) {
		$opt = array(
			'enablexmlsitemap'                     => 'on',
			'post_types-attachment-not_in_sitemap' => true
		);
		update_option( 'wpseo_xml', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_social' ) ) ) {
		$opt = array(
			'opengraph' => 'on',
		);
		update_option( 'wpseo_social', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_rss' ) ) ) {
		$opt = array(
			'rssafter' => sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' ),
		);
		update_option( 'wpseo_rss', $opt );
	}

	if ( ! is_array( get_option( 'wpseo_permalinks' ) ) ) {
		$opt = array(
			'cleanslugs' => 'on',
		);
		update_option( 'wpseo_permalinks', $opt );
	}
	// Force WooThemes to use WordPress SEO data.
	if ( function_exists( 'woo_version_init' ) ) {
		update_option( 'seo_woo_use_third_party_data', 'true' );
	}

}
*/
	}
}