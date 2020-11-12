<?php

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns schema Article data.
 */
class Article extends Abstract_Schema_Piece {

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->context->indexable->object_type !== 'post' ) {
			return false;
		}

		// If we cannot output a publisher, we shouldn't output an Article.
		if ( $this->context->site_represents === false ) {
			return false;
		}

		// If we cannot output an author, we shouldn't output an Article.
		if ( ! $this->helpers->schema->article->is_author_supported( $this->context->indexable->object_sub_type ) ) {
			return false;
		}

		if ( $this->context->schema_article_type !== 'None' ) {
			$this->context->main_schema_id = $this->context->canonical . Schema_IDs::ARTICLE_HASH;

			return true;
		}

		return false;
	}

	/**
	 * Returns Article data.
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		$data = [
			'@type'            => $this->context->schema_article_type,
			'@id'              => $this->context->canonical . Schema_IDs::ARTICLE_HASH,
			'isPartOf'         => [ '@id' => $this->context->canonical . Schema_IDs::WEBPAGE_HASH ],
			'author'           => [ '@id' => $this->helpers->schema->id->get_user_schema_id( $this->context->post->post_author, $this->context ) ],
			'headline'         => $this->helpers->schema->html->smart_strip_tags( $this->helpers->post->get_post_title_with_fallback( $this->context->id ) ),
			'datePublished'    => $this->helpers->date->format( $this->context->post->post_date_gmt ),
			'dateModified'     => $this->helpers->date->format( $this->context->post->post_modified_gmt ),
			'mainEntityOfPage' => [ '@id' => $this->context->canonical . Schema_IDs::WEBPAGE_HASH ],
		];

		// If the comments are open -or- there are comments approved, show the count.
		$comments_open = \comments_open( $this->context->id );
		$comment_count = \get_comment_count( $this->context->id );
		if ( $comments_open || $comment_count['approved'] > 0 ) {
			$data['commentCount'] = $comment_count['approved'];
		}

		if ( $this->context->site_represents_reference ) {
			$data['publisher'] = $this->context->site_represents_reference;
		}

		$data = $this->add_image( $data );
		$data = $this->add_keywords( $data );
		$data = $this->add_sections( $data );
		$data = $this->helpers->schema->language->add_piece_language( $data );

		if ( \post_type_supports( $this->context->post->post_type, 'comments' ) && $this->context->post->comment_status === 'open' ) {
			$data = $this->add_potential_action( $data );
		}

		return $data;
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
		$taxonomy = \apply_filters( 'wpseo_schema_article_keywords_taxonomy', 'post_tag' );

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
		$taxonomy = \apply_filters( 'wpseo_schema_article_sections_taxonomy', 'category' );

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
	protected function add_terms( $data, $key, $taxonomy ) {
		$terms = \get_the_terms( $this->context->id, $taxonomy );

		if ( ! \is_array( $terms ) ) {
			return $data;
		}

		$callback = function( $term ) {
			// We are using the WordPress internal translation.
			return $term->name !== \__( 'Uncategorized', 'default' );
		};
		$terms    = \array_filter( $terms, $callback );

		if ( empty( $terms ) ) {
			return $data;
		}

		$data[ $key ] = \implode( ',', \wp_list_pluck( $terms, 'name' ) );

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
		if ( $this->context->has_image ) {
			$data['image'] = [
				'@id' => $this->context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH,
			];
		}

		return $data;
	}

	/**
	 * Adds the potential action property to the Article Schema piece.
	 *
	 * @param array $data The Article data.
	 *
	 * @return array $data The Article data with the potential action added.
	 */
	private function add_potential_action( $data ) {
		/**
		 * Filter: 'wpseo_schema_article_potential_action_target' - Allows filtering of the schema Article potentialAction target.
		 *
		 * @api array $targets The URLs for the Article potentialAction target.
		 */
		$targets = \apply_filters( 'wpseo_schema_article_potential_action_target', [ $this->context->canonical . '#respond' ] );

		$data['potentialAction'][] = [
			'@type'  => 'CommentAction',
			'name'   => 'Comment',
			'target' => $targets,
		];

		return $data;
	}
}
