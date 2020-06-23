<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
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
$wpseo_post_types = get_post_types( [ 'public' => true ], 'objects' );

// We'll show attachments on the Media tab.
$wpseo_post_types = WPSEO_Post_Type::filter_attachment_post_type( $wpseo_post_types );

if ( is_array( $wpseo_post_types ) && $wpseo_post_types !== [] ) {
	$view_utils                   = new Yoast_View_Utils();
	$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
	$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();

	foreach ( array_values( $wpseo_post_types ) as $wpseo_post_type_index => $post_type ) {
		$wpseo_post_type_presenter = new WPSEO_Collapsible_Presenter(
			$post_type->labels->name,
			__DIR__ . '/paper-content/post-type-content.php',
			[
				'collapsible' => true,
				'expanded'    => ( $wpseo_post_type_index === 0 ),
				'paper_id'    => 'settings-' . $post_type->name,
				'view_data'   => [
					'wpseo_post_type'              => $post_type,
					'view_utils'                   => $view_utils,
					'recommended_replace_vars'     => $recommended_replace_vars,
					'editor_specific_replace_vars' => $editor_specific_replace_vars,
				],
				'title'       => $post_type->labels->name,
				'title_after' => ' (<code>' . esc_html( $post_type->name ) . '</code>)',
				'class'       => 'search-appearance',
			]
		);

		echo $wpseo_post_type_presenter->get_output();
	}
}
