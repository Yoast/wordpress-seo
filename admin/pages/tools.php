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

$tool_page = (string) filter_input( INPUT_GET, 'tool' );
$admin_url = admin_url( 'admin.php?page=wpseo_tools' );

$tools = [];

$tools['general'] = [
	'title' => __( 'General', 'wordpress-seo' ),
	'href' => '',
];

$tools['import-export'] = [ 'title' => __( 'Import and Export', 'wordpress-seo' ) ];

if ( WPSEO_Utils::allow_system_file_edit() === true && ! is_multisite() ) {
	$tools['file-editor'] = [ 'title' => __( 'File editor', 'wordpress-seo' ) ];
}

$tools['bulk-editor'] = [ 'title' => __( 'Bulk editor', 'wordpress-seo' ) ];

$yform = Yoast_Form::get_instance();
$yform->admin_header( false, 'tools' );

require_once WPSEO_PATH . 'admin/views/tools-navigation.php';

if ( ! empty( $tool_page ) ) {
	$tool_pages = [ 'bulk-editor', 'import-export' ];
	if ( WPSEO_Utils::allow_system_file_edit() === true && ! is_multisite() ) {
		$tool_pages[] = 'file-editor';
	}

	if ( in_array( $tool_page, $tool_pages, true ) ) {
		require_once WPSEO_PATH . 'admin/views/tool-' . $tool_page . '.php';
	}

	$yform->admin_footer( false );

	return;
}

echo '<div class="yoast-paper">';

echo '<ul class="yoast-list">';

$admin_url = admin_url( 'admin.php?page=wpseo_tools' );

/**
 * Action: 'wpseo_tools_overview_list_items' - Hook to add additional tools to the overview.
 */
do_action( 'wpseo_tools_overview_list_items' );

echo '</ul>';

echo '<input type="hidden" id="wpseo_recalculate_nonce" name="wpseo_recalculate_nonce" value="' . esc_attr( wp_create_nonce( 'wpseo_recalculate' ) ) . '" />';

echo '</div>'; // yoast-paper.

$yform->admin_footer( false );
