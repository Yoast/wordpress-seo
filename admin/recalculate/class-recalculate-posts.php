<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all posts with a filled focus keyword.
 */
class WPSEO_Recalculate_Posts extends WPSEO_Recalculate {

	/**
	 * Save the scores.
	 *
	 * @param array $scores The scores for the posts.
	 */
	public function save_scores( array $scores ) {
		foreach ( $scores as $score ) {
			$this->save_score( $score );
		}
	}

	/**
	 * Save the score.
	 *
	 * @param array $score The score to save.
	 */
	protected function save_score( array $score ) {
		WPSEO_Meta::set_value( 'linkdex', $score['score'], $score['item_id'] );
	}

	/**
	 * Get the posts from the database by doing a WP_Query.
	 *
	 * @param integer $paged The page.
	 *
	 * @return string
	 */
	protected function get_items( $paged ) {
		$items_per_page = max( 1, $this->items_per_page );
		$post_query     = new WP_Query(
			[
				'post_type'      => 'any',
				'meta_key'       => '_yoast_wpseo_focuskw',
				'posts_per_page' => $items_per_page,
				'paged'          => $paged,
			]
		);

		return $post_query->get_posts();
	}

	/**
	 * Map the posts to a response array.
	 *
	 * @param WP_Post $item The post for which to build the analyzer data.
	 *
	 * @return array
	 */
	protected function item_to_response( $item ) {
		$focus_keyword = WPSEO_Meta::get_value( 'focuskw', $item->ID );

		$content = $item->post_content;

		// Check if there's a featured image.
		$content .= $this->add_featured_image( $item );

		/**
		 * Filter the post content for use in the SEO score recalculation.
		 *
		 * @param string $content Content of the post. Modify to reflect front-end content.
		 * @param WP_Post $item The Post object the content comes from.
		 */
		$content = apply_filters( 'wpseo_post_content_for_recalculation', $content, $item );

		// Apply shortcodes.
		$content = do_shortcode( $content );

		return [
			'post_id'       => $item->ID,
			'text'          => $content,
			'keyword'       => $focus_keyword,
			'url'           => urldecode( $item->post_name ),
			'pageTitle'     => apply_filters( 'wpseo_title', wpseo_replace_vars( $this->get_title( $item->ID, $item->post_type ), $item ) ),
			'meta'          => apply_filters( 'wpseo_metadesc', wpseo_replace_vars( $this->get_meta_description( $item->ID, $item->post_type ), $item ) ),
			'keyword_usage' => [
				$focus_keyword => WPSEO_Meta::keyword_usage( $focus_keyword, $item->ID ),
			],
		];
	}

	/**
	 * Get the title for given post.
	 *
	 * @param integer $post_id   The ID of the post for which to get the title.
	 * @param string  $post_type The post type.
	 *
	 * @return mixed|string
	 */
	private function get_title( $post_id, $post_type ) {
		$title = WPSEO_Meta::get_value( 'title', $post_id );
		if ( $title !== '' ) {
			return $title;
		}

		$default_from_options = $this->default_from_options( 'title-tax', $post_type );
		if ( $default_from_options !== false ) {
			return str_replace( ' %%page%% ', ' ', $default_from_options );
		}

		return '%%title%%';
	}

	/**
	 * Get the meta description for given post.
	 *
	 * @param integer $post_id   The ID of the post for which to get the meta description.
	 * @param string  $post_type The post type.
	 *
	 * @return bool|string
	 */
	private function get_meta_description( $post_id, $post_type ) {
		$meta_description = WPSEO_Meta::get_value( 'metadesc', $post_id );
		if ( $meta_description !== '' ) {
			return $meta_description;
		}

		$default_from_options = $this->default_from_options( 'metadesc', $post_type );
		if ( $default_from_options !== false ) {
			return $default_from_options;
		}

		return '';
	}

	/**
	 * Retrieves the associated featured image if there is one present.
	 *
	 * @param WP_Post $item The post item to check for a featured image.
	 *
	 * @return string The image string.
	 */
	private function add_featured_image( $item ) {
		if ( ! has_post_thumbnail( $item->ID ) ) {
			return '';
		}

		return ' ' . get_the_post_thumbnail( $item->ID );
	}
}
