<?php
/**
 * AI Search Optimization Plugin (GEO).
 *
 * @package   GEO\Main
 * @copyright Copyright (C) 2024
 *
 * @wordpress-plugin
 * Plugin Name: AI Search Optimization Plugin (GEO)
 * Version:     1.0.0
 * Description: Optimize your content to rank in AI answers like ChatGPT and Google SGE.
 * Author:      GEO Optimization Team
 * License:     GPL v3
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Ensure the old Yoast constants don't conflict, but define what we need.
if ( ! defined( 'GEO_PLUGIN_FILE' ) ) {
	define( 'GEO_PLUGIN_FILE', __FILE__ );
}

if ( ! defined( 'GEO_DEBUG' ) ) {
    define( 'GEO_DEBUG', false );
}

// Feature Flags
if ( ! defined( 'GEO_FREE' ) ) {
    define( 'GEO_FREE', true );
}
if ( ! defined( 'GEO_PRO' ) ) {
    define( 'GEO_PRO', false );
}

// Load Core Files
require_once __DIR__ . '/core/seo-engine.php';
require_once __DIR__ . '/core/schema.php';
require_once __DIR__ . '/core/sitemap.php';

// Load GEO Engine Files
require_once __DIR__ . '/geo/entity-extractor.php';
require_once __DIR__ . '/geo/scoring.php';
require_once __DIR__ . '/geo/suggestions.php';
require_once __DIR__ . '/geo/summarizer.php';
require_once __DIR__ . '/geo/geo-engine.php';

// Load UI & API
require_once __DIR__ . '/admin/ui/editor-panel.php';
require_once __DIR__ . '/admin/ui/settings-page.php';
require_once __DIR__ . '/api/rest-routes.php';
require_once __DIR__ . '/services/license-manager.php';

// Boot the plugin
add_action( 'plugins_loaded', function() {

    // Check if GEO analysis is enabled
    $is_enabled = get_option('geo_enable_analysis', '1');
    if ($is_enabled === '1') {
        // Initialize Admin UI elements
        if ( is_admin() ) {
            $editor_panel = new \GEO\Admin\UI\Editor_Panel();
            $editor_panel->register();

            $settings_page = new \GEO\Admin\UI\Settings_Page();
            $settings_page->register();
        }

        // Initialize REST API
        add_action( 'rest_api_init', function() {
            $rest_routes = new \GEO\API\Rest_Routes();
            $rest_routes->register();
        });
    }
});
