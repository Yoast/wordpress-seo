<?php
/**
 * @package WPSEO\Admin|Ajax
 */

/**
 * Class WPSEO_Recalculate_Scores
 *
 * This class handles the SEO score recalculation for all posts with a filled focus keyword
 */
class WPSEO_Recalculate_Scores_Ajax {

	/**
	 * @var int
	 */
	private $posts_per_page = 20;

	/**
	 * @var array The fields which should be always queries, can be extended by array_merge
	 */
	private $query_fields   = array(
		'post_type'      => 'any',
		'meta_key'       => '_yoast_wpseo_focuskw',
	);

	/**
	 * @var array The options stored in the database
	 */
	private $options;

	/**
	 * Initialize the AJAX hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_recalculate_scores', array( $this, 'recalculate_scores' ) );
		add_action( 'wp_ajax_wpseo_update_score', array( $this, 'save_score' ) );
	}

	/**
	 * Start recalculation
	 */
	public function recalculate_scores() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );
		wp_die(
			$this->get_posts( filter_input( INPUT_POST, 'paged', FILTER_VALIDATE_INT ) )
		);
	}

	/**
	 * Saving the new linkdex score for given post
	 */
	public function save_score() {
		check_ajax_referer( 'wpseo_recalculate', 'nonce' );

		$scores = filter_input( INPUT_POST, 'scores', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		foreach ( $scores as $score ) {
			WPSEO_Meta::set_value( 'linkdex', $score['score'], $score['post_id'] );
		}
		wp_die();
	}

	/**
	 * Getting the posts from the database by doing a WP_Query.
	 *
	 * @param integer $paged The page.
	 *
	 * @return string
	 */
	private function get_posts( $paged ) {
		$post_query = new WP_Query(
			array_merge(
				$this->query_fields,
				array(
					'posts_per_page' => $this->posts_per_page,
					'paged'          => $paged,
					'posts'          => array(),
				)
			)
		);

		if ( $posts = $post_query->get_posts() ) {
			$this->options = WPSEO_Options::get_option( 'wpseo_titles' );

			$parsed_posts = $this->parse_posts( $posts );

			$response  = array(
				'posts'       => $parsed_posts,
				'total_posts' => count( $parsed_posts ),
				'next_page'   => ( $paged + 1 ),
			);

			return json_encode( $response );
		}

		return '';
	}

	/**
	 * Parsing the posts with the value we need
	 *
	 * @param array $posts The posts to parse.
	 *
	 * @return array
	 */
	private function parse_posts( array $posts ) {
		$parsed_posts = array();
		foreach ( $posts as $post ) {
			$parsed_posts[] = $this->post_to_response( $post );
		}

		return $parsed_posts;
	}

	/**
	 * @param WP_Post $post The post for which to build the analyzer data.
	 *
	 * @return array
	 */
	private function post_to_response( WP_Post $post ) {
		$focus_keyword = WPSEO_Meta::get_value( 'focuskw', $post->ID );

		return array(
			'post_id'       => $post->ID,
			'text'          => $post->post_content,
			'keyword'       => $focus_keyword,
			'url'           => urldecode( $post->post_name ),
			'pageTitle'     => apply_filters( 'wpseo_title', wpseo_replace_vars( $this->get_title( $post->ID, $post->post_type ), $post ) ),
			'meta'          => apply_filters( 'wpseo_metadesc', wpseo_replace_vars( $this->get_meta_description( $post->ID, $post->post_type ), $post ) ),
			'keyword_usage' => array(
				$focus_keyword => WPSEO_Meta::keyword_usage( $focus_keyword, $post->ID ),
			),
		);
	}

	/**
	 * Getting the title for given post
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

		if ( $default_from_options = $this->default_from_options( 'title', $post_type ) ) {
			return str_replace( ' %%page%% ', ' ', $default_from_options );
		}

		return '%%title%%';
	}

	/**
	 * Getting the meta description for given post
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

	/**
	 * Getting default from the options for given field
	 *
	 * @param string $field The field for which to get the default options.
	 * @param string $post_type The post type.
	 *
	 * @return bool|string
	 */
	private function default_from_options( $field, $post_type ) {
		$target_option_field = $field . '-' . $post_type;
		if ( ! empty( $this->options[ $target_option_field ] ) ) {
			return $this->options[ $target_option_field ];
		}

		return false;
	}

}
