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

$organization_social_fields = [
	[
		'id'    => 'facebook_site',
		'label' => __( 'Facebook Page URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'twitter_site',
		'label' => __( 'Twitter Username', 'wordpress-seo' ),
	],
	[
		'id'    => 'instagram_url',
		'label' => __( 'Instagram URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'linkedin_url',
		'label' => __( 'LinkedIn URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'myspace_url',
		'label' => __( 'MySpace URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'pinterest_url',
		'label' => __( 'Pinterest URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'youtube_url',
		'label' => __( 'YouTube URL', 'wordpress-seo' ),
	],
	[
		'id'    => 'wikipedia_url',
		'label' => __( 'Wikipedia URL', 'wordpress-seo' ),
	],
];

$yform = Yoast_Form::get_instance();

if ( $company_or_person === 'person' ) {
	echo '<div class="paper tab-block">';
	echo '<h2><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Your website is currently configured to represent a Person', 'wordpress-seo' ) . '</h2>';
	echo '<p><em>';
	esc_html_e( 'That means that the form and information below is disabled, and not used.', 'wordpress-seo' );
	echo '</em></p>';
	echo '<p>';
	$user_id = WPSEO_Options::get( 'company_or_person_user_id', '' );
	$person  = get_userdata( $user_id );
	printf(
		/* translators: 1: link to edit user page. */
		esc_html__( 'To change the social accounts used for your site, update the details for %1$s.', 'wordpress-seo' ),
		'<a href="' . esc_url( admin_url( 'user-edit.php?user_id=' . $user_id ) ) . '">' . esc_html( $person->display_name ) . '</a>'
	);
	echo ' ';
	printf(
		/* translators: 1: link tag to the relevant WPSEO admin page; 2: link close tag. */
		esc_html__( 'To make your site represent a Company or Organization go to %1$sSearch Appearance%2$s and set Organization or Person to "Organization".', 'wordpress-seo' ),
		'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles' ) ) . '">',
		'</a>'
	);
	echo '</p></div>';

	// Organization social fields should still be rendered, because other wise the values are lost on save.
	foreach ( $organization_social_fields as $organization ) {
		$yform->hidden( $organization['id'] );
	}
}

if ( $company_or_person === 'company' ) {
	echo '<h2 class="help-button-inline">' . esc_html__( 'Organization social profiles', 'wordpress-seo' ) . $social_profiles_help->get_button_html() . '</h2>';
	echo $social_profiles_help->get_panel_html();

	foreach ( $organization_social_fields as $organization ) {
		$yform->textinput( $organization['id'], $organization['label'] );
	}
}

do_action( 'wpseo_admin_other_section' );
