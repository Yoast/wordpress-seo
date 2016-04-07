<?php
/**
 * @package WPSEO\Admin
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
 * @todo [Yoast] The import for the RSS Footer plugin checks for data already entered via Yoast SEO,
 * the other import routines should do that too.
 */

$yform = Yoast_Form::get_instance();

$replace = false;

/**
 * The import method is used to dermine if there should be something imported.
 *
 * In case of POST the user is on the Yoast SEO import page and in case of the GET the user sees a notice from
 * Yoast SEO that we can import stuff for that plugin.
 */
if ( filter_input( INPUT_POST, 'import' ) || filter_input( INPUT_GET, 'import' ) ) {

	check_admin_referer( 'wpseo-import' );

	$post_wpseo = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
	$replace    = ( ! empty( $post_wpseo['deleteolddata'] ) && $post_wpseo['deleteolddata'] === 'on' );

	if ( ! empty( $post_wpseo['importwoo'] ) ) {
		$import = new WPSEO_Import_WooThemes_SEO( $replace );
	}

	if ( ! empty( $post_wpseo['importaioseo'] ) || filter_input( INPUT_GET, 'importaioseo' ) ) {
		$import = new WPSEO_Import_AIOSEO( $replace );
	}

	if ( ! empty( $post_wpseo['importheadspace'] ) ) {
		$import = new WPSEO_Import_External( $replace );
		$import->import_headspace();
	}

	if ( ! empty( $post_wpseo['importwpseo'] ) || filter_input( INPUT_GET, 'importwpseo' ) ) {
		$import = new WPSEO_Import_WPSEO( $replace );
	}

	// Allow custom import actions.
	do_action( 'wpseo_handle_import' );

}

if ( isset( $_FILES['settings_import_file'] ) ) {
	check_admin_referer( 'wpseo-import-file' );

	$import = new WPSEO_Import();
}

if ( isset( $import ) ) {
	/**
	 * Allow customization of import&export message
	 *
	 * @api  string  $msg  The message.
	 */
	$msg = apply_filters( 'wpseo_import_message', $import->msg );

	// Check if we've deleted old data and adjust message to match it.
	if ( $replace ) {
		$msg .= ' ' . __( 'The old data of the imported plugin was deleted successfully.', 'wordpress-seo' );
	}

	if ( $msg != '' ) {
		echo '<div id="message" class="message updated" style="width:94%;"><p>', $msg, '</p></div>';
	}
}

$tabs = array(
	'wpseo-import' => array(
		'label'                => __( 'Import', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-tools-import-export',
	),
	'wpseo-export' => array(
		'label'                => __( 'Export', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-tools-import-export',
	),
	'import-seo'   => array(
		'label'                => __( 'Import from other SEO plugins', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-tools-import-export',
	),
);

?>
	<br/><br/>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php foreach ( $tabs as $identifier => $tab ) : ?>
			<a class="nav-tab" id="<?php echo $identifier; ?>-tab"
			   href="#top#<?php echo $identifier; ?>"><?php echo $tab['label']; ?></a>
			<?php
		endforeach;

		/**
		 * Allow adding a custom import tab header
		 */
		do_action( 'wpseo_import_tab_header' );
		?>
	</h2>

<?php

foreach ( $tabs as $identifier => $tab ) {

	printf( '<div id="%s" class="wpseotab">', $identifier );

	if ( ! empty( $tab['screencast_video_url'] ) ) {
		$tab_video_url = $tab['screencast_video_url'];
		include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
	}

	require_once WPSEO_PATH . 'admin/views/tabs/tool/' . $identifier . '.php';

	echo '</div>';
}

/**
 * Allow adding a custom import tab
 */
do_action( 'wpseo_import_tab_content' );
