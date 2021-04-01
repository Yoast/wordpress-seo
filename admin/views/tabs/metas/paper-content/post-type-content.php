<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Post_Type                             $wpseo_post_type
 * @uses Yoast_View_Utils                         $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 * @uses WPSEO_Admin_Editor_Specific_Replace_Vars $editor_specific_replace_vars
 */

use Yoast\WP\SEO\Presenters\Admin\Help_Link_Presenter;

$single_label = $wpseo_post_type->labels->singular_name;
$paper_style  = false;

/* translators: %s is the singular version of the post type's name. */
echo '<h3>' . esc_html( sprintf( __( 'Settings for single %s URLs', 'wordpress-seo' ), $wpseo_post_type->labels->singular_name ) ) . '</h3>';

require __DIR__ . '/post_type/post-type.php';

/**
 * Allow adding custom fields to the admin meta page, just before the archive settings - Content Types tab.
 *
 * @param Yoast_Form $yform The Yoast_Form object.
 * @param string     $name  The post type name.
 */
do_action( 'Yoast\WP\SEO\admin_post_types_archive', $yform, $wpseo_post_type->name );

if ( $wpseo_post_type->name === 'product' && YoastSEO()->helpers->woocommerce->is_active() ) {
	require __DIR__ . '/post_type/woocommerce-shop-page.php';

	return;
}

if ( WPSEO_Post_Type::has_archive( $wpseo_post_type ) ) {
	$plural_label = $wpseo_post_type->labels->name;

	/* translators: %s is the plural version of the post type's name. */
	echo '<h3>' . esc_html( sprintf( __( 'Settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h3>';

	$custom_post_type_archive_help = $view_utils->search_results_setting_help( $wpseo_post_type, 'archive' );

	$yform->index_switch(
		'noindex-ptarchive-' . $wpseo_post_type->name,
		sprintf(
			/* translators: %s expands to the post type's name. */
			__( 'the archive for %s', 'wordpress-seo' ),
			$plural_label
		),
		$custom_post_type_archive_help->get_button_html() . $custom_post_type_archive_help->get_panel_html()
	);

	$page_type = $recommended_replace_vars->determine_for_archive( $wpseo_post_type->name );

	$editor = new WPSEO_Replacevar_Editor(
		$yform,
		[
			'title'                 => 'title-ptarchive-' . $wpseo_post_type->name,
			'description'           => 'metadesc-ptarchive-' . $wpseo_post_type->name,
			'page_type_recommended' => $recommended_replace_vars->determine_for_archive( $wpseo_post_type->name ),
			'page_type_specific'    => $editor_specific_replace_vars->determine_for_archive( $wpseo_post_type->name ),
			'paper_style'           => false,
		]
	);
	$editor->render();

	$breadcrumbs_title_help_link = new Help_Link_Presenter(
		WPSEO_Shortlinker::get( 'https://yoa.st/4cf' ),
		\__( 'Learn more about the breadcrumbs title', 'wordpress-seo' )
	);

	echo '<div class="yoast-settings-section yoast-settings-section--last">';
	$yform->textinput_extra_content(
		'bctitle-ptarchive-' . $wpseo_post_type->name,
		\esc_html__( 'Breadcrumbs title', 'wordpress-seo' ),
		[ 'extra_content' => $breadcrumbs_title_help_link ]
	);
	echo '</div>';
}

/**
 * Allow adding a custom checkboxes to the admin meta page - Post Types tab.
 *
 * @deprecated 16.2 Use the {@see 'Yoast\WP\SEO\admin_post_types_archive'} action instead.
 *
 * @param  WPSEO_Admin_Pages  $yform The WPSEO_Admin_Pages object
 * @param  string             $name  The post type name
 */
do_action_deprecated(
	'wpseo_admin_page_meta_post_types',
	[ $yform, $wpseo_post_type->name ],
	'16.2',
	'Yoast\WP\SEO\admin_post_types_archive'
);
