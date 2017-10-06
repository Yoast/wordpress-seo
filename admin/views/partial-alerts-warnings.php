<?php
/**
 * @package WPSEO\Admin
 */

$type = 'warnings';
$dashicon = 'flag';

$i18n_title = __( 'Notifications', 'wordpress-seo' );
$i18n_issues = '';
$i18n_no_issues = __( 'No new notifications.', 'wordpress-seo' );
$i18n_muted_issues_title = __( 'Muted notifications:', 'wordpress-seo' );

$active_total = count( $alerts_data['warnings']['active'] );
$total = $alerts_data['metrics']['warnings'];

$active = $alerts_data['warnings']['active'];
$dismissed = $alerts_data['warnings']['dismissed'];

include WPSEO_PATH . 'admin/views/partial-alerts-template.php';
