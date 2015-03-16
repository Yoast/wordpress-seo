<?php
/**
 * @package    WPSEO
 * @subpackage Admin
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

$yform = Yoast_Form::get_instance();

$msg = '';
if ( isset( $_POST['import'] ) || isset( $_GET['import'] ) ) {

	check_admin_referer( 'wpseo-import' );

	$replace = false;

	if ( isset( $_POST['wpseo']['deleteolddata'] ) && $_POST['wpseo']['deleteolddata'] == 'on' ) {
		$replace = true;
	}

	$import = new WPSEO_Import_External( $replace );

	if ( isset( $_POST['wpseo']['importwoo'] ) ) {
		$import->import_woothemes_seo();
	}

	if ( isset( $_POST['wpseo']['importheadspace'] ) ) {
		$import->import_headspace();
	}

	// @todo [JRF => whomever] how does this correlate with the routine on the dashboard page ? isn't one superfluous ?
	if ( isset( $_POST['wpseo']['importaioseo'] ) || isset( $_GET['importaioseo'] ) ) {
		$import->import_aioseo();
	}

	if ( isset( $_POST['wpseo']['importrobotsmeta'] ) || isset( $_GET['importrobotsmeta'] ) ) {
		$import->import_robots_meta();
	}

	if ( isset( $_POST['wpseo']['importrssfooter'] ) ) {
		$import->import_rss_footer();
	}

	if ( isset( $_POST['wpseo']['importbreadcrumbs'] ) ) {
		$import->import_yoast_breadcrumbs();
	}

	// Allow custom import actions
	do_action( 'wpseo_handle_import' );

	/**
	 * Allow customization of import&export message
	 * @api  string  $msg  The message.
	 */
	$msg = apply_filters( 'wpseo_import_message', $import->msg );

	// Check if we've deleted old data and adjust message to match it
	if ( $replace ) {
		$msg .= ' ' . __( 'The old data of the imported plugin was deleted successfully.', 'wordpress-seo' );
	}
}

if ( $msg != '' ) {
	echo '<div id="message" class="message updated" style="width:94%;"><p>', $msg, '</p></div>';
}

echo '<br/><br/>';
echo '<h2 class="nav-tab-wrapper" id="wpseo-tabs">';
echo '<a class="nav-tab nav-tab-active" id="wpseo-import-tab" href="#top#wpseo-import">', __( 'Import', 'wordpress-seo' ), '</a>';
echo '<a class="nav-tab" id="wpseo-export-tab" href="#top#wpseo-export">', __( 'Export', 'wordpress-seo' ), '</a>';
echo '<a class="nav-tab" id="import-seo-tab" href="#top#import-seo">', __( 'Import from other SEO plugins', 'wordpress-seo' ), '</a>';
echo '<a class="nav-tab" id="import-other-tab" href="#top#import-other">', __( 'Import from other plugins', 'wordpress-seo' ), '</a>';
echo '</h2>';

echo '<div id="wpseo-import" class="wpseotab">';
if ( ! isset( $_FILES['settings_import_file'] ) || empty( $_FILES['settings_import_file'] ) ) {
	echo '<p>' . __( 'Import settings by locating <em>settings.zip</em> and clicking', 'wordpress-seo' ) . ' "' . __( 'Import settings', 'wordpress-seo' ) . '":</p>';
	// @todo [JRF => whomever] add action for form tag
	echo '<form action="" method="post" enctype="multipart/form-data" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
	wp_nonce_field( 'wpseo-import-file', '_wpnonce', true, true );
	echo '<input type="file" name="settings_import_file"/>';
	echo '<input type="hidden" name="action" value="wp_handle_upload"/>';
	echo '<br/><br/>';
	echo '<input type="submit" class="button-primary" value="' . __( 'Import settings', 'wordpress-seo' ) . '"/>';
	echo '</form><br/>';
}
elseif ( isset( $_FILES['settings_import_file'] ) ) {
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
						}
						elseif ( WP_DEBUG === true || ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true ) ) {
							$msg = sprintf( __( 'Setting "%s" is no longer used and has been discarded.', 'wordpress-seo' ), $name );

						}
					}
					$msg = __( 'Settings successfully imported.', 'wordpress-seo' );
				}
				else {
					$msg = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'No settings found in file.', 'wordpress-seo' );
				}
				unset( $options, $name, $optgroup );
			}
			else {
				$msg = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Unzipping failed - file settings.ini not found.', 'wordpress-seo' );
			}
			@unlink( $filename );
			@unlink( $p_path );
		}
		else {
			$msg = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . sprintf( __( 'Unzipping failed with error "%s".', 'wordpress-seo' ), $unzipped->get_error_message() );
		}
		unset( $zip, $unzipped );
		@unlink( $file['file'] );
	}
	else {
		if ( is_wp_error( $file ) ) {
			$msg = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . $file->get_error_message();
		}
		else {
			$msg = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Upload failed.', 'wordpress-seo' );
		}
	}
}

