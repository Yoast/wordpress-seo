<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   9.4.0.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>
<div class="wrap yoast">
<h1 id="wpseo-title"><?php echo esc_html( get_admin_page_title() ); ?></h1>
<?php

echo "<div id='yoast-courses-overview'></div>";

?>
</div>
