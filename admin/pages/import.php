<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/*
@todo Extensively test the export & import of the (new) settings!

If that all works fine, getting testers to export before and after upgrade will make testing easier.
*/

global $wpseo_admin_pages;

$msg = '';
if ( isset( $_POST['import'] ) ) {

	check_admin_referer( 'wpseo-import' );

	global $wpdb;
	$replace  = false;
	$deletekw = false;

	if ( isset( $_POST['wpseo']['deleteolddata'] ) && $_POST['wpseo']['deleteolddata'] == 'on' ) {
		$replace = true;
	}
	if ( isset( $_POST['wpseo']['importwoo'] ) ) {
		wpseo_defaults();

		$sep = get_option( 'seo_woo_seperator' );

		$options = WPSEO_Options::get_all();

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

		// @todo - should the default be the same default as wpseo default ? It currently isn't
		$template = '%%term_title%% ' . $sep . ' %%page%% ' . $sep . ' %%sitename%%';
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
		if ( $replace ) {
			delete_option( 'seo_woo_archive_layout' );
		}

		foreach ( get_taxonomies( array( 'public' => true ), 'names' ) as $tax ) {
			$options['title-tax-'.$tax] = $template;
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

		WPSEO_Meta::replace_meta( 'seo_follow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $replace );
		WPSEO_Meta::replace_meta( 'seo_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $replace );

		$msg .= __( 'WooThemes SEO framework settings &amp; data successfully imported.', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importheadspace'] ) ) {
		WPSEO_Meta::replace_meta( '_headspace_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( '_headspace_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( '_headspace_page_title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		WPSEO_Meta::replace_meta( '_headspace_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $replace );
		WPSEO_Meta::replace_meta( '_headspace_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $replace );

		$posts = $wpdb->get_results( "SELECT ID FROM $wpdb->posts" );
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

			if ( $replace ) {
				foreach ( array( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' ) as $meta ) {
					delete_post_meta( $post->ID, '_headspace_' . $meta );
				}
			}
		}
		$msg .= __( 'HeadSpace2 data successfully imported', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importaioseo'] ) ) {
		WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		$msg .= __( 'All in One SEO data successfully imported.', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importaioseoold'] ) ) {
		WPSEO_Meta::replace_meta( 'description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
		WPSEO_Meta::replace_meta( 'keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
		WPSEO_Meta::replace_meta( 'title', WPSEO_Meta::$meta_prefix . 'title', $replace );
		$msg .= __( 'All in One SEO (Old version) data successfully imported.', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importrobotsmeta'] ) ) {
		$posts = $wpdb->get_results( "SELECT ID, robotsmeta FROM $wpdb->posts" );
		foreach ( $posts as $post ) {
			if ( strpos( $post->robotsmeta, 'noindex' ) !== false ) {
				WPSEO_Meta::set_value( 'meta-robots-noindex', true, $post->ID );
			}

			if ( strpos( $post->robotsmeta, 'nofollow' ) !== false ) {
				WPSEO_Meta::set_value( 'meta-robots-nofollow', true, $post->ID );
			}
		}
		$msg .= __( 'Robots Meta values imported.', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importrssfooter'] ) ) {
		$optold = get_option( 'RSSFooterOptions' );
		$optnew = get_option( 'wpseo_rss' );
		if ( $optold['position'] == 'after' ) {
			if ( empty( $optnew['rssafter'] ) ) {
				$optnew['rssafter'] = $optold['footerstring'];
			}
		}
		else {
			if ( empty( $optnew['rssbefore'] ) ) {
				$optnew['rssbefore'] = $optold['footerstring'];
			}
		}
		update_option( 'wpseo_rss', $optnew );
		$msg .= __( 'RSS Footer options imported successfully.', 'wordpress-seo' );
	}
	if ( isset( $_POST['wpseo']['importbreadcrumbs'] ) ) {
		$optold = get_option( 'yoast_breadcrumbs' );
		$optnew = get_option( 'wpseo_internallinks' );

		if ( is_array( $optold ) ) {
			foreach ( $optold as $opt => $val ) {
				if ( is_bool( $val ) && $val == true ) {
					$optnew['breadcrumbs-' . $opt] = 'on';
				}
				else {
					$optnew['breadcrumbs-' . $opt] = $val;
				}
			}
			update_option( 'wpseo_internallinks', $optnew );
			$msg .= __( 'Yoast Breadcrumbs options imported successfully.', 'wordpress-seo' );
		}
		else {
			$msg .= __( 'Yoast Breadcrumbs options could not be found', 'wordpress-seo' );
		}
	}
	if ( $replace ) {
		$msg .= __( ', and old data deleted.', 'wordpress-seo' );
	}
	if ( $deletekw ) {
		$msg .= __( ', and meta keywords data deleted.', 'wordpress-seo' );
	}
}

$wpseo_admin_pages->admin_header( false );
if ( $msg != '' ) {
	echo '<div id="message" class="message updated" style="width:94%;"><p>' . esc_html( $msg ) . '</p></div>';
}

$content  = '<p>' . __( 'No doubt you\'ve used an SEO plugin before if this site isn\'t new. Let\'s make it easy on you, you can import the data below. If you want, you can import first, check if it was imported correctly, and then import &amp; delete. No duplicate data will be imported.', 'wordpress-seo' ) . '</p>';
$content .= '<p>' . sprintf( __( 'If you\'ve used another SEO plugin, try the %sSEO Data Transporter%s plugin to move your data into this plugin, it rocks!', 'wordpress-seo' ), '<a href="http://wordpress.org/extend/plugins/seo-data-transporter/">', '</a>' ) . '</p>';
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
$content .= '<br/>';
$content .= '<input type="submit" class="button-primary" name="import" value="' . __( 'Import', 'wordpress-seo' ) . '" />';
$content .= '</form><br/>';

$wpseo_admin_pages->postbox( 'import', __( 'Import', 'wordpress-seo' ), $content );

do_action( 'wpseo_import', $this );

$content  = '<h4>' . __( 'Export', 'wordpress-seo' ) . '</h4>';
$content .= '<form method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
$content .= wp_nonce_field( 'wpseo-export', '_wpnonce', true, false );
$content .= '<p>' . __( 'Export your WordPress SEO settings here, to import them again later or to import them on another site.', 'wordpress-seo' ) . '</p>';
if ( phpversion() > 5.2 ) {
	$content .= $wpseo_admin_pages->checkbox( 'include_taxonomy_meta', __( 'Include Taxonomy Metadata', 'wordpress-seo' ) );
}
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
		$content .= '<script type="text/javascript">
			document.location = \'' . $url . '\';
		</script>';
	}
	else {
		$content .= 'Error: ' . $url;
	}
}

$content .= '<h4>' . __( 'Import', 'wordpress-seo' ) . '</h4>';
if ( ! isset( $_FILES['settings_import_file'] ) || empty( $_FILES['settings_import_file'] ) ) {
	$content .= '<p>' . __( 'Import settings by locating <em>settings.zip</em> and clicking', 'wordpress-seo' ) . ' "' . __( 'Import settings', 'wordpress-seo' ) . '":</p>';
	$content .= '<form method="post" enctype="multipart/form-data" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
	$content .= wp_nonce_field( 'wpseo-import-file', '_wpnonce', true, false );
	$content .= '<input type="file" name="settings_import_file"/>';
	$content .= '<input type="hidden" name="action" value="wp_handle_upload"/>';
	$content .= '<input type="submit" class="button" value="' . __( 'Import settings', 'wordpress-seo' ) . '"/>';
	$content .= '</form><br/>';
}
else if ( isset( $_FILES['settings_import_file'] ) ) {
	check_admin_referer( 'wpseo-import-file' );
	$file = wp_handle_upload( $_FILES['settings_import_file'] );

	if ( isset( $file['file'] ) && ! is_wp_error( $file ) ) {
		$zip      = new PclZip( $file['file'] );
		$unzipped = $zip->extract( $p_path = WP_CONTENT_DIR . '/wpseo-import/' );
		if ( $unzipped[0]['stored_filename'] == 'settings.ini' ) {
			$options = parse_ini_file( WP_CONTENT_DIR . '/wpseo-import/settings.ini', true );
			foreach ( $options as $name => $optgroup ) {
				if ( $name != 'wpseo_taxonomy_meta' ) {
					update_option( $name, $optgroup );
				}
				else {
					update_option( $name, json_decode( urldecode( $optgroup['wpseo_taxonomy_meta'] ), true ) );
				}
			}
			@unlink( WP_CONTENT_DIR . '/wpseo-import/' );
			@unlink( $file['file'] );

			$content .= '<p><strong>' . __( 'Settings successfully imported.', 'wordpress-seo' ) . '</strong></p>';
		}
		else {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Unzipping failed.', 'wordpress-seo' ) . '</strong></p>';
		}
	}
	else {
		if ( is_wp_error( $file ) ) {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . $file['error'] . '</strong></p>';
		}
		else {
			$content .= '<p><strong>' . __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Upload failed.', 'wordpress-seo' ) . '</strong></p>';
		}
	}
}
$wpseo_admin_pages->postbox( 'wpseo_export', __( 'Export & Import SEO Settings', 'wordpress-seo' ), $content );

$wpseo_admin_pages->admin_footer( false );