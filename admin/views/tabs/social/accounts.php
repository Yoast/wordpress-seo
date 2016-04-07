<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?><p>
	<?php _e( 'To inform Google about your social profiles, we need to know their URLs.', 'wordpress-seo' ); ?>
	<?php _e( 'For each, pick the main account associated with this site and please enter them below:', 'wordpress-seo' ); ?>
</p>
<?php
$yform->textinput( 'facebook_site', __( 'Facebook Page URL', 'wordpress-seo' ) );
$yform->textinput( 'twitter_site', __( 'Twitter Username', 'wordpress-seo' ) );
$yform->textinput( 'instagram_url', __( 'Instagram URL', 'wordpress-seo' ) );
$yform->textinput( 'linkedin_url', __( 'LinkedIn URL', 'wordpress-seo' ) );
$yform->textinput( 'myspace_url', __( 'MySpace URL', 'wordpress-seo' ) );
$yform->textinput( 'pinterest_url', __( 'Pinterest URL', 'wordpress-seo' ) );
$yform->textinput( 'youtube_url', __( 'YouTube URL', 'wordpress-seo' ) );
$yform->textinput( 'google_plus_url', __( 'Google+ URL', 'wordpress-seo' ) );

do_action( 'wpseo_admin_other_section' );