if ( isset( $msg ) ) {
	echo '<p><strong>' . $msg . '</strong></p>';
}

echo '</div>';

?>
	<div id="wpseo-export" class="wpseotab">
		<p><?php _e( 'Export your WordPress SEO settings here, to import them again later or to import them on another site.', 'wordpress-seo' ); ?></p>
		<?php $yform->checkbox( 'include_taxonomy_meta', __( 'Include Taxonomy Metadata', 'wordpress-seo' ) ); ?><br/>
		<button class="button-primary" id="export-button">Export your WordPress SEO settings</button>
		<script>
			var wpseo_export_nonce = '<?php echo wp_create_nonce( 'wpseo-export' ); ?>';
		</script>
	</div>

	<div id="import-seo" class="wpseotab">
		<p><?php _e( 'No doubt you\'ve used an SEO plugin before if this site isn\'t new. Let\'s make it easy on you, you can import the data below. If you want, you can import first, check if it was imported correctly, and then import &amp; delete. No duplicate data will be imported.', 'wordpress-seo' ); ?></p>

		<p><?php printf( __( 'If you\'ve used another SEO plugin, try the %sSEO Data Transporter%s plugin to move your data into this plugin, it rocks!', 'wordpress-seo' ), '<a href="https://wordpress.org/plugins/seo-data-transporter/">', '</a>' ); ?></p>

		<form
			action="<?php echo esc_attr( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-seo' ) ); ?>"
			method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
			<?php
				wp_nonce_field( 'wpseo-import', '_wpnonce', true, true );
				$yform->checkbox( 'importheadspace', __( 'Import from HeadSpace2?', 'wordpress-seo' ) );
				$yform->checkbox( 'importaioseo', __( 'Import from All-in-One SEO?', 'wordpress-seo' ) );
				$yform->checkbox( 'importwoo', __( 'Import from WooThemes SEO framework?', 'wordpress-seo' ) );
			?>
			<br/>
			<?php
			$yform->checkbox( 'deleteolddata', __( 'Delete the old data after import? (recommended)', 'wordpress-seo' ) );
			?>
			<br/>
			<input type="submit" class="button-primary" name="import"
			       value="<?php _e( 'Import', 'wordpress-seo' ); ?>"/>
		</form>
		<br/>
		<br/>
	</div>

	<div id="import-other" class="wpseotab">
		<p><?php _e( 'If you want to import data from (by now ancient) Yoast plugins, you can do so here:', 'wordpress-seo' ); ?></p>
		<form
			action="<?php echo esc_attr( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-other' ) ); ?>"
			method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
			<?php
				wp_nonce_field( 'wpseo-import', '_wpnonce', true, true );
				$yform->checkbox( 'importrobotsmeta', __( 'Import from Robots Meta (by Yoast)?', 'wordpress-seo' ) );
				$yform->checkbox( 'importrssfooter', __( 'Import from RSS Footer (by Yoast)?', 'wordpress-seo' ) );
				$yform->checkbox( 'importbreadcrumbs', __( 'Import from Yoast Breadcrumbs?', 'wordpress-seo' ) );

				/**
 			    * Allow option of importing from other 'other' plugins
 			    * @api  string  $content  The content containing all import and export methods
 			    */
				echo apply_filters( 'wpseo_import_other_plugins', '' );

				/**
 			    * Allow adding a custom import block
 			    * @api  WPSEO_Admin  $this  The WPSEO_Admin object
 			    */
				do_action( 'wpseo_import', $this );
			?>
			<br/>
			<input type="submit" class="button-primary" name="import" value="<?php _e( 'Import', 'wordpress-seo' ); ?>" />
		</form>
		<br/>
	</div>
