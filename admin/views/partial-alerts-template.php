<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! function_exists( '_yoast_display_alerts' ) ) {
	/**
	 * Create the alert HTML with restore/dismiss button
	 *
	 * @param array  $list   List of alerts.
	 * @param string $status Status of the alerts (active/dismissed).
	 */
	function _yoast_display_alerts( $list, $status ) {
		foreach ( $list as $notification ) {

			switch ( $status ) {
				case 'active':
					$button = sprintf( '<button type="button" class="button dismiss"><span class="screen-reader-text">%1$s</span><span class="dashicons dashicons-no-alt"></span></button>', esc_html__( 'Dismiss this item.', 'wordpress-seo' ) );
					break;

				case 'dismissed':
					$button = sprintf( '<button type="button" class="button restore"><span class="screen-reader-text">%1$s</span><span class="dashicons dashicons-hidden"></span></button>', esc_html__( 'Restore this item.', 'wordpress-seo' ) );
					break;
			}

			printf(
				'<div class="yoast-alert-holder" id="%1$s" data-nonce="%2$s" data-json="%3$s">%4$s%5$s</div>',
				esc_attr( $notification->get_id() ),
				esc_attr( $notification->get_nonce() ),
				esc_attr( $notification->get_json() ),
				$notification,
				$button
			);
		}
	}
}

$wpseo_i18n_summary = $i18n_issues;
if ( ! $active ) {
	$dashicon           = 'yes';
	$wpseo_i18n_summary = $i18n_no_issues;
}

?>
<h3><span class="dashicons <?php echo esc_attr( 'dashicons-' . $dashicon ); ?>"></span> <?php echo esc_html( $i18n_title ); ?> (<?php echo (int) $active_total; ?>)</h3>

<div id="<?php echo esc_attr( 'yoast-' . $type ); ?>">

	<?php if ( $total ) : ?>
		<p><?php echo esc_html( $wpseo_i18n_summary ); ?></p>

		<div class="container" id="<?php echo esc_attr( 'yoast-' . $type . '-active' ); ?>">
			<?php _yoast_display_alerts( $active, 'active' ); ?>
		</div>

		<?php if ( $dismissed ) : ?>
			<h4 class="yoast-muted-title"><?php echo esc_html( $i18n_muted_issues_title ); ?></h4>
		<?php endif; ?>

		<div class="container" id="<?php echo esc_attr( 'yoast-' . $type . '-dismissed' ); ?>">
			<?php _yoast_display_alerts( $dismissed, 'dismissed' ); ?>
		</div>

	<?php else : ?>

		<p><?php echo esc_html( $i18n_no_issues ); ?></p>

	<?php endif; ?>
</div>
