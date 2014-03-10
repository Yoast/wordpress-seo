<?php
/**
 * @package Admin
 * @todo Add default content (when no premium plugins are activated)
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;
?>

<div class="wrap wpseo_table_page">

	<h2 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h2>

	<?php settings_errors(); ?>

	<?php do_action('wpseo_licenses_forms'); ?>

</div>