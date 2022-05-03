<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\General
 *
 * @uses    Yoast_Form $yform Form object.
 */

echo esc_html__( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name. Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' );

$legend      = __( 'Title separator symbol', 'wordpress-seo' );
$legend_attr = [ 'class' => 'radiogroup screen-reader-text' ];
$yform->radio( 'separator', WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(), $legend, $legend_attr );

