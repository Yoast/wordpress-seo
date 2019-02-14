<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$social_profiles_help = new WPSEO_Admin_Help_Panel(
	'social-accounts',
	__( 'Learn more about your social profiles settings', 'wordpress-seo' ),
	__( 'To let search engines know which social profiles are associated to this site, enter your site social profiles data below.', 'wordpress-seo' ),
	'has-wrapper'
);

echo '<h2 class="help-button-inline">' . esc_html__( 'Your social profiles', 'wordpress-seo' ) . $social_profiles_help->get_button_html() . '</h2>';
echo $social_profiles_help->get_panel_html();

$yform = Yoast_Form::get_instance();
$yform->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/www\.facebook\.com\/[^\s\/]+' ) );
$yform->textinput( 'twitter_site', __( 'Twitter Username', 'wordpress-seo' ) );
$yform->textinput( 'instagram_url', __( 'Instagram URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/www\.instagram\.com\/[^\s\/]+' ) );
$yform->textinput( 'linkedin_url', __( 'LinkedIn URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/www\.linkedin\.com\/in\/[^\s\/]+' ) );
$yform->textinput( 'myspace_url', __( 'MySpace URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/myspace\.com\/[^\s\/]+' ) );
$yform->textinput( 'pinterest_url', __( 'Pinterest URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/www\.pinterest\.com\/[^\s\/]+' ) );
$yform->textinput( 'youtube_url', __( 'YouTube URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/www\.youtube\.com\/[^\s\/]+' ) );
$yform->textinput( 'google_plus_url', __( 'Google+ URL', 'wordpress-seo' ), array( 'type' => 'url', 'pattern' => '^https:\/\/plus\.google\.com\/[^\s\/]+' ) );

do_action( 'wpseo_admin_other_section' );
