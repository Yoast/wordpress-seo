<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Article_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;

/**
 * Returns schema Article data.
 */
class Article extends Abstract_Schema_Piece {

	/**
	 * @var Article_Helper
	 */
	private $article_helper;

	/**
	 * @var Date_Helper
	 */
	private $date_helper;

	/**
	 * @var HTML_Helper
	 */
	private $html_helper;

	/**
	 * Article constructor.
	 *
	 * @param Article_Helper $article_helper The article helper.
	 * @param Date_Helper    $date_helper    The date helper.
	 * @param HTML_Helper    $html_helper    The HTML helper.
	 */
	public function __construct( Article_Helper $article_helper, Date_Helper $date_helper, HTML_Helper $html_helper ) {
		$this->article_helper = $article_helper;
		$this->date_helper    = $date_helper;
		$this->html_helper    = $html_helper;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
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
		$data          = [
			'@type'            => 'Article',
			'@id'              => $context->canonical . $this->id_helper->article_hash,
			'isPartOf'         => [ '@id' => $context->canonical . $this->id_helper->webpage_hash ],
			'author'           => [ '@id' => $this->id_helper->get_user_schema_id( $context->post->post_author, $context ) ],
			'headline'         => $this->html_helper->smart_strip_tags( $context->title ),
			'datePublished'    => $this->date_helper->format( $context->post->post_date_gmt ),
			'dateModified'     => $this->date_helper->format( $context->post->post_modified_gmt ),
			'commentCount'     => $comment_count['approved'],
			'mainEntityOfPage' => [ '@id' => $context->canonical . $this->id_helper->webpage_hash ],
		];

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
	 * @param array             $data    Article data.
	 * @param Meta_Tags_Context $context The meta tags context.
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
	 * @param array             $data    Article data.
	 * @param Meta_Tags_Context $context The meta tags context.
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

		if ( ! \is_array( $terms ) ) {
			return $data;
		}

		$terms = array_filter( $terms, function( $term ) {
			// We are checking against the WordPress internal translation.
			// @codingStandardsIgnoreLine
			return $term->name !== __( 'Uncategorized' );
		} );

		if ( empty( $terms ) ) {
			return $data;
		}

		$data[ $key ] = implode( ',', wp_list_pluck( $terms, 'name' ) );

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
			$data['image'] = [
				'@id' => $context->canonical . $this->id_helper->primary_image_hash,
			];
		}

		return $data;
	}
}
