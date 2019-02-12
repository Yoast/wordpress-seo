<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform  = Yoast_Form::get_instance();
$import = false;

/**
 * The import method is used to determine if there should be something imported.
 *
 * In case of POST the user is on the Yoast SEO import page and in case of the GET the user sees a notice from
 * Yoast SEO that we can import stuff for that plugin.
 */
if ( filter_input( INPUT_POST, 'import' ) || filter_input( INPUT_GET, 'import' ) ) {
	check_admin_referer( 'wpseo-import' );

	$post_wpseo = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
	$action     = 'import';
}
elseif ( filter_input( INPUT_POST, 'import_external' ) ) {
	check_admin_referer( 'wpseo-import-plugins' );

	$class = filter_input( INPUT_POST, 'import_external_plugin' );
	if ( class_exists( $class ) ) {
		$import = new WPSEO_Import_Plugin( new $class(), 'import' );
	}
}
elseif ( filter_input( INPUT_POST, 'clean_external' ) ) {
	check_admin_referer( 'wpseo-clean-plugins' );

	$class = filter_input( INPUT_POST, 'clean_external_plugin' );
	if ( class_exists( $class ) ) {
		$import = new WPSEO_Import_Plugin( new $class(), 'cleanup' );
	}
}
elseif ( filter_input( INPUT_POST, 'settings_import' ) ) {
	$import = new WPSEO_Import_Settings();
	$import->import();
}

/**
 * Allow custom import actions.
 *
 * @api WPSEO_Import_Status $import Contains info about the handled import.
 */
$import = apply_filters( 'wpseo_handle_import', $import );

if ( $import ) {

	$message = '';
	if ( $import->status instanceof WPSEO_Import_Status ) {
		$message = $import->status->get_msg();
	}

	/**
	 * Allow customization of import/export message.
	 *
	 * @api  string  $msg  The message.
	 */
	$msg = apply_filters( 'wpseo_import_message', $message );

	if ( ! empty( $msg ) ) {
		$status = 'error';
		if ( $import->status->status ) {
			$status = 'updated';
		}

		echo '<div id="message" class="message ', $status, '"><p>', esc_html( $msg ), '</p></div>';
	}
}

$tabs = array(
	'wpseo-import' => array(
		'label'                => __( 'Import settings', 'wordpress-seo' ),
		'screencast_video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-import-export' ),
	),
	'wpseo-export' => array(
		'label'                => __( 'Export settings', 'wordpress-seo' ),
		'screencast_video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-import-export' ),
	),
	'import-seo'   => array(
		'label'                => __( 'Import from other SEO plugins', 'wordpress-seo' ),
		'screencast_video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-import-export' ),
	),
);

?>
	<br/><br/>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php foreach ( $tabs as $identifier => $tab ) : ?>
			<a class="nav-tab" id="<?php echo esc_attr( $identifier . '-tab' ); ?>" href="<?php echo esc_url( '#top#' . $identifier ); ?>"><?php echo esc_html( $tab['label'] ); ?></a>
		<?php endforeach; ?>

		<?php
		/**
		 * Allow adding a custom import tab header
		 */
		do_action( 'wpseo_import_tab_header' );
		?>
	</h2>

<?php

$helpcenter_tabs = new WPSEO_Option_Tabs( '', '' );

foreach ( $tabs as $identifier => $tab ) {
	if ( ! empty( $tab['screencast_video_url'] ) ) {
		$tab_video_url = $tab['screencast_video_url'];

		$helpcenter_tab = new WPSEO_Option_Tab(
			$identifier,
			$tab['label'],
			array( 'video_url' => $tab['screencast_video_url'] )
		);
	}

	$helpcenter_tabs->add_tab( $helpcenter_tab );
}

$helpcenter = new WPSEO_Help_Center( '', $helpcenter_tabs, WPSEO_Utils::is_yoast_seo_premium() );
$helpcenter->localize_data();
$helpcenter->mount();

foreach ( $tabs as $identifier => $tab ) {
	printf( '<div id="%s" class="wpseotab">', esc_attr( $identifier ) );
	require_once WPSEO_PATH . 'admin/views/tabs/tool/' . $identifier . '.php';
	echo '</div>';
}

/**
 * Allow adding a custom import tab
 */
do_action( 'wpseo_import_tab_content' );
