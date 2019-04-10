<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses    Yoast_Form $yform Form object.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$social_profiles_help = new WPSEO_Admin_Help_Panel(
	'social-accounts',
	__( 'Learn more about your social profiles settings', 'wordpress-seo' ),
	__( 'To let search engines know which social profiles are associated to this site, enter your site social profiles data below.', 'wordpress-seo' ) . ' ' .
	__( 'If a Wikipedia page for you or your organization exists, add it too.', 'wordpress-seo' ),
	'has-wrapper'
);

$company_or_person = WPSEO_Options::get( 'company_or_person', '' );

$read_only = false;
if ( $company_or_person === 'person' ) {
	echo '<div class="paper tab-block">';
	echo '<h2><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Your website is currently configured to represent a Person', 'wordpress-seo' ) . '</h2>';
	echo '<p><em>';
	esc_html_e( 'That means that the form and information below is disabled, and not used.', 'wordpress-seo' );
	echo '</em></p>';
	echo '<p>';
	$user_id = WPSEO_Options::get( 'company_or_person_user_id', '' );
	$person  = get_userdata( $user_id );
	printf( esc_html__( 'To change the social accounts used for your site, update the details for %1$s.', 'wordpress-seo' ), '<a href="' . admin_url( 'user-edit.php?user_id=' . $user_id ) . '">' . $person->display_name . '</a>' );
	echo ' ';
	printf( esc_html__( 'To make your site represent a Company or Organization go to %1$sSearch Appearance%2$s and set Company or Person to "Company".', 'wordpress-seo' ), '<a href="' . admin_url( 'admin.php?page=wpseo_titles' ) . '">', '</a>' );
	echo '</p></div>';
	$read_only = 'readonly';
}

echo '<h2 class="help-button-inline">' . esc_html__( 'Organization social profiles', 'wordpress-seo' ) . $social_profiles_help->get_button_html() . '</h2>';
echo $social_profiles_help->get_panel_html();

$readonly_attributes = array(
	'readonly' => $read_only,
	'class'    => $read_only ? 'disabled' : '',
);

$yform = Yoast_Form::get_instance();
$yform->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'twitter_site', __( 'Twitter Username', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'instagram_url', __( 'Instagram URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'linkedin_url', __( 'LinkedIn URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'myspace_url', __( 'MySpace URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'pinterest_url', __( 'Pinterest URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'youtube_url', __( 'YouTube URL', 'wordpress-seo' ), $readonly_attributes );
$yform->textinput( 'wikipedia_url', __( 'Wikipedia URL', 'wordpress-seo' ), $readonly_attributes );

do_action( 'wpseo_admin_other_section' );
