<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema_Article
 *
 * Returns schema Article data.
 *
 * @since 10.1
 */
class WPSEO_Schema_Article implements WPSEO_Graph_Piece {
	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		/**
		 * Filter: 'wpseo_schema_article_post_types' - Allow changing for which post types we output Article schema.
		 *
		 * @api string[] $post_types The post types for which we output Article.
		 */
		$post_types = apply_filters( 'wpseo_schema_article_post_types', array( 'post' ) );

		return is_singular( $post_types );
	}

	/**
	 * Returns Article data.
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		$post          = get_post( $this->context->post_id );
		$comment_count = get_comment_count( $this->context->post_id );
		$data          = array(
			'@type'            => 'Article',
			'@id'              => $this->context->canonical . '#article',
			'isPartOf'         => array( '@id' => $this->context->canonical . '#webpage' ),
			'author'           => array(
				'@id'  => $this->get_author_url(),
				'name' => get_the_author_meta( 'display_name', $post->post_author ),
			),
			'publisher'        => array( '@id' => $this->get_publisher_url() ),
			'headline'         => get_the_title(),
			'datePublished'    => mysql2date( DATE_W3C, $post->post_date_gmt, false ),
			'dateModified'     => mysql2date( DATE_W3C, $post->post_modified_gmt, false ),
			'commentCount'     => $comment_count['approved'],
			'mainEntityOfPage' => $this->context->canonical . '#webpage',
		);

		$data = $this->add_image( $data );
		$data = $this->add_keywords( $data );

		return $data;
	}

	/**
	 * Determine the proper author URL.
	 *
	 * @return string
	 */
	private function get_author_url() {
		if ( $this->context->site_represents === 'person' ) {
			return $this->context->site_url . '#person';
		}

		return get_author_posts_url( get_the_author_meta( 'ID' ) ) . '#person';
	}

	/**
	 * Determine the proper publisher URL.
	 *
	 * @return string
	 */
	private function get_publisher_url() {
		if ( $this->context->site_represents !== 'company' ) {
			return get_author_posts_url( get_the_author_meta( 'ID' ) ) . '#person';
		}

		return $this->context->site_url . '#organization';
	}

	/**
	 * Adds tags as keywords, if tags are assigned.
	 *
	 * @param array                $data    Article data.
	 *
	 * @return array $data Article data.
	 */
	private function add_keywords( $data ) {
		/**
		 * Filter: 'wpseo_schema_article_taxonomy' - Allow changing the taxonomy used to assign keywords to a post type Article data.
		 *
		 * @api string $taxonomy The chosen taxonomy.
		 */
		$taxonomy = apply_filters( 'wpseo_schema_article_keywords_taxonomy', 'post_tag' );

		$terms = get_the_terms( $this->context->post_id, $taxonomy );
		if ( $terms ) {
			$tags = array();
			foreach ( $terms as $term ) {
				$tags[] = $term->name;
			}
			$data['keywords'] = $tags;
		}

		return $data;
	}

	/**
	 * Adds an image node if the post has a featured image.
	 *
	 * @param array                $data    The Article data.
	 *
	 * @return array $data The Article data.
	 */
	private function add_image( $data ) {
		if ( has_post_thumbnail( $this->context->post_id ) ) {
			$data['image'] = array(
				'@id' => $this->context->canonical . '#primaryimage',
			);
		}

		return $data;
	}
}
