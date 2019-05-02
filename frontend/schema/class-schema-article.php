<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Article data.
 *
 * @since 10.2
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
		if ( ! is_singular() ) {
			return false;
		}

		return self::is_article_post_type( get_post_type() );
	}

	/**
	 * Returns Article data.
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		$post          = get_post( $this->context->id );
		$comment_count = get_comment_count( $this->context->id );
		$data          = array(
			'@type'            => 'Article',
			'@id'              => $this->context->canonical . WPSEO_Schema_IDs::ARTICLE_HASH,
			'isPartOf'         => array( '@id' => $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH ),
			'author'           => array(
				'@id'  => $this->get_author_url( $post ),
				'name' => get_the_author_meta( 'display_name', $post->post_author ),
			),
			'publisher'        => array( '@id' => $this->get_publisher_url() ),
			'headline'         => get_the_title(),
			'datePublished'    => mysql2date( DATE_W3C, $post->post_date_gmt, false ),
			'dateModified'     => mysql2date( DATE_W3C, $post->post_modified_gmt, false ),
			'commentCount'     => $comment_count['approved'],
			'mainEntityOfPage' => $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH,
		);

		$data = $this->add_image( $data );
		$data = $this->add_keywords( $data );
		$data = $this->add_sections( $data );

		return $data;
	}

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @param string $post_type Post type to check.
	 *
	 * @return bool True if it has article schema, false if not.
	 */
	public static function is_article_post_type( $post_type = null ) {
		if ( is_null( $post_type ) ) {
			$post_type = get_post_type();
		}

		/**
		 * Filter: 'wpseo_schema_article_post_types' - Allow changing for which post types we output Article schema.
		 *
		 * @api string[] $post_types The post types for which we output Article.
		 */
		$post_types = apply_filters( 'wpseo_schema_article_post_types', array( 'post' ) );

		return in_array( $post_type, $post_types );
	}

	/**
	 * Determine the proper author URL.
	 *
	 * @param \WP_Post $post Post object.
	 *
	 * @return string
	 */
	private function get_author_url( $post ) {
		if ( $this->context->site_represents === 'person' && $this->context->site_user_id === (int) $post->post_author ) {
			return $this->context->site_url . WPSEO_Schema_IDs::PERSON_HASH;
		}

		return get_author_posts_url( $post->post_author ) . WPSEO_Schema_IDs::AUTHOR_HASH;
	}

	/**
	 * Determine the proper publisher URL.
	 *
	 * @return string
	 */
	private function get_publisher_url() {
		if ( $this->context->site_represents === 'person' ) {
			return $this->context->site_url . WPSEO_Schema_IDs::PERSON_HASH;
		}

		return $this->context->site_url . WPSEO_Schema_IDs::ORGANIZATION_HASH;
	}

	/**
	 * Adds tags as keywords, if tags are assigned.
	 *
	 * @param array $data Article data.
	 *
	 * @return array $data Article data.
	 */
	private function add_keywords( $data ) {
		/**
		 * Filter: 'wpseo_schema_article_keywords_taxonomy' - Allow changing the taxonomy used to assign keywords to a post type Article data.
		 *
		 * @api string $taxonomy The chosen taxonomy.
		 */
		$taxonomy = apply_filters( 'wpseo_schema_article_keywords_taxonomy', 'post_tag' );

		return $this->add_terms( $data, 'keywords', $taxonomy );
	}

	/**
	 * Adds categories as sections, if categories are assigned.
	 *
	 * @param array $data Article data.
	 *
	 * @return array $data Article data.
	 */
	private function add_sections( $data ) {
		/**
		 * Filter: 'wpseo_schema_article_sections_taxonomy' - Allow changing the taxonomy used to assign keywords to a post type Article data.
		 *
		 * @api string $taxonomy The chosen taxonomy.
		 */
		$taxonomy = apply_filters( 'wpseo_schema_article_sections_taxonomy', 'category' );

		return $this->add_terms( $data, 'articleSection', $taxonomy );
	}

	/**
	 * Adds a term or multiple terms, comma separated, to a field.
	 *
	 * @param array  $data     Article data.
	 * @param string $key      The key in data to save the terms in.
	 * @param string $taxonomy The taxonomy to retrieve the terms from.
	 *
	 * @return mixed array $data Article data.
	 */
	private function add_terms( $data, $key, $taxonomy ) {
		$terms = get_the_terms( $this->context->id, $taxonomy );
		if ( is_array( $terms ) ) {
			$keywords = array();
			foreach ( $terms as $term ) {
				// We are checking against the WordPress internal translation.
				// @codingStandardsIgnoreLine
				if ( $term->name !== __( 'Uncategorized' ) ) {
					$keywords[] = $term->name;
				}
			}
			$data[ $key ] = implode( ',', $keywords );
		}

		return $data;
	}

	/**
	 * Adds an image node if the post has a featured image.
	 *
	 * @param array $data The Article data.
	 *
	 * @return array $data The Article data.
	 */
	private function add_image( $data ) {
		if ( has_post_thumbnail( $this->context->id ) ) {
			$data['image'] = array(
				'@id' => $this->context->canonical . WPSEO_Schema_IDs::PRIMARY_IMAGE_HASH,
			);
		}

		return $data;
	}
}
