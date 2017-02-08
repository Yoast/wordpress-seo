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
			<span class="dashicons-before dashicons-editor-help"><?php _e( 'Help center', 'wordpress-seo' ) ?></span>
			<span class="dashicons dashicons-arrow-down toggle__arrow"></span>
		</button>
		<div id="<?php echo $id ?>" class="wpseo-tab-video-slideout hidden">
			<?php include dirname( __FILE__ ) . '/partial-help-center-video.php'; ?>
		</div>
	</div>
	<?php

endif;
