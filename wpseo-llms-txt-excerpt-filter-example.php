<?php
/**
 * Example file showing how to use the wpseo_llmstxt_include_excerpt filter
 * to remove excerpt values from the llms.txt file.
 *
 * To use this filter, add this code to your theme's functions.php file,
 * or in a custom plugin.
 */

/**
 * Remove excerpts from llms.txt file by returning an empty string.
 * 
 * @param string  $excerpt The excerpt content that would be included in llms.txt.
 * @param WP_Post $post    The post object.
 * @return string Empty string to remove excerpt, or return $excerpt to keep it.
 */
add_filter( 'wpseo_llmstxt_include_excerpt', function( $excerpt, $post ) {
    // Return empty string to exclude excerpt from llms.txt
    return '';
}, 10, 2 );

/**
 * Alternative: Conditionally remove excerpts based on post type
 */
add_filter( 'wpseo_llmstxt_include_excerpt', function( $excerpt, $post ) {
    // Remove excerpt for specific post types
    if ( in_array( $post->post_type, [ 'product', 'page' ], true ) ) {
        return '';
    }
    
    // Keep excerpt for other post types
    return $excerpt;
}, 10, 2 );

/**
 * Alternative: Strip shortcodes and HTML from excerpts before inclusion
 */
add_filter( 'wpseo_llmstxt_include_excerpt', function( $excerpt, $post ) {
    // Remove shortcodes and HTML tags from the excerpt
    $clean_excerpt = strip_shortcodes( $excerpt );
    $clean_excerpt = wp_strip_all_tags( $clean_excerpt );
    
    return $clean_excerpt;
}, 10, 2 );