<?php
/**
 * Plugin Name:     WPGraphql Yoast Seo
 * Plugin URI:      https://github.com/ashhitch/wp-graphql-yoast-seo
 * Description:     A WPGraphQL Extension that adds support for YOast SEO
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
    ],
  ] );
    
	if ( ! empty( $post_types ) && is_array( $post_types ) ) {
		foreach ( $post_types as $post_type ) {
			 $post_type_object = get_post_type_object( $post_type );

			 
			register_graphql_field( $post_type_object->graphql_single_name, 'seo', [
					'type' => 'SEO',
					'description' => __( 'The Yoast SEO data of the '.$post_type_object->graphql_single_name, 'wp-graphql' ),
					'resolve' => function( $post ) {

						$seo = array();
						$title = get_post_meta( $post->ID, '_yoast_wpseo_title', true );
						$desc = get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true );

						if(! empty($title)) {
								$seo["title"] = $title;
						}

						if(! empty($desc)) {
								$seo["desc"] = $desc;
						}

						return ! empty( $seo ) ? $seo : null;
					}
			 ]);
			 


		} 
	}

} );
