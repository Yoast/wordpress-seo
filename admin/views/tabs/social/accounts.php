<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Your social profiles', 'wordpress-seo' ) . '</h2>';

echo '<p>';
esc_html_e( 'To let search engines know which social profiles are associated to this site, enter them below:', 'wordpress-seo' );
echo '</p>';

$yform->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ) );
$yform->textinput( 'twitter_site', __( 'Twitter Username', 'wordpress-seo' ) );
$yform->textinput( 'instagram_url', __( 'Instagram URL', 'wordpress-seo' ) );
$yform->textinput( 'linkedin_url', __( 'LinkedIn URL', 'wordpress-seo' ) );
$yform->textinput( 'myspace_url', __( 'MySpace URL', 'wordpress-seo' ) );
$yform->textinput( 'pinterest_url', __( 'Pinterest URL', 'wordpress-seo' ) );
$yform->textinput( 'youtube_url', __( 'YouTube URL', 'wordpress-seo' ) );
$yform->textinput( 'google_plus_url', __( 'Google+ URL', 'wordpress-seo' ) );

do_action( 'wpseo_admin_other_section' );
