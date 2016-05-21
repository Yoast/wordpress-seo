<?php
/**
 * @package WPSEO\Admin
 */

$type = 'warnings';
$dashicon = 'flag';

$i18n_title = __( 'Warnings', 'wordpress-seo' );
$i18n_issues = __( 'If you want to optimize your site properly you should follow the following suggestions to further improve your site for search engines.', 'wordpress-seo' );
$i18n_no_issues = __( 'There are no warnings.', 'wordpress-seo' );

$active_total = count( $alerts_data['warnings']['active'] );
$total = $alerts_data['metrics']['warnings'];

$active = $alerts_data['warnings']['active'];
$dismissed = $alerts_data['warnings']['dismissed'];

include 'partial-alerts-template.php';
