<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 *
 * @uses    array $alerts_data
 */

$type     = 'warnings';
$dashicon = 'flag';

$active    = $alerts_data['warnings']['active'];
$dismissed = $alerts_data['warnings']['dismissed'];

$active_total    = count( $alerts_data['warnings']['active'] );
$dismissed_total = count( $alerts_data['warnings']['dismissed'] );
$total           = $alerts_data['metrics']['warnings'];

$i18n_title              = __( 'Notifications', 'wordpress-seo' );
$i18n_issues             = '';
$i18n_no_issues          = __( 'No new notifications.', 'wordpress-seo' );
$i18n_muted_issues_title = sprintf(
	/* translators: %d expands the amount of hidden notifications. */
	_n( 'You have %d hidden notification:', 'You have %d hidden notifications:', $dismissed_total, 'wordpress-seo' ),
	$dismissed_total
);

require WPSEO_PATH . 'admin/views/partial-alerts-template.php';
