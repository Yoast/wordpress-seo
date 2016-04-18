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
			<span class="dashicons-before dashicons-editor-help"><?php _e( 'Help center', 'wordpress-seo' ) ?></span> <span class="dashicons dashicons-arrow-down toggle__arrow"></span>
		</button>
		<div id="<?php echo $id ?>" class="wpseo-tab-video-slideout" aria-hidden="true">
			<div class="wpseo-tab-video__panel wpseo-tab-video__panel--video">
				<div class="wpseo-tab-video__data" data-url="<?php echo $tab_video_url ?>"></div>
			</div>
			<div class="wpseo-tab-video__panel wpseo-tab-video__panel--text">
				<div class="wpseo-tab-video__panel__textarea">
					<h3><?php _e( 'Need more help?', 'wordpress-seo' ); ?></h3>
					<?php /* translators: %s expands to Yoast SEO Premium */ ?>
					<p><?php printf( __( 'If you buy %s you\'ll get access to our support team and bonus features!', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></p>
					<?php /* translators: %s expands to Yoast SEO Premium */ ?>
					<p><a href="https://yoa.st/seo-premium-vt" target="_blank"><?php printf( __( 'Get %s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></a></p>
				</div>
				<div class="wpseo-tab-video__panel__textarea">
					<?php /* translators: %s expands to Yoast SEO */ ?>
					<h3><?php printf( __( 'Want to be a %s Expert?', 'wordpress-seo' ), 'Yoast SEO' ); ?></h3>
					<?php /* translators: %$1s expands to Yoast SEO */ ?>
					<p><?php printf( __( 'Follow our %1$s for WordPress training and become a certified %1$s Expert!', 'wordpress-seo' ), 'Yoast SEO' ); ?></p>
					<?php /* translators: %s expands to Yoast SEO for WordPress */ ?>
					<p><a href="https://yoa.st/wordpress-training-vt"
					      target="_blank"><?php printf( __( 'Enroll in the %s training &raquo;', 'wordpress-seo' ), 'Yoast SEO for WordPress' ); ?></a>
					</p>
				</div>
			</div>
		</div>
	</div>
	<?php

endif;
