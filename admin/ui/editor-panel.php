<?php
namespace GEO\Admin\UI;

class Editor_Panel {
    public function register() {
        // Hook into WP to add the meta box and enqueue scripts
        add_action('add_meta_boxes', [$this, 'add_geo_meta_box']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    public function add_geo_meta_box() {
        add_meta_box(
            'geo_editor_panel_box',
            'GEO Analysis',
            [$this, 'render'],
            ['post', 'page'],
            'side',
            'high'
        );
    }

    public function enqueue_scripts($hook) {
        if ($hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }

        wp_enqueue_script(
            'geo-editor-js',
            plugins_url('geo-editor.js', __FILE__), // Assuming this file resides in the same directory for MVP
            ['wp-data', 'wp-editor'],
            '1.0.0',
            true
        );

        wp_localize_script('geo-editor-js', 'geoData', [
            'apiUrl' => rest_url('geo/v1/analyze'),
            'nonce'  => wp_create_nonce('wp_rest')
        ]);
    }

    public function render() {
        // Minimal HTML entry point.
        // 1 screen per post, no tabs.
        // The Javascript (geo-editor.js) will inject the UI inside this div.
        echo '<div id="geo-editor-panel"></div>';
    }
}
