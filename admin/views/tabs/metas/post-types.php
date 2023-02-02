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

echo '<p>';
esc_html_e( 'The settings on this page allow you to specify what the default search appearance should be for any type of content you have. You can choose which content types appear in search results and what their default description should be.', 'wordpress-seo' );
echo '</p>';

$view_utils                   = new Yoast_View_Utils();
$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
$opengraph_disabled_alert     = $view_utils->generate_opengraph_disabled_alert();

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Is correctly escaped in the generate_opengraph_disabled_alert() method.
echo $opengraph_disabled_alert;

if ( is_array( $wpseo_post_types ) && $wpseo_post_types !== [] ) {
	foreach ( array_values( $wpseo_post_types ) as $wpseo_post_type_index => $yoast_seo_post_type ) {
		$wpseo_post_type_presenter = new WPSEO_Paper_Presenter(
			$yoast_seo_post_type->labels->name,
			__DIR__ . '/paper-content/post-type-content.php',
			[
				'collapsible' => true,
				'expanded'    => ( $wpseo_post_type_index === 0 ),
				'paper_id'    => 'settings-' . $yoast_seo_post_type->name,
				'view_data'   => [
					'wpseo_post_type'              => $yoast_seo_post_type,
					'view_utils'                   => $view_utils,
					'recommended_replace_vars'     => $recommended_replace_vars,
					'editor_specific_replace_vars' => $editor_specific_replace_vars,
				],
				'title'       => $yoast_seo_post_type->labels->name,
				'title_after' => ' (<code>' . esc_html( $yoast_seo_post_type->name ) . '</code>)',
				'class'       => 'search-appearance',
			]
		);

		// phpcs:ignore WordPress.Security.EscapeOutput -- get_output() output is properly escaped.
		echo $wpseo_post_type_presenter->get_output();
	}
}
