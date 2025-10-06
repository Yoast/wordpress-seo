<?php
/**
 * Simple test to verify the wpseo_llmstxt_include_excerpt filter works correctly.
 * This is not a formal unit test but a verification script.
 */

// This would be the kind of test that could be added to the test suite if needed:

function test_filter_functionality() {
    // Mock WP_Post object
    $post = new stdClass();
    $post->ID = 1;
    $post->post_title = 'Test Post';
    $post->post_excerpt = '[shortcode]Test excerpt content[/shortcode]';
    $post->post_name = 'test-post';
    
    // Mock Meta object
    $meta = new stdClass();
    $meta->post = $post;
    $meta->canonical = 'https://example.com/test-post';
    
    // Without any filter applied, the excerpt should pass through
    $entry_without_filter = \Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry::from_meta($meta);
    echo "Without filter: " . $entry_without_filter->get_description() . "\n";
    
    // Add filter to remove excerpt
    add_filter('wpseo_llmstxt_include_excerpt', function($excerpt, $post_obj) {
        return ''; // Remove excerpt
    }, 10, 2);
    
    // With filter applied, excerpt should be empty
    $entry_with_filter = \Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry::from_meta($meta);
    echo "With filter: " . $entry_with_filter->get_description() . "\n";
    
    // Add filter to strip shortcodes
    remove_all_filters('wpseo_llmstxt_include_excerpt');
    add_filter('wpseo_llmstxt_include_excerpt', function($excerpt, $post_obj) {
        return strip_shortcodes($excerpt); // Strip shortcodes only
    }, 10, 2);
    
    $entry_stripped_shortcode = \Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry::from_meta($meta);
    echo "With shortcode stripping: " . $entry_stripped_shortcode->get_description() . "\n";
}

// This is just an example - not meant to be executed here
echo "Filter test conceptual example completed.\n";