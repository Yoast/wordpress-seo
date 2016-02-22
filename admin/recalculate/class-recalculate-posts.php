<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all posts with a filled focus keyword
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
		$post_query = new WP_Query(
			array(
				'post_type'      => 'any',
				'meta_key'       => '_yoast_wpseo_focuskw',
				'posts_per_page' => $this->items_per_page,
				'paged'          => $paged,
			)
		);

		return $post_query->get_posts();
	}

	/**
	 * Map the posts to a response array
	 *
	 * @param WP_Post $item The post for which to build the analyzer data.
	 *
	 * @return array
	 */
	protected function item_to_response( $item ) {
		$focus_keyword = WPSEO_Meta::get_value( 'focuskw', $item->ID );

		return array(
			'post_id'       => $item->ID,
			'text'          => $item->post_content,
			'keyword'       => $focus_keyword,
			'url'           => urldecode( $item->post_name ),
			'pageTitle'     => apply_filters( 'wpseo_title', wpseo_replace_vars( $this->get_title( $item->ID, $item->post_type ), $item ) ),
			'meta'          => apply_filters( 'wpseo_metadesc', wpseo_replace_vars( $this->get_meta_description( $item->ID, $item->post_type ), $item ) ),
			'keyword_usage' => array(
				$focus_keyword => WPSEO_Meta::keyword_usage( $focus_keyword, $item->ID ),
			),
		);
	}

	/**
	 * Get the title for given post
	 *
	 * @param integer $post_id The ID of the post for which to get the title.
	 * @param string  $post_type The post type.
	 *
	 * @return mixed|string
	 */
	private function get_title( $post_id, $post_type ) {
		if ( ( $title = WPSEO_Meta::get_value( 'title', $post_id )  ) !== '' ) {
			return $title;
		}

		if ( $default_from_options = $this->default_from_options( 'title-tax', $post_type ) ) {
			return str_replace( ' %%page%% ', ' ', $default_from_options );
		}

		return '%%title%%';
	}

	/**
	 * Get the meta description for given post
	 *
	 * @param integer $post_id The ID of the post for which to get the meta description.
	 * @param string  $post_type The post type.
	 *
	 * @return bool|string
	 */
	private function get_meta_description( $post_id, $post_type ) {
		if ( ( $meta_description = WPSEO_Meta::get_value( 'metadesc', $post_id ) ) !== '' ) {
			return $meta_description;
		}

		if ( $default_from_options = $this->default_from_options( 'metadesc', $post_type ) ) {
			return $default_from_options;
		}

		return '';
	}

}
