<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\PaperContent
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Taxonomy                              $wpseo_post_type
 * @uses Yoast_View_Utils                         $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 */

use Yoast\WP\SEO\Presenters\Admin\Badge_Presenter;

$frontpage_settings_badge = new Badge_Presenter( 'frontpage_settings' );
echo '<p>' . $frontpage_settings_badge->present() . '</p>';

\esc_html_e( 'These are the title, description and image used in the Open Graph meta tags on the front page of your site.', 'wordpress-seo' );

echo '<div id="yoast-og-frontpage-image-select"></div>';

$yform->hidden( 'og_frontpage_image', 'og_frontpage_image' );
$yform->hidden( 'og_frontpage_image_id', 'og_frontpage_image_id' );

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'og_frontpage_title',
		'description'           => 'og_frontpage_desc',
		'page_type_recommended' => $recommended_replace_vars->get_recommended_replacevars(),
		'page_type_specific'    => [],
		'paper_style'           => false,
		'label' =>'hello'
	]
);
$editor->render();

// Offer copying of meta description.
$homepage_meta_description = WPSEO_Options::get( 'metadesc-home-wpseo' );

if ( ! empty( $homepage_meta_description ) ) {
	$copy_home_description_button_label = \esc_html__( 'Use meta description of your homepage', 'wordpress-seo' );

	$copy_home_description_help = \sprintf(
	/* translators: 1: link open tag; 2: link close tag., 3: the translated label of the button */
		\esc_html__( 'Click the "%3$s" button below to use the meta description set in the %1$sGeneral%2$s tab which is used for your homepage.', 'wordpress-seo' ),
		'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_titles' ) ) . '">',
		'</a>',
		// $copy_home_description_button_label is escaped above.
		$copy_home_description_button_label
	);

	echo '<input type="hidden" id="meta_description" value="' . \esc_attr( $homepage_meta_description ) . '" />';
	echo '<div class="copy-home-meta-description"><p>' . $copy_home_description_help . '</p>' .
		 // phpcs:ignore WordPress.Security.EscapeOutput -- $copy_home_description_button_label is escaped above.
		 '<button type="button" id="copy-home-meta-description" class="yoast-button">' . $copy_home_description_button_label . '</button>' .
		 '</div>';
}
