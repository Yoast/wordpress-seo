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

$yform = Yoast_Form::get_instance();
$yform->admin_header( false );

if ( '' === $tool_page ) {

	$tools = array();

	$tools['import-export'] = array(
		'title' => __( 'Import and Export', 'wordpress-seo' ),
		'desc'  => __( 'Import settings from other SEO plugins and export your settings for re-use on (another) blog.', 'wordpress-seo' ),
	);

	if ( WPSEO_Utils::allow_system_file_edit() === true && ! is_multisite() ) {
		$tools['file-editor'] = array(
			'title' => __( 'File editor', 'wordpress-seo' ),
			'desc'  => __( 'This tool allows you to quickly change important files for your SEO, like your robots.txt and, if you have one, your .htaccess file.', 'wordpress-seo' ),
		);
	}

	$tools['bulk-editor'] = array(
		'title' => __( 'Bulk editor', 'wordpress-seo' ),
		'desc'  => __( 'This tool allows you to quickly change titles and descriptions of your posts and pages without having to go into the editor for each page.', 'wordpress-seo' ),
	);

	echo '<p>';
	printf(
		/* translators: %1$s expands to Yoast SEO */
		esc_html__( '%1$s comes with some very powerful built-in tools:', 'wordpress-seo' ),
		'Yoast SEO'
	);
	echo '</p>';

	echo '<ul class="ul-disc">';

	$admin_url = admin_url( 'admin.php?page=wpseo_tools' );

	foreach ( $tools as $slug => $tool ) {
		$href = ( ! empty( $tool['href'] ) ) ? $admin_url . $tool['href'] : add_query_arg( array( 'tool' => $slug ), $admin_url );
		$attr = ( ! empty( $tool['attr'] ) ) ? $tool['attr'] : '';

		echo '<li>';
		echo '<strong><a href="', esc_url( $href ), '" ', $attr , '>', esc_html( $tool['title'] ), '</a></strong><br/>';
		echo $tool['desc'];
		echo '</li>';
	}

	/**
	 * Action: 'wpseo_tools_overview_list_items' - Hook to add additional tools to the overview.
	 */
	do_action( 'wpseo_tools_overview_list_items' );

	echo '</ul>';

	echo '<input type="hidden" id="wpseo_recalculate_nonce" name="wpseo_recalculate_nonce" value="' . esc_attr( wp_create_nonce( 'wpseo_recalculate' ) ) . '" />';

}
else {
	echo '<a href="', esc_url( admin_url( 'admin.php?page=wpseo_tools' ) ), '">', esc_html__( '&laquo; Back to Tools page', 'wordpress-seo' ), '</a>';

	$tool_pages = array( 'bulk-editor', 'import-export' );

	if ( WPSEO_Utils::allow_system_file_edit() === true && ! is_multisite() ) {
		$tool_pages[] = 'file-editor';
	}

	if ( in_array( $tool_page, $tool_pages, true ) ) {
		require_once WPSEO_PATH . 'admin/views/tool-' . $tool_page . '.php';
	}
}

$yform->admin_footer( false );
