<?php
/**
 * @package WPSEO\Admin
 */

?>
<h2><span class="dashicons dashicons-<?php echo $dashicon; ?>"></span> <?php echo $i18n_title ?>
	(<?php echo $active_total ?>)</h2>

<div id="yoast-<?php echo $type ?>">

	<?php if ( $total ) : ?>

		<p><?php echo $i18n_issues; ?></p>

		<div class="container" id="yoast-<?php echo $type ?>-active">
			<?php
			foreach ( $active as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="dismiss"><span class="dashicons dashicons-no-alt"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<?php if ( $active && $dismissed ) : ?>
			<div class="separator"></div>
		<?php endif; ?>

		<div class="container" id="yoast-<?php echo $type ?>-dismissed">
			<?php
			foreach ( $dismissed as $notification ) {
				printf( '<div class="yoast-alert-holder" id="%s" data-nonce="%s" data-json="%s">%s<div class="restore"><span class="dashicons dashicons-hidden"></span></div></div>', $notification->get_id(), $notification->get_nonce(), $notification->get_json(), $notification );
			}
			?>
		</div>

		<div class="yoast-bottom-spacing"></div>

	<?php else : ?>

		<p><?php echo $i18n_no_issues; ?></p>

	<?php endif; ?>
</div>
