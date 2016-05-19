<h2><span class="dashicons dashicons-flag"></span> <?php _e( 'Notifications', 'wordpress-seo' ); ?>
	(<?php echo count( $alerts_data['warnings']['active'] ); ?>)</h2>

<div id="yoast-warnings">
	
	<?php if ( $alerts_data['metrics']['warnings'] ): ?>

		<p><?php _e( 'If you want to optimize your site properly you should follow the following suggestions to further improve	your site for search engines.', 'wordpress-seo' ); ?></p>

		<div class="container" id="yoast-warnings-dismissible">
			<?php
			foreach ( $alerts_data['warnings']['active'] as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="dismiss"><span class="dashicons dashicons-no-alt"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<?php if ( $alerts_data['warnings']['active'] && $alerts_data['warnings']['dismissed'] ): ?>
			<div class="separator"></div>
		<?php endif; ?>

		<div class="container" id="yoast-warnings-dismissed">
			<?php
			foreach ( $alerts_data['warnings']['dismissed'] as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="restore"><span class="dashicons dashicons-hidden"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<div class="yoast-bottom-spacing"></div>

	<?php else: ?>

		<p><?php _e( 'There are no warnings.', 'wordpress-seo' ); ?></p>

	<?php endif; ?>
</div>
	