<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 *
 * @uses    array $notifications_data
 */

$type     = 'errors';
$dashicon = 'warning';

$active    = $notifications_data['errors']['active'];
$dismissed = $notifications_data['errors']['dismissed'];

$active_total    = count( $active );
$dismissed_total = count( $dismissed );
$total           = $notifications_data['metrics']['errors'];

$i18n_title              = __( 'Problems', 'wordpress-seo' );
$i18n_issues             = __( 'We have detected the following issues that affect the SEO of your site.', 'wordpress-seo' );
$i18n_no_issues          = __( 'Good job! We could detect no serious SEO problems.', 'wordpress-seo' );
$i18n_muted_issues_title = sprintf(
	/* translators: %d expands the amount of hidden problems. */
	_n( 'You have %d hidden problem:', 'You have %d hidden problems:', $dismissed_total, 'wordpress-seo' ),
	$dismissed_total
);

require WPSEO_PATH . 'admin/views/partial-notifications-template.php';
