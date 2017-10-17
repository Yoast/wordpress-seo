<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! current_theme_supports( 'title-tag' ) ) {
	$yform->light_switch( 'forcerewritetitle', __( 'Force rewrite titles', 'wordpress-seo' ) );
	echo '<p class="description">',
		sprintf(
	 		/* translators: %1$s expands to Yoast SEO */
			__( '%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it\'s wrong and you know what you\'re doing, you can change the setting here.', 'wordpress-seo' ),
			'Yoast SEO'
		) . '</p>';
}

echo '<h2>' . esc_html__( 'Title Separator', 'wordpress-seo' ) . '</h2>';

$legend      = __( 'Title separator symbol', 'wordpress-seo' );
$legend_attr = array( 'class' => 'radiogroup screen-reader-text' );
$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options(), $legend, $legend_attr );
echo '<p class="description">', __( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name.', 'wordpress-seo' ), ' ', __( 'Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ), '</p>';
