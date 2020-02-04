<?php
/**
 * Plugin Name:     WPGraphql Yoast Seo
 * Plugin URI:      https://github.com/ashhitch/wp-graphql-yoast-seo
 * Description:     A WPGraphQL Extension that adds support for Yoast SEO
 * Author:          Ash Hitchcock
 * Author URI:      https://www.ashleyhitchcock.com
 * Text Domain:     wp-graphql-yoast-seo
 * Domain Path:     /languages
 * Version:         3.1.0
 *
 * @package         WP_Graphql_YOAST_SEO
 */
if (!defined('ABSPATH')) {
  exit();
}

use WPGraphQL\AppContext;
use WPGraphQL\Data\DataSource;

add_action('graphql_register_types', function () {
  $post_types = \WPGraphQL::get_allowed_post_types();
  $taxonomies = \WPGraphQL::get_allowed_taxonomies();

  // If WooCommerce installed then add these post types and taxonomies
    if ( class_exists( '\WooCommerce' ) ) {
      array_push($post_types, 'product');
      array_push($taxonomies, 'productCategory');
    }

  register_graphql_object_type('SEO', [
    'fields' => [
      'title' => ['type' => 'String'],
      'metaDesc' => ['type' => 'String'],
      'focuskw' => ['type' => 'String'],
      'metaKeywords' => ['type' => 'String'],
      'metaRobotsNoindex' => ['type' => 'String'],
      'metaRobotsNofollow' => ['type' => 'String'],
      'opengraphTitle' => ['type' => 'String'],
      'opengraphDescription' => ['type' => 'String'],
      'opengraphImage' => ['type' => 'MediaItem'],
      'twitterTitle' => ['type' => 'String'],
      'twitterDescription' => ['type' => 'String'],
      'twitterImage' => ['type' => 'MediaItem']
    ]
  ]);


  if (!empty($post_types) && is_array($post_types)) {
    foreach ($post_types as $post_type) {
      $post_type_object = get_post_type_object($post_type);

      if (isset($post_type_object->graphql_single_name)):
        register_graphql_field($post_type_object->graphql_single_name, 'seo', [
          'type' => 'SEO',
          'description' => __('The Yoast SEO data of the ' . $post_type_object->graphql_single_name, 'wp-graphql'),
          'resolve' => function ($post, array $args, AppContext $context) {

            // Connect to Yoast
            $wpseo_frontend = WPSEO_Frontend::get_instance();
            $wpseo_frontend->reset();

            // Base array
            $seo = array();

            query_posts(array(
              'p' => $post->ID,
              'post_type' => 'any'
            ));
            the_post();

            // Get data
            $seo = array(
              'title' => trim($wpseo_frontend->title($post)),
              'metaDesc' => trim($wpseo_frontend->metadesc(false)),
              'focuskw' => trim(get_post_meta($post->ID, '_yoast_wpseo_focuskw', true)),
              'metaKeywords' => trim(get_post_meta($post->ID, '_yoast_wpseo_metakeywords', true)),
              'metaRobotsNoindex' => trim(get_post_meta($post->ID, '_yoast_wpseo_meta-robots-noindex', true)),
              'metaRobotsNofollow' => trim(get_post_meta($post->ID, '_yoast_wpseo_meta-robots-nofollow', true)),
              'opengraphTitle' => trim(get_post_meta($post->ID, '_yoast_wpseo_opengraph-title', true)),
              'opengraphDescription' => trim(get_post_meta($post->ID, '_yoast_wpseo_opengraph-description', true)),
              'opengraphImage' => DataSource::resolve_post_object(get_post_meta($post->ID, '_yoast_wpseo_opengraph-image-id', true), $context),
              'twitterTitle' => trim(get_post_meta($post->ID, '_yoast_wpseo_twitter-title', true)),
              'twitterDescription' => trim(get_post_meta($post->ID, '_yoast_wpseo_twitter-description', true)),
              'twitterImage' =>  DataSource::resolve_post_object(get_post_meta($post->ID, '_yoast_wpseo_twitter-image-id', true), $context)
            );
            wp_reset_query();

            return !empty($seo) ? $seo : null;
          }
        ]);
      endif;
    }
  }
  
  if (!empty($taxonomies) && is_array($taxonomies)) {
    foreach ($taxonomies as $tax) {

			$taxonomy = get_taxonomy( $tax );
			
			if ( empty( $taxonomy ) || ! isset( $taxonomy->graphql_single_name ) ) {
				return;
			}
			

        register_graphql_field($taxonomy->graphql_single_name, 'seo', [
          'type' => 'SEO',
          'description' => __('The Yoast SEO data of the ' . $taxonomy->label . ' taxonomy.', 'wp-graphql'),
          'resolve' => function ($term, array $args, AppContext $context) {

            $term_obj = get_term($term->term_id);

            query_posts( array(
              'tax_query' => array(
                array(
                  'taxonomy' => $term_obj->taxonomy,
                  'terms' => $term_obj->term_id,
                  'field' => 'term_id'
                )
              )
              )
            );
            the_post();
  
            $wpseo_frontend = WPSEO_Frontend::get_instance();
            $wpseo_frontend->reset();
          
            $meta =	WPSEO_Taxonomy_Meta::get_term_meta((int) $term_obj->term_id, $term_obj->taxonomy);

            // Get data
            $seo = array(
              'title' => trim($wpseo_frontend->title($post)),
              'metaDesc' => trim($wpseo_frontend->metadesc( false )),
              'focuskw' => trim($meta['wpseo_focuskw']),
              'metaKeywords' => trim($meta['wpseo_metakeywords']),
              'metaRobotsNoindex' => trim($meta['wpseo_meta-robots-noindex']),
              'metaRobotsNofollow' => trim($meta['wpseo_meta-robots-nofollow']),
              'opengraphTitle' => trim($meta['wpseo_opengraph-title']),
              'opengraphDescription' => trim($meta['wpseo_opengraph-description']),
              'opengraphImage' => DataSource::resolve_post_object($meta['wpseo_opengraph-image-id'], $context),
              'twitterTitle' => trim($meta['wpseo_twitter-title']),
              'twitterDescription' => trim($meta['wpseo_twitter-description']),
              'twitterImage' => DataSource::resolve_post_object($meta['wpseo_twitter-image-id'], $context)
            );
            wp_reset_query();
  
            return !empty($seo) ? $seo : null;
          }
        ]);  

    }
  }
});
