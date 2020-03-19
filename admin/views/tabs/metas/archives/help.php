<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 */

$archives_help = new WPSEO_Admin_Help_Button(
	'search-appearance-archives',
	__( 'Learn more about the archives setting', 'wordpress-seo' ),
);

echo '<p class="help-button-inline"><strong>' . esc_html__( 'Archives settings help', 'wordpress-seo' ) . $archives_help . '</strong><p>';
