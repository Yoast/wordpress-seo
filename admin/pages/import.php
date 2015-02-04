<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * @todo [JRF => testers] Extensively test the export & import of the (new) settings!
 * If that all works fine, getting testers to export before and after upgrade will make testing easier.
 *
 * @todo [Yoast] The import for the RSS Footer plugin checks for data already entered via WP SEO,
 * the other import routines should do that too.
 */

global $wpseo_admin_pages;

$msg = '';
if ( isset( $_POST['import'] ) || isset( $_GET['import'] ) ) {

	check_admin_referer( 'wpseo-import' );

	global $wpdb;
	$replace  = false;
	$deletekw = false;

	if ( isset( $_POST['wpseo']['deleteolddata'] ) && $_POST['wpseo']['deleteolddata'] == 'on' ) {
		$replace = true;
	}

	if ( isset( $_POST['wpseo']['importwoo'] ) ) {
		WPSEO_Options::initialize();

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
		if ( $replace ) {
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
		if ( $replace ) {
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
		if ( $replace ) {
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
		if ( $replace ) {
			delete_option( 'seo_woo_archive_layout' );
		}

		// Import the custom homepage description
		if ( 'c' == get_option( 'seo_woo_meta_home_desc' ) ) {
			$options['metadesc-home-wpseo'] = get_option( 'seo_woo_meta_home_desc_custom' );
		}
		if ( $replace ) {
			delete_option( 'seo_woo_meta_home_desc' );
		}

		// Import the custom homepage keywords
		if ( 'c' == get_option( 'seo_woo_meta_home_key' ) ) {
			$options['metakey-home-wpseo'] = get_option( 'seo_woo_meta_home_key_custom' );
		}
		if ( $replace ) {
			delete_option( 'seo_woo_meta_home_key' );
		}

		// If WooSEO is set to use the Woo titles, import those
		if ( 'true' == get_option( 'seo_woo_wp_title' ) ) {
			WPSEO_Meta::replace_meta( 'seo_title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		}

		// If WooSEO is set to use the Woo meta descriptions, import those
		if ( 'b' == get_option( 'seo_woo_meta_single_desc' ) ) {
			WPSEO_Meta::replace_meta( 'seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		}

		// If WooSEO is set to use the Woo meta keywords, import those
		if ( 'b' == get_option( 'seo_woo_meta_single_key' ) ) {
			WPSEO_Meta::replace_meta( 'seo_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		}

		/* @todo [JRF => whomever] verify how WooSEO sets these metas ( 'noindex', 'follow' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2) */
		WPSEO_Meta::replace_meta( 'seo_follow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $replace );
		WPSEO_Meta::replace_meta( 'seo_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $replace );

		update_option( 'wpseo_titles', $options );
		$msg .= __( 'WooThemes SEO framework settings &amp; data successfully imported.', 'wordpress-seo' );
		unset( $options, $sep );
	}

	if ( isset( $_POST['wpseo']['importheadspace'] ) ) {
		WPSEO_Meta::replace_meta( '_headspace_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( '_headspace_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( '_headspace_page_title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		/* @todo [JRF => whomever] verify how headspace sets these metas ( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2) */
		WPSEO_Meta::replace_meta( '_headspace_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $replace );
		WPSEO_Meta::replace_meta( '_headspace_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $replace );

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
		unset( $posts, $post, $custom, $robotsmeta_adv );

		if ( $replace ) {
			foreach ( array( 'noarchive', 'noodp', 'noydir' ) as $meta ) {
				delete_post_meta_by_key( '_headspace_' . $meta );
			}
			unset( $meta );
		}
		$msg .= __( 'HeadSpace2 data successfully imported', 'wordpress-seo' );
	}

	// @todo [JRF => whomever] how does this correlate with the routine on the dashboard page ? isn't one superfluous ?
	if ( isset( $_POST['wpseo']['importaioseo'] ) || isset( $_GET['importaioseo'] ) ) {
		WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', $replace );
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
				$options['ga_general']	= $ga_settings;
				update_option( 'yst_ga', $options );
			}

			$plugin_install_nonce = wp_create_nonce( 'install-plugin_google-analytics-for-wordpress' ); // Use the old name because that's the WordPress.org repo

			$msg .= __( sprintf(
				'All in One SEO data successfully imported. Would you like to %sdisable the All in One SEO plugin%s. You\'ve had Google Analytics enabled in All in One SEO, would you like to install our %sGoogle Analytics plugin%s?',
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_aioseo=1' ) ) . '">',
				'</a>',
				'<a href="' . esc_url( admin_url( 'update.php?action=install-plugin&plugin=google-analytics-for-wordpress&_wpnonce=' . $plugin_install_nonce ) ) . '">',
				'</a>'
			), 'wordpress-seo' );
		} else {
			$msg .= __( sprintf( 'All in One SEO data successfully imported. Would you like to %sdisable the All in One SEO plugin%s.', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_aioseo=1' ) ) . '">', '</a>' ), 'wordpress-seo' );
		}
	}

	if ( isset( $_POST['wpseo']['importaioseoold'] ) ) {
		WPSEO_Meta::replace_meta( 'description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( 'keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( 'title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		$msg .= __( 'All in One SEO (Old version) data successfully imported.', 'wordpress-seo' );
	}

	if ( isset( $_POST['wpseo']['importrobotsmeta'] ) || isset( $_GET['importrobotsmeta'] ) ) {
		$posts = $wpdb->get_results( "SELECT ID, robotsmeta FROM $wpdb->posts" );
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
		unset( $posts, $post, $pieces, $meta );
		$msg .= __( sprintf( 'Robots Meta values imported. We recommend %sdisabling the Robots-Meta plugin%s to avoid any conflicts.', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_import&deactivate_robots_meta=1' ) ) . '">', '</a>' ), 'wordpress-seo' );
	}

	if ( isset( $_POST['wpseo']['importrssfooter'] ) ) {
		$optold = get_option( 'RSSFooterOptions' );
		$optnew = get_option( 'wpseo_rss' );
		if ( $optold['position'] == 'after' ) {
			if ( $optnew['rssafter'] === '' || $optnew['rssafter'] === WPSEO_Options::get_default( 'wpseo_rss', 'rssafter' ) ) {
				$optnew['rssafter'] = $optold['footerstring'];
			}
		} else {
			/* @internal Uncomment the second part if a default would be given to the rssbefore value */
			if ( $optnew['rssbefore'] === '' /*|| $optnew['rssbefore'] === WPSEO_Options::get_default( 'wpseo_rss', 'rssbefore' )*/ ) {
				$optnew['rssbefore'] = $optold['footerstring'];
			}
		}
		update_option( 'wpseo_rss', $optnew );
		unset( $optold, $optnew );
		$msg .= __( 'RSS Footer options imported successfully.', 'wordpress-seo' );
	}

	if ( isset( $_POST['wpseo']['importbreadcrumbs'] ) ) {
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
			$msg .= __( 'Yoast Breadcrumbs options imported successfully.', 'wordpress-seo' );
		} else {
			$msg .= __( 'Yoast Breadcrumbs options could not be found', 'wordpress-seo' );
		}
		unset( $optold, $optnew );
	}

	// Allow custom import actions
	do_action( 'wpseo_handle_import' );

	/**
	 * Allow customization of import&export message
	 * @api  string  $msg  The message.
	 */
	$msg = apply_filters( 'wpseo_import_message', $msg );

	// Check if we've deleted old data and adjust message to match it
	if ( $replace ) {
		$msg .= ' ' . __( 'The old data of the imported plugin was deleted successfully.', 'wordpress-seo' );
	}
	if ( $deletekw ) {
		$msg .= ' ' . __( 'The old meta keywords data was deleted.', 'wordpress-seo' );
	}
}


$wpseo_admin_pages->admin_header( false );
if ( $msg != '' ) {
	echo '<div id="message" class="message updated" style="width:94%;"><p>' . $msg . '</p></div>';
}

$content = '<p>' . __( 'No doubt you\'ve used an SEO plugin before if this site isn\'t new. Let\'s make it easy on you, you can import the data below. If you want, you can import first, check if it was imported correctly, and then import &amp; delete. No duplicate data will be imported.', 'wordpress-seo' ) . '</p>';
$content .= '<p>' . sprintf( __( 'If you\'ve used another SEO plugin, try the %sSEO Data Transporter%s plugin to move your data into this plugin, it rocks!', 'wordpress-seo' ), '<a href="https://wordpress.org/plugins/seo-data-transporter/">', '</a>' ) . '</p>';
// @todo [JRF => whomever] add action for form tag
$content .= '<form action="" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
$content .= wp_nonce_field( 'wpseo-import', '_wpnonce', true, false );
$content .= $wpseo_admin_pages->checkbox( 'importheadspace', __( 'Import from HeadSpace2?', 'wordpress-seo' ) );
$content .= $wpseo_admin_pages->checkbox( 'importaioseo', __( 'Import from All-in-One SEO?', 'wordpress-seo' ) );
$content .= $wpseo_admin_pages->checkbox( 'importaioseoold', __( 'Import from OLD All-in-One SEO?', 'wordpress-seo' ) );
$content .= $wpseo_admin_pages->checkbox( 'importwoo', __( 'Import from WooThemes SEO framework?', 'wordpress-seo' ) );
$content .= '<br/>';
$content .= $wpseo_admin_pages->checkbox( 'deleteolddata', __( 'Delete the old data after import? (recommended)', 'wordpress-seo' ) );
$content .= '<br/>';
$content .= '<input type="submit" class="button-primary" name="import" value="' . __( 'Import', 'wordpress-seo' ) . '" />';
$content .= '<br/><br/>';

$content .= '<h2>' . __( 'Import settings from other plugins', 'wordpress-seo' ) . '</h2>';
$content .= $wpseo_admin_pages->checkbox( 'importrobotsmeta', __( 'Import from Robots Meta (by Yoast)?', 'wordpress-seo' ) );
$content .= $wpseo_admin_pages->checkbox( 'importrssfooter', __( 'Import from RSS Footer (by Yoast)?', 'wordpress-seo' ) );
$content .= $wpseo_admin_pages->checkbox( 'importbreadcrumbs', __( 'Import from Yoast Breadcrumbs?', 'wordpress-seo' ) );

/**
 * Allow option of importing from other 'other' plugins
 * @api  string  $content  The content containing all import and export methods
 */
$content = apply_filters( 'wpseo_import_other_plugins', $content );

$content .= '<br/>';
$content .= '<input type="submit" class="button-primary" name="import" value="' . __( 'Import', 'wordpress-seo' ) . '" />';
$content .= '</form><br/>';

$wpseo_admin_pages->postbox( 'import', __( 'Import', 'wordpress-seo' ), $content );

/**
 * Allow adding a custom import block
 * @api  WPSEO_Admin  $this  The WPSEO_Admin object
 */
do_action( 'wpseo_import', $this );

// @todo [JRF => whomever] add action for form tag
$content = '<h4>' . __( 'Export', 'wordpress-seo' ) . '</h4>';
$content .= '<form action="" method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
$content .= wp_nonce_field( 'wpseo-export', '_wpnonce', true, false );
$content .= '<p>' . __( 'Export your WordPress SEO settings here, to import them again later or to import them on another site.', 'wordpress-seo' ) . '</p>';
$content .= $wpseo_admin_pages->checkbox( 'include_taxonomy_meta', __( 'Include Taxonomy Metadata', 'wordpress-seo' ) );
$content .= '<br/><input type="submit" class="button" name="wpseo_export" value="' . __( 'Export settings', 'wordpress-seo' ) . '"/>';
$content .= '</form>';
if ( isset( $_POST['wpseo_export'] ) ) {
	check_admin_referer( 'wpseo-export' );
	$include_taxonomy = false;
	if ( isset( $_POST['wpseo']['include_taxonomy_meta'] ) ) {
		$include_taxonomy = true;
	}
	$url = $wpseo_admin_pages->export_settings( $include_taxonomy );
	if ( $url ) {
		$GLOBALS['export_js'] = '
		<script type="text/javascript">
			document.location = \'' . $url . '\';
		</script>';
		add_action( 'admin_footer-' . $GLOBALS['hook_suffix'], 'wpseo_deliver_export_zip' );
	} else {
		$content .= 'Error: ' . $url;
	}
}

$content .= '<h4>' . __( 'Import', 'wordpress-seo' ) . '</h4>';
if ( ! isset( $_FILES['settings_import_file'] ) || empty( $_FILES['settings_import_file'] ) ) {
	$content .= '<p>' . __( 'Import settings by locating <em>settings.zip</em> and clicking', 'wordpress-seo' ) . ' "' . __( 'Import settings', 'wordpress-seo' ) . '":</p>';
	// @todo [JRF => whomever] add action for form tag
	$content .= '<form action="" method="post" enctype="multipart/form-data" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
	$content .= wp_nonce_field( 'wpseo-import-file', '_wpnonce', true, false );
	$content .= '<input type="file" name="settings_import_file" accept="application/x-zip,application/x-zip-compressed,application/zip" />';
	$content .= '<input type="hidden" name="action" value="wp_handle_upload"/>';
	$content .= '<input type="submit" class="button" value="' . __( 'Import settings', 'wordpress-seo' ) . '"/>';
	$content .= '</form><br/>';
} elseif ( isset( $_FILES['settings_import_file'] ) ) {
	check_admin_referer( 'wpseo-import-file' );
	$file = wp_handle_upload( $_FILES['settings_import_file'] );

	if ( isset( $file['file'] ) && ! is_wp_error( $file ) ) {
		$upload_dir = wp_upload_dir();

		if ( ! defined( 'DIRECTORY_SEPARATOR' ) ) {
			define( 'DIRECTORY_SEPARATOR', '/' );
		}
		$p_path = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wpseo-import' . DIRECTORY_SEPARATOR;

		if ( ! isset( $GLOBALS['wp_filesystem'] ) || ! is_object( $GLOBALS['wp_filesystem'] ) ) {
			WP_Filesystem();
		}

		$unzipped = unzip_file( $file['file'], $p_path );
		if ( ! is_wp_error( $unzipped ) ) {
			$filename = $p_path . 'settings.ini';
			if ( @is_file( $filename ) && is_readable( $filename ) ) {
				$options = parse_ini_file( $filename, true );

				if ( is_array( $options ) && $options !== array() ) {
					$old_wpseo_version = null;
					if ( isset( $options['wpseo']['version'] ) && $options['wpseo']['version'] !== '' ) {
						$old_wpseo_version = $options['wpseo']['version'];
					}
					foreach ( $options as $name => $optgroup ) {
						if ( $name === 'wpseo_taxonomy_meta' ) {
							$optgroup = json_decode( urldecode( $optgroup['wpseo_taxonomy_meta'] ), true );
						}

						// Make sure that the imported options are cleaned/converted on import
						$option_instance = WPSEO_Options::get_option_instance( $name );
						if ( is_object( $option_instance ) && method_exists( $option_instance, 'import' ) ) {
							$optgroup = $option_instance->import( $optgroup, $old_wpseo_version, $options );
						} elseif ( WP_DEBUG === true || ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true ) ) {
							$content .= '<p><strong>' . sprintf( __( 'Setting "%s" is no longer used and has been discarded.', 'wordpress-seo' ), $name ) . '</strong></p>';

						}
					}
					$content .= '<p><strong>' . __( 'Settings successfully imported.', 'wordpress-seo' ) . '</strong></p>';
				} else {
					$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'No settings found in file.', 'wordpress-seo' ) . '</strong></p>';
				}
				unset( $options, $name, $optgroup );
			} else {
				$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Unzipping failed - file settings.ini not found.', 'wordpress-seo' ) . '</strong></p>';
			}
			@unlink( $filename );
			@unlink( $p_path );
		} else {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . sprintf( __( 'Unzipping failed with error "%s".', 'wordpress-seo' ), $unzipped->get_error_message() ) . '</strong></p>';
		}
		unset( $zip, $unzipped );
		@unlink( $file['file'] );
	} else {
		if ( is_wp_error( $file ) ) {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . $file->get_error_message() . '</strong></p>';
		} else {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Upload failed.', 'wordpress-seo' ) . '</strong></p>';
		}
	}
}
$wpseo_admin_pages->postbox( 'wpseo_export', __( 'Export & Import SEO Settings', 'wordpress-seo' ), $content );

$wpseo_admin_pages->admin_footer( false );


function wpseo_deliver_export_zip() {
	if ( isset( $GLOBALS['export_js'] ) && $GLOBALS['export_js'] !== '' ) {
		echo $GLOBALS['export_js'];
	}
}
