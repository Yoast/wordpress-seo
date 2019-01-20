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
    
	if ( ! empty( $post_types ) && is_array( $post_types ) ) {
		foreach ( $post_types as $post_type ) {
			 $post_type_object = get_post_type_object( $post_type );

			register_graphql_field( $post_type_object->graphql_single_name, 'seotitle', [
					'type' => 'String',
					'description' => __( 'The Yoast SEO Title of the '.$post_type_object->graphql_single_name, 'wp-graphql' ),
					'resolve' => function( $post ) {
						$title = get_post_meta( $post->ID, '_yoast_wpseo_title', true );
						return ! empty( $title ) ? $title : null;
					}
			 ]);

			 register_graphql_field( $post_type_object->graphql_single_name, 'seometadesc', [
					'type' => 'String',
					'description' => __( 'The Yoast SEO Description of the '.$post_type_object->graphql_single_name, 'wp-graphql' ),
					'resolve' => function( $post ) {
						$desc = get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true );
						return ! empty( $desc ) ? $desc : null;
					}
			 ]);

		} 
	}

} );
