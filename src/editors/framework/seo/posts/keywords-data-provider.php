<?php

namespace Yoast\WP\SEO\Editors\Framework\Seo\Posts;

use WPSEO_Meta;
use Yoast\WP\SEO\Editors\Framework\Seo\Keywords_Interface;
use function apply_filters;

class Keywords_Data_Provider extends Abstract_Post_Seo_Data_Provider implements Keywords_Interface {

	/**
	 * Counts the number of given keywords used for other posts other than the given post_id.
	 *
	 * @return array The keyword and the associated posts that use it.
	 */
	public function get_focus_keyword_usage(): array {
		$keyword = WPSEO_Meta::get_value( 'focuskw', $this->post->ID );
		$usage   = [ $keyword => $this->get_keyword_usage_for_current_post( $keyword ) ];

		/**
		 * Allows enhancing the array of posts' that share their focus keywords with the post's related keywords.
		 *
		 * @param array $usage   The array of posts' ids that share their focus keywords with the post.
		 * @param int   $post_id The id of the post we're finding the usage of related keywords for.
		 */
		return apply_filters( 'wpseo_posts_for_related_keywords', $usage, $this->post->ID );
	}

	/**
	 * Retrieves the post types for the given post IDs.
	 *
	 * @param array $post_ids_per_keyword An associative array with keywords as keys and an array of post ids where those keywords are used.
	 * @return array The post types for the given post IDs.
	 */
	public function get_post_types_for_all_ids( $post_ids_per_keyword ) {
		$post_type_per_keyword_result = [];
		foreach ( $post_ids_per_keyword as $keyword => $post_ids ) {
			$post_type_per_keyword_result[ $keyword ] = WPSEO_Meta::post_types_for_ids( $post_ids );
		}

		return $post_type_per_keyword_result;
	}

	/**
	 * Gets the keyword usage for the current post and the specified keyword.
	 *
	 * @param string $keyword The keyword to check the usage of.
	 *
	 * @return array The post IDs which use the passed keyword.
	 */
	private function get_keyword_usage_for_current_post( $keyword ) {
		return WPSEO_Meta::keyword_usage( $keyword, $this->post->ID );
	}

}
