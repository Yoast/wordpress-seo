<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Integrations
 *
 * @uses    Yoast_Form $yform Form object.
 */

$yform = Yoast_Form::get_instance();

// Ensure we don't accidentally reset the website ID.
$yform->hidden( 'wincher_website_id' );
