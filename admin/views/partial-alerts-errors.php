<?php
/**
 * @package WPSEO\Admin
 */

?>
<h2><span class="dashicons dashicons-warning"></span> <?php _e( 'Alerts', 'wordpress-seo' ); ?>
	(<?php echo count( $alerts_data['errors']['active'] ); ?>)</h2>

<div id="yoast-alerts">

	<?php if ( $alerts_data['metrics']['errors'] ) : ?>

		<p><?php _e( 'We have detected the following issues that involve a serious problem concerning the SEO of your site.' ) ?></p>

		<div class="container" id="yoast-alert-dismissible">
			<?php
			foreach ( $alerts_data['errors']['active'] as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="dismiss"><span class="dashicons dashicons-no-alt"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<?php if ( $alerts_data['errors']['active'] && $alerts_data['errors']['dismissed'] ) : ?>
			<div class="separator"></div>
		<?php endif; ?>

		<div class="container" id="yoast-alerts-dismissed">
			<?php
			foreach ( $alerts_data['errors']['dismissed'] as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="restore"><span class="dashicons dashicons-hidden"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<div class="yoast-bottom-spacing"></div>

	<?php else : ?>

		<p><?php _e( 'There are no issues.', 'wordpress-seo' ); ?></p>

	<?php endif; ?>
</div>
