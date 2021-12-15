<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Integrations
 *
 * @uses    Yoast_Form $yform Form object.
 */

use Yoast\WP\SEO\Conditionals\Wincher_Conditional;

// Don't render when feature flag is not enabled.
$conditional = new Wincher_Conditional();
if ( ! $conditional->is_met() ) {
	return;
}

$yform = Yoast_Form::get_instance();

// Ensure we don't accidentally reset the website ID.
$yform->hidden( 'wincher_website_id' );
