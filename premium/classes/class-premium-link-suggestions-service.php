<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Handles the actual requests to the prominent words endpoints.
 */
class WPSEO_Premium_Link_Suggestions_Service {
	const CACHE_PREFIX = 'wpseo_link_suggestions_';

	/**
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response for the query of link suggestions.
	 */
	public function query( WP_REST_Request $request ) {
		$prominent_words = $request->get_param( 'prominent_words' );

		return new WP_REST_Response( $this->get_suggestions( $prominent_words ) );
	}

	/**
	 * Makes a list of suggestions based on the passed prominent words.
	 *
	 * @param int[] $prominent_words The prominent words to base the link suggestion on.
	 * @return string[] Links for the post that are suggested.
	 */
	public function get_suggestions( $prominent_words ) {
		$posts = array();

		foreach ( $prominent_words as $prominent_word ) {
			$posts_query = $this->retrieve_posts( $prominent_word );

			$posts = $this->count( $posts_query, $posts );
		}

		usort( $posts, array( $this, 'compare_post_count' ) );

		$suggestions = array_map( array( $this, 'get_post_object' ), $posts );

		set_transient( $this->get_cache_key( $prominent_words ), $suggestions, WEEK_IN_SECONDS );

		return $suggestions;
	}

	/**
	 * Returns the tax query to retrieve posts of a prominent word.
	 *
	 * @param {int} $term_id The ID of the prominent word to get posts for.
	 * @return {array} The tax query for the prominent word.
	 */
	public function get_tax_query( $term_id ) {
		return array(
			array(
				'taxonomy' => WPSEO_Premium_Prominent_Words_Registration::TERM_NAME,
				'field' => 'term_id',
				'terms' => $term_id,
			),
		);
	}

	/**
	 * Creates the cache key for the list of prominent words.
	 *
	 * @param int[] $prominent_words The prominent words to cache the link suggestions for.
	 * @return string The cache key with which to save cache the link suggestions in the transients.
	 */
	public function get_cache_key( $prominent_words ) {
		sort( $prominent_words );

		return self::CACHE_PREFIX . md5( implode( ',', $prominent_words ) );
	}

	/**
	 * Retrieves posts that are connected to a specific prominent word.
	 *
	 * @param {int} $prominent_word_id ID of the prominent word to get posts for.
	 * @return WP_Query The query to retrieve the posts for the prominent word.
	 */
	private function retrieve_posts( $prominent_word_id ) {
		$query_args  = array(
			'tax_query' => $this->get_tax_query( $prominent_word_id ),
		);
		$posts_query = new WP_Query( $query_args );

		return $posts_query;
	}

	/**
	 * Increments post counts in $posts for posts that are present in the query.
	 *
	 * @param WP_Query $posts_query A query for posts in a specific prominent word.
	 * @param array    $posts A list of currently counted posts.
	 *
	 * @return array A new list of counted posts.
	 */
	private function count( $posts_query, $posts ) {
		foreach ( $posts_query->posts as $post ) {
			if ( array_key_exists( $post->ID, $posts ) ) {
				$posts[ $post->ID ]['count'] += 1;
			}
			else {
				$posts[ $post->ID ] = array(
					'count' => 1,
					'post'  => $post,
				);
			}
		}

		return $posts;
	}

	/**
	 * Compares post counts for use in usort.
	 *
	 * @param array $postA An associative array with a post object and a post count.
	 * @param array $postB An associative array with a post object and a post count.
	 * @return {int} -1 if $a has a higher count, 0 if $a and $b have an identical count, 1 if $b has a higher count.
	 */
	private function compare_post_count( $postA, $postB ) {
		return ( $postB['count'] - $postA['count'] );
	}

	/**
	 * Prepares an item for our response.
	 *
	 * @param WP_Post $post The post to prepare.
	 * @return array The link to put in the link suggestions
	 */
	private function get_post_object( $post ) {
		$post = $post['post'];
		$title = trim( $post->post_title );

		if ( empty( $title ) ) {
			$title = __( '(no title)', 'wordpress-seo-premium' );
		}

		return array(
			'id'    => $post->ID,
			'title' => $title,
			'link'  => get_permalink( $post ),
		);
	}
}
