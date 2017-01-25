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

	?>
	<h2 class="screen-reader-text"><?php esc_html_e( 'Video tutorial', 'wordpress-seo' ) ?></h2>
	<div class="wpseo-tab-video__panel wpseo-tab-video__panel--video">
		<div class="wpseo-tab-video__data yoast-video-container" data-url="<?php echo $tab_video_url ?>"></div>
	</div>
	<div class="wpseo-tab-video__panel wpseo-tab-video__panel--text">
		<?php

		// Don't show for Premium.
		if ( ! defined( 'WPSEO_PREMIUM_PLUGIN_FILE' ) ) :
			?>
			<div class="wpseo-tab-video__panel__textarea">
				<h3><?php _e( 'Need more help?', 'wordpress-seo' ); ?></h3>
				<?php /* translators: %s expands to Yoast SEO Premium */ ?>
				<p><?php printf( __( 'If you buy %s you\'ll get access to our support team and bonus features!', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></p>
				<p><a href="https://yoa.st/seo-premium-vt" target="_blank"><?php
				/* translators: %s expands to Yoast SEO Premium */
				printf( __( 'Get %s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' );
				?></a>
				</p>
			</div>
			<?php
		endif;
		?>
		<div class="wpseo-tab-video__panel__textarea">
			<?php /* translators: %s expands to Yoast SEO. */ ?>
			<h3><?php printf( __( 'Want to be a %s Expert?', 'wordpress-seo' ), 'Yoast SEO' ); ?></h3>
			<?php /* translators: %$1s expands to Yoast SEO */ ?>
			<p><?php printf( __( 'Follow our %1$s for WordPress training and become a certified %1$s Expert!', 'wordpress-seo' ), 'Yoast SEO' ); ?></p>
			<p><a href="https://yoa.st/wordpress-training-vt" target="_blank"><?php
			/* translators: %s expands to Yoast SEO for WordPress */
			printf( __( 'Enroll in the %s training &raquo;', 'wordpress-seo' ), 'Yoast SEO for WordPress' );
			?></a>
			</p>
		</div>
	</div>
	<?php

endif;
