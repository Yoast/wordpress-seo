<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! empty( $tab_video_url ) ) :

	$id = uniqid( 'video-tab-' );

	?>
	<div class="wpseo-tab-video-container">
		<button type="button" class="wpseo-tab-video-container__handle" aria-controls="<?php echo $id ?>" aria-expanded="false">
			<span class="dashicons-before dashicons-format-video"><?php _e( 'Watch Joost explain all the settings on this tab.', 'wordpress-seo' ) ?></span> <span class="dashicons dashicons-arrow-down toggle__arrow"></span>
		</button>
		<div id="<?php echo $id ?>" class="wpseo-tab-video-slideout" aria-hidden="true">
			<div class="wpseo-tab-video__panel wpseo-tab-video__panel--video">
				<div class="wpseo-tab-video__data" data-url="<?php echo $tab_video_url ?>"></div>
			</div>
			<div class="wpseo-tab-video__panel wpseo-tab-video__panel--text">
				<div class="wpseo-tab-video__panel__textarea">
					<h3><?php _e( 'Need more help?', 'wordpress-seo' ); ?></h3>
					<p><?php _e( 'If you buy Yoast SEO Premium you\'ll get access to our support team and bonus features!', 'wordpress-seo' ); ?></p>
					<p><a href="https://yoa.st/seo-premium-vt"
					      target="_blank"><?php _e( 'Get Yoast SEO Premium &raquo;', 'wordpress-seo' ); ?></a></p>
				</div>
				<div class="wpseo-tab-video__panel__textarea">
					<h3><?php _e( 'Want to be a Yoast SEO Expert?', 'wordpress-seo' ); ?></h3>
					<p><?php _e( 'Follow our Yoast SEO for WordPress training and become a certified Yoast SEO Expert!', 'wordpress-seo' ); ?></p>
					<p><a href="https://yoa.st/wordpress-training-vt"
					      target="_blank"><?php _e( 'Enroll in the Yoast SEO for WordPress training &raquo;', 'wordpress-seo' ); ?></a>
					</p>
				</div>
			</div>
		</div>
	</div>
	<?php

endif;
