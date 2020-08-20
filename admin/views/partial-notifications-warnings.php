<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 *
 * @uses    array $notifications_data
 */

$type     = 'warnings';
$dashicon = 'flag';

$active    = $notifications_data['warnings']['active'];
$dismissed = $notifications_data['warnings']['dismissed'];

$active_total    = count( $notifications_data['warnings']['active'] );
$dismissed_total = count( $notifications_data['warnings']['dismissed'] );
$total           = $notifications_data['metrics']['warnings'];

$i18n_title              = __( 'Notifications', 'wordpress-seo' );
$i18n_issues             = '';
$i18n_no_issues          = __( 'No new notifications.', 'wordpress-seo' );
$i18n_muted_issues_title = sprintf(
	/* translators: %d expands the amount of hidden notifications. */
	_n( 'You have %d hidden notification:', 'You have %d hidden notifications:', $dismissed_total, 'wordpress-seo' ),
	$dismissed_total
);

require WPSEO_PATH . 'admin/views/partial-notifications-template.php';
