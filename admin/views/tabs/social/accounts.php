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

if ( $company_or_person === 'person' ) {
	echo '<div class="paper tab-block">';
	echo '<h2>' . esc_html__( 'Personal social profiles', 'wordpress-seo' ) . '</h2>';
	echo '<p>';
	$user_id = WPSEO_Options::get( 'company_or_person_user_id', '' );
	$person  = get_userdata( $user_id );
	printf(
		/* translators: 1: link to edit user page. */
		esc_html__( 'Your website is currently configured to represent a person. If you want to edit the social accounts for your site, please go to the user profile of the selected person: %1$s.', 'wordpress-seo' ),
		'<a href="' . esc_url( admin_url( 'user-edit.php?user_id=' . $user_id ) ) . '">' . esc_html( $person->display_name ) . '</a>'
	);
	echo '</p>';
	echo '<p>';
	printf(
		/* translators: 1: link tag to the relevant WPSEO admin page; 2: link close tag. */
		esc_html__( 'If you want your site to represent an Organization, please select \'Organization\' in the \'Knowledge Graph & Schema.org\' section of the %1$sSearch Appearance%2$s settings.', 'wordpress-seo' ),
		'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles' ) ) . '">',
		'</a>'
	);
	echo '</p></div>';
}

if ( $company_or_person === 'company' ) {
	// phpcs:ignore WordPress.Security.EscapeOutput -- string is properly escaped.
	echo '<div id="yoast-social-profiles"></div>';
}

do_action( 'wpseo_admin_other_section' );
