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

?>
<h2><?php esc_html_e( 'Crawl settings', 'wordpress-seo' ); ?></h2>
<div class="yoast-measure">
<?php
	echo sprintf(
		/* translators: %1$s expands to Yoast SEO */
		esc_html__( 'To make the crawling of your site more efficient and environmental friendly, %1$s allows you to remove RSS feeds (added by WordPress) that might not be needed for your site.', 'wordpress-seo' ),
		'Yoast SEO'
	);

	$help_text  = esc_html__( 'This removes the Post Comment Feed link.', 'wordpress-seo' );
	$help_text .= ' ';
	$help_text .= sprintf(
		'<a href="#" target="_blank" rel="noopener noreferrer">%1$s</a>',
		esc_html__( 'Find out how removing feeds can improve performance.', 'wordpress-seo' )
	);

	$feature_help = new WPSEO_Admin_Help_Panel(
		'remove_feed_post_comments',
		/* translators: %s expands to a feature's name */
		esc_html__( 'Help on: Post comment feeds', 'wordpress-seo' ),
		$help_text
	);

	$yform->toggle_switch(
		'remove_feed_post_comments',
		[
			'off' => __( 'Keep', 'wordpress-seo' ),
			'on'  => __( 'Remove', 'wordpress-seo' ),
		],
		__( 'Post comment feeds', 'wordpress-seo' )
	);
	?>
</div>
<?php
/*
 * Required to prevent our settings framework from saving the default because the field isn't
 * explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
