<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\PaperContent
 *
 * @uses Yoast_Form                           $yform                    Form object.
 * @uses WP_Taxonomy                          $wpseo_post_type
 * @uses Yoast_View_Utils                     $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars $recommended_replace_vars
 */


$view_utils                   = new Yoast_View_Utils();
$opengraph_disabled_alert     = $view_utils->generate_opengraph_disabled_alert( 'homepage' );

if( ! empty( $opengraph_disabled_alert ) ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Is correctly escaped in the generate_opengraph_disabled_alert() method.
	echo $opengraph_disabled_alert;
} else {

	echo '<div class="yoast-settings-section">';
	echo '<p>' . esc_html__( 'These are the image, title and description used when a link to your homepage is shared on social media.', 'wordpress-seo' ) . '</p>';

	echo '<div id="yoast-og-frontpage-image-select"></div>';

	$yform->hidden( 'open_graph_frontpage_image', 'open_graph_frontpage_image' );
	$yform->hidden( 'open_graph_frontpage_image_id', 'open_graph_frontpage_image_id' );

	$editor = new WPSEO_Replacevar_Editor(
		$yform,
		[
			'title'                   => 'open_graph_frontpage_title',
			'description'             => 'open_graph_frontpage_desc',
			'page_type_recommended'   => 'homepage',
			'page_type_specific'      => 'page',
			'paper_style'             => false,
			'label_title'             => __( 'Social title', 'wordpress-seo' ),
			'label_description'       => __( 'Social description', 'wordpress-seo' ),
			'description_placeholder' => __( 'Modify your social description by editing it right here.', 'wordpress-seo' ),
			'has_new_badge'           => true,
		]
	);
	$editor->render();
	echo '</div>';
}
