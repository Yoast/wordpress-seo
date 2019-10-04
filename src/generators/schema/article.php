<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Article_Helper;
use Yoast\WP\Free\Helpers\Schema_ID_Helper;

/**
 * Returns schema Article data.
 *
 * @since 10.2
 */
class Article extends Abstract_Schema_Piece {

	/**
	 * @var Article_Helper
	 */
	private $article_helper;

	/**
	 * Article constructor.
	 *
	 * @param Article_Helper   $article_helper
	 */
	public function __construct( Article_Helper $article_helper ) {
		$this->article_helper = $article_helper;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		if ( $context->indexable->object_type !== 'post' ) {
			return false;
		}

		if ( $context->site_represents === false ) {
			return false;
		}

		if ( $this->article_helper->is_article_post_type( $context->indexable->object_sub_type ) ) {
			$context->main_schema_id = $context->canonical . $this->id_helper->article_hash;
			return true;
		}

		return false;
	}

	/**
	 * Returns Article data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data Article data.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$comment_count = \get_comment_count( $context->id );
		$data          = array(
			'@type'            => 'Article',
			'@id'              => $context->canonical . $this->id_helper->article_hash,
			'isPartOf'         => array( '@id' => $context->canonical . $this->id_helper->webpage_hash ),
			'author'           => array( '@id' => $this->id_helper->get_user_schema_id( $context->post->post_author, $context ) ),
			'headline'         => $context->title,
			'datePublished'    => mysql2date( DATE_W3C, $context->post->post_date_gmt, false ),
			'dateModified'     => mysql2date( DATE_W3C, $context->post->post_modified_gmt, false ),
			'commentCount'     => $comment_count['approved'],
			'mainEntityOfPage' => array( '@id' => $context->canonical . $this->id_helper->webpage_hash ),
		);

		if ( $context->site_represents_reference ) {
			$data['publisher'] = $context->site_represents_reference;
		}

		$data = $this->add_image( $data, $context );
		$data = $this->add_keywords( $data, $context );
		$data = $this->add_sections( $data, $context );

		return $data;
	}

	/**
	 * Adds tags as keywords, if tags are assigned.
	 *
	 * @param array $data Article data.
	 *
	 * @return array $data Article data.
	 */
	private function add_keywords( $data, Meta_Tags_Context $context ) {
		/**
		 * Filter: 'wpseo_schema_article_keywords_taxonomy' - Allow changing the taxonomy used to assign keywords to a post type Article data.
		 *
		 * @api string $taxonomy The chosen taxonomy.
		 */
		$taxonomy = apply_filters( 'wpseo_schema_article_keywords_taxonomy', 'post_tag' );

		return $this->add_terms( $data, 'keywords', $taxonomy, $context );
	}

	/**
	 * Adds categories as sections, if categories are assigned.
	 *
	 * @param array $data Article data.
	 *
	 * @return array $data Article data.
	 */
	private function add_sections( $data, Meta_Tags_Context $context ) {
		/**
		 * Filter: 'wpseo_schema_article_sections_taxonomy' - Allow changing the taxonomy used to assign keywords to a post type Article data.
		 *
		 * @api string $taxonomy The chosen taxonomy.
		 */
		$taxonomy = apply_filters( 'wpseo_schema_article_sections_taxonomy', 'category' );

		return $this->add_terms( $data, 'articleSection', $taxonomy, $context );
	}

	/**
	 * Adds a term or multiple terms, comma separated, to a field.
	 *
	 * @param array             $data     Article data.
	 * @param string            $key      The key in data to save the terms in.
	 * @param string            $taxonomy The taxonomy to retrieve the terms from.
	 * @param Meta_Tags_Context $context  The meta tags context.
	 *
	 * @return mixed array $data Article data.
	 */
	private function add_terms( $data, $key, $taxonomy, Meta_Tags_Context $context ) {
		$terms = \get_the_terms( $context->id, $taxonomy );
		if ( \is_array( $terms ) ) {
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
	 * @param array             $data    The Article data.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data The Article data.
	 */
	private function add_image( $data, Meta_Tags_Context $context ) {
		if ( $context->has_image ) {
			$data['image'] = array(
				'@id' => $context->canonical . $this->id_helper->primary_image_hash,
			);
		}

		return $data;
	}
}
