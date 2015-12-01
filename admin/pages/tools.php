<?php
/**
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

	new WPSEO_Recalculate_Scores();

	$tools = array(
		'bulk-editor' => array(
			'title' => __( 'Bulk editor', 'wordpress-seo' ),
			'desc' => __( 'This tool allows you to quickly change titles and descriptions of your posts and pages without having to go into the editor for each page.', 'wordpress-seo' ),
		),
		'import-export' => array(
			'title' => __( 'Import and Export', 'wordpress-seo' ),
			'desc' => __( 'Import settings from other SEO plugins and export your settings for re-use on (another) blog.', 'wordpress-seo' ),
		),
	);
	if ( WPSEO_Utils::allow_system_file_edit() === true && ! is_multisite() ) {
		$tools['file-editor'] = array(
			'title' => __( 'File editor', 'wordpress-seo' ),
			'desc' => __( 'This tool allows you to quickly change important files for your SEO, like your robots.txt and, if you have one, your .htaccess file.', 'wordpress-seo' ),
		);
	}

	$tools['recalculate'] = array(
		'href'    => '#TB_inline?width=300&height=150&inlineId=wpseo_recalculate',
		'attr'    => "id='wpseo_recalculate_link' class='thickbox'",
		'title'   => __( 'Recalculate SEO scores', 'wordpress-seo' ),
		'desc'    => __( 'Recalculate SEO scores for all pieces of content with a focus keyword.', 'wordpress-seo' ),
	);

	if ( filter_input( INPUT_GET, 'recalculate' ) === '1' ) {
		update_site_option( 'wpseo_dismiss_recalculate', 1 );
		$tools['recalculate']['attr'] .= "data-open='open'";
	}

	/* translators: %1$s expands to Yoast SEO */
	echo '<p>', sprintf( __( '%1$s comes with some very powerful built-in tools:', 'wordpress-seo' ), 'Yoast SEO' ), '</p>';

	asort( $tools );

	echo '<ul class="ul-disc">';
	foreach ( $tools as $slug => $tool ) {
		$href = ( ! empty( $tool['href'] ) ) ? esc_attr( $tool['href'] ) : '&tool=' . $slug;
		$attr = ( ! empty( $tool['attr'] ) ) ? $tool['attr'] : '';
		echo '<li>';
		echo '<strong><a href="', admin_url( 'admin.php?page=wpseo_tools' . $href ), '" ' , $attr, '>', $tool['title'], '</a></strong><br/>';
		echo $tool['desc'];
		echo '</li>';
	}
	echo '</ul>';

	echo '<input type="hidden" id="wpseo_recalculate_nonce" name="wpseo_recalculate_nonce" value="' . wp_create_nonce( 'wpseo_recalculate' ) . '" />';

}
else {
	echo '<a href="', admin_url( 'admin.php?page=wpseo_tools' ), '">', __( '&laquo; Back to Tools page', 'wordpress-seo' ), '</a>';
	require_once WPSEO_PATH . 'admin/views/tool-' . $tool_page . '.php';
}

$yform->admin_footer( false );
