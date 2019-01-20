<?php
/**
 * Plugin Name:     WPGraphql Yoast Seo
 * Plugin URI:      https://github.com/ashhitch/wp-graphql-yoast-seo
 * Description:     A WPGraphQL Extension that adds support for Yoast SEO
 * Author:          Ash Hitchcock
 * Author URI:      https://www.ashleyhitchcock.com
 * Text Domain:     wp-graphql-yoast-seo
 * Domain Path:     /languages
 * Version:         1.0.0
 *
 * @package         WP_Graphql_YOAST_SEO
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'graphql_register_types', function() {

	$post_types = \WPGraphQL::$allowed_post_types;

	register_graphql_object_type( 'SEO', [
    'fields' => [
      'title' => [ 'type' => 'String' ],
      'desc'   => [ 'type' => 'String' ],
      'focuskw'   => [ 'type' => 'String' ],
      'ogtitle'   => [ 'type' => 'String' ],
      'ogdesc'   => [ 'type' => 'String' ],
    ],
  ] );
    
	if ( ! empty( $post_types ) && is_array( $post_types ) ) {
		foreach ( $post_types as $post_type ) {
			 $post_type_object = get_post_type_object( $post_type );

			 
			register_graphql_field( $post_type_object->graphql_single_name, 'seo', [
					'type' => 'SEO',
					'description' => __( 'The Yoast SEO data of the '.$post_type_object->graphql_single_name, 'wp-graphql' ),
					'resolve' => function( $post ) {
						// Base array
						$seo = array();

						// Get data
						$title = get_post_meta( $post->ID, '_yoast_wpseo_title', true );
						$desc = get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true );
						$focuskw = get_post_meta( $post->ID, '_yoast_wpseo_focuskw-description', true );
						$ogTitle = get_post_meta( $post->ID, '_yoast_wpseo_opengraph-title', true );
						$ogDesc = get_post_meta( $post->ID, '_yoast_wpseo_opengraph-description', true );
			
						// Build Array
						$seo["title"] = ! empty( $title ) ? $title : null;
						$seo["desc"] = ! empty( $desc ) ? $desc : null;
						$seo["focuskw"] = ! empty( $focuskw ) ? $focuskw : null;
						$seo["ogdesc"] = ! empty( $ogDesc ) ? $ogDesc : null;
						

						return ! empty( $seo ) ? $seo : null;
					}
			 ]);
			 


		} 
	}

} );
