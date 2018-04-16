<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/*
 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
 * Otherwise setting a post-type to `noindex` will remove it from the list,
 * making it very hard to restore the setting again.
 */
$post_types = get_post_types( array( 'public' => true ), 'objects' );

// We'll show attachments on the Media tab.
$post_types = WPSEO_Post_Type::filter_attachment_post_type( $post_types );

$view_utils = new Yoast_View_Utils();

if ( is_array( $post_types ) && $post_types !== array() ) {
	foreach ( $post_types as $post_type ) {
		echo '<div class="tab-block" id="' . esc_attr( $post_type->name . '-titles-metas' ) . '">';
		echo '<h2 id="' . esc_attr( $post_type->name ) . '">' . esc_html( $post_type->labels->name ) . ' (<code>' . esc_html( $post_type->name ) . '</code>)</h2>';
		$view_utils->show_post_type_settings( $post_type );
		echo '</div>';
		/**
		 * Allow adding a custom checkboxes to the admin meta page - Post Types tab
		 *
		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
		 * @api  String  $name  The post type name
		 */
		do_action( 'wpseo_admin_page_meta_post_types', $yform, $post_type->name );
	}
	unset( $post_type );
}

$post_types = get_post_types(
	array(
		'_builtin'    => false,
		'has_archive' => true,
	),
	'objects'
);

if ( is_array( $post_types ) && $post_types !== array() ) {
	echo '<h2>' . esc_html__( 'Custom Content Type Archives', 'wordpress-seo' ) . '</h2>';
	echo '<p>' . esc_html__( 'Note: instead of templates these are the actual titles and meta descriptions for these custom content type archive pages.', 'wordpress-seo' ) . '</p>';
	foreach ( $post_types as $post_type ) {
		$name = $post_type->name;
		echo '<div class="tab-block">';
		echo '<h3>' . esc_html( ucfirst( $post_type->labels->name ) ) . '</h3>';

		$custom_post_type_archive_help = $view_utils->search_results_setting_help( $post_type, 'archive' );

		$yform->index_switch(
			'noindex-ptarchive-' . $name,
			sprintf(
				/* translators: %s expands to the post type's name. */
				__( 'the archive for %s', 'wordpress-seo' ),
				$post_type->labels->name
			),
			$custom_post_type_archive_help->get_button_html() . $custom_post_type_archive_help->get_panel_html()
		);

		$yform->textinput( 'title-ptarchive-' . $name, __( 'Title', 'wordpress-seo' ), 'template posttype-template' );
		$yform->textarea( 'metadesc-ptarchive-' . $name, __( 'Meta description', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
		if ( WPSEO_Options::get( 'breadcrumbs-enable' ) === true ) {
			$yform->textinput( 'bctitle-ptarchive-' . $name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
		}
		echo '</div>';
	}
	unset( $post_type );
}
unset( $post_types );
