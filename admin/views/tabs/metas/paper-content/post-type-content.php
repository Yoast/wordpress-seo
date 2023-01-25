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

$single_label = $wpseo_post_type->labels->singular_name;
$paper_style  = false;

/* translators: %s is the singular version of the post type's name. */
echo '<h3>' . esc_html( sprintf( __( 'Single %s settings', 'wordpress-seo' ), $wpseo_post_type->labels->singular_name ) ) . '</h3>';

require __DIR__ . '/post_type/post-type.php';

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
// phpcs:ignore Yoast.NamingConventions.ValidHookName.MaxExceeded -- Added _internal suffix for clarity.
do_action( 'Yoast\WP\SEO\admin_post_types_beforearchive_internal', $yform, $wpseo_post_type->name );

/**
 * Allow adding custom fields to the admin meta page, just before the archive settings - Content Types tab.
 *
 * @deprecated 19.10 No replacement available.
 *
 * @param Yoast_Form $yform The Yoast_Form object.
 * @param string     $name  The post type name.
 */
do_action_deprecated(
	'Yoast\WP\SEO\admin_post_types_beforearchive',
	[ $yform, $wpseo_post_type->name ],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);

if ( $wpseo_post_type->name === 'product' && YoastSEO()->helpers->woocommerce->is_active() ) {
	require __DIR__ . '/post_type/woocommerce-shop-page.php';

	return;
}

if ( WPSEO_Post_Type::has_archive( $wpseo_post_type ) ) {
	$plural_label = $wpseo_post_type->labels->name;
	$archive_url  = get_post_type_archive_link( $wpseo_post_type->name );
	$label        = '<a href="' . esc_url( $archive_url ) . '">' . esc_html( $plural_label ) . '</a>';

	/* translators: %s is the plural version of the post type's name. */
	echo '<h3>' . esc_html( sprintf( __( '%s archive settings', 'wordpress-seo' ), $plural_label ) ) . '</h3>';

	echo '<div class="yoast-settings-section">';

	$custom_post_type_archive_help = $view_utils->search_results_setting_help( $wpseo_post_type, 'archive' );

	$yform->index_switch(
		'noindex-ptarchive-' . $wpseo_post_type->name,
		sprintf(
			/* translators: %s expands to the post type's name with a link to the archive. */
			esc_html__( 'the archive for %s', 'wordpress-seo' ),
			$label
		),
		$custom_post_type_archive_help->get_button_html() . $custom_post_type_archive_help->get_panel_html()
	);

	echo '</div>';

	echo '<div class="yoast-settings-section">';

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

	echo '</div>';

	if ( WPSEO_Options::get( 'breadcrumbs-enable' ) === true ) {
		echo '<div class="yoast-settings-section">';

		$yform->textinput_extra_content( 'bctitle-ptarchive-' . $wpseo_post_type->name, __( 'Breadcrumbs title', 'wordpress-seo' ) );

		echo '</div>';
	}

	/**
	 * WARNING: This hook is intended for internal use only.
	 * Don't use it in your code as it will be removed shortly.
	 */
	// phpcs:ignore Yoast.NamingConventions.ValidHookName.MaxExceeded -- Added _internal suffix for clarity.
	do_action( 'Yoast\WP\SEO\admin_post_types_archive_internal', $yform, $wpseo_post_type->name );

	/**
	 * Allow adding custom fields to the admin meta page at the end of the archive settings for a post type - Content Types tab.
	 *
	 * @deprecated 19.10 No replacement available.
	 *
	 * @param Yoast_Form $yform The Yoast_Form object.
	 * @param string     $name  The post type name.
	 */
	do_action_deprecated(
		'Yoast\WP\SEO\admin_post_types_archive',
		[ $yform, $wpseo_post_type->name ],
		'19.10',
		'',
		'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
	);
}
