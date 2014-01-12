<?php
/**
 * @package ?
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


if ( ! class_exists( 'Sitemap_Walker' ) ) {
	/**
	 * This is a custom walker that is used to create tree lists for  
	 * custom post types and taxonomy
	 */
	class Sitemap_Walker extends Walker_Category {
		/**
		 * Record of posts added to tree
		 */
		private $processed_post_ids = array();
	
		/**
		 * Code that appends posts when a child node is reached
		 */
		function end_el( &$output, $object, $depth = 0, $args = array() ) {
			$tax_name = $args['taxonomy'];
			
			// use cat_id for category and slug for all other taxonomy
			$term_id = ($tax_name == 'category') ? $object->cat_ID : $object->slug;
				
			$query_args = array(
				'post_type'      => $args['post_type'],
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				
				"{$tax_name}" => $term_id,
				
				'meta_query' => array(
					'relation' => 'OR',
					// include if this key doesn't exists
					array(
						'key'     => '_yoast_wpseo_meta-robots-noindex',
						'value'   => '', // This is ignored, but is necessary...
						'compare' => 'NOT EXISTS',
					),
					// OR if key does exists include if it is not 1
					array(
						'key'     => '_yoast_wpseo_meta-robots-noindex',
						'value'   => '1',
						'compare' => '!=',
					),
					// OR this key overrides it
					array(
						'key'     => '_yoast_wpseo_sitemap-html-include',
						'value'   => 'always',
						'compare' => '=',
					),
				),
			);
	
			$posts = get_posts( $query_args );
	
			$output .= '<ul>';
			foreach ( $posts as $post ) {
				$category = get_the_terms( $post->ID, $tax_name );
				
				if ( $category ) {
					// reset array to get the first element
					$category = reset( $category );
				
					// Only display a post link once, even if it's in multiple taxonomies
					if ( $category->term_id == $object->term_id && ! in_array( $post->ID, $this->processed_post_ids ) ) {
						$this->processed_post_ids[] = $post->ID;
						$output .= '<li><a href="' . esc_url( get_permalink( $post->ID ) ) . '">' . get_the_title( $post->ID ) . '</a></li>';
					}
				}
			}
			$output .= '</ul>';
			parent::end_el( $output, $object, $depth, $args );
		}
	
	} /* End of class */
} /* End of class-exists wrapper */