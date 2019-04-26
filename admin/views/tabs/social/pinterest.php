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

echo '<h2>' . esc_html__( 'Pinterest settings', 'wordpress-seo' ) . '</h2>';

printf(
	'<p>%s</p>',
	esc_html__( 'Pinterest uses Open Graph metadata just like Facebook, so be sure to keep the Open Graph checkbox on the Facebook tab checked if you want to optimize your site for Pinterest.', 'wordpress-seo' )
);
printf(
	'<p>%s</p>',
	esc_html__( 'If you have already confirmed your website with Pinterest, you can skip the step below.', 'wordpress-seo' )
);

echo '<p>';
printf(
	/* translators: %1$s / %2$s expands to a link to pinterest.com's help page. */
	esc_html__( 'To %1$sconfirm your site with Pinterest%2$s, add the meta tag here:', 'wordpress-seo' ),
	'<a target="_blank" href="https://pinterest.com/settings/#claimWebsite">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'pinterestverify', __( 'Pinterest confirmation', 'wordpress-seo' ) );

do_action( 'wpseo_admin_pinterest_section' );
