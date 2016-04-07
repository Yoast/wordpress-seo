<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>
	<p>
		<?php _e( 'Pinterest uses Open Graph metadata just like Facebook, so be sure to keep the Open Graph checkbox on the Facebook tab checked if you want to optimize your site for Pinterest.', 'wordpress-seo' ); ?>
	</p>
	<p>
		<?php _e( 'If you have already confirmed your website with Pinterest, you can skip the step below.', 'wordpress-seo' ); ?>
	</p>
	<p>
		<?php
		/* translators: %1$s / %2$s expands to a link to pinterest.com's help page. */
		printf( __( 'To %1$sconfirm your site with Pinterest%2$s, add the meta tag here:', 'wordpress-seo' ), '<a target="_blank" href="https://help.pinterest.com/en/articles/confirm-your-website#meta_tag">', '</a>' );
		?>
	</p>

<?php $yform->textinput( 'pinterestverify', __( 'Pinterest confirmation', 'wordpress-seo' ) ); ?>

<?php

do_action( 'wpseo_admin_pinterest_section' );
