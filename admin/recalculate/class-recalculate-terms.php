<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all terms.
 */
class WPSEO_Recalculate_Terms extends WPSEO_Recalculate {

	/**
	 * Save the scores.
	 *
	 * @param array $scores The scores to save.
	 */
	public function save_scores( array $scores ) {

		$tax_meta = get_option( 'wpseo_taxonomy_meta' );

		foreach ( $scores as $score ) {
			$tax_meta[ $score['taxonomy'] ][ $score['item_id'] ]['wpseo_linkdex'] = $score['score'];
		}

		update_option( 'wpseo_taxonomy_meta', $tax_meta );
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
	 * Get the terms from the database by doing a WP_Query.
	 *
	 * @param integer $paged The page.
	 *
	 * @return array
	 */
	protected function get_items( $paged ) {
		$items_per_page = max( 1, $this->items_per_page );

		return get_terms(
			get_taxonomies(),
			[
				'hide_empty' => false,
				'number'     => $items_per_page,
				'offset'     => ( $items_per_page * abs( $paged - 1 ) ),
			]
		);
	}

	/**
	 * Convert the given term into a analyzable object.
	 *
	 * @param mixed $item The term for which to build the analyzer data.
	 *
	 * @return array
	 */
	protected function item_to_response( $item ) {
		$focus_keyword = $this->get_focus_keyword( $item );
		$title         = str_replace( ' %%page%% ', ' ', $this->get_title( $item ) );
		$meta          = $this->get_meta_description( $item );

		$description = $item->description;

		/**
		 * Filter the term description for recalculation.
		 *
		 * @param string $description Content of the term. Modify to reflect front-end content.
		 * @oaram WP_Term $item The term the description comes from.
		 */
		$description = apply_filters( 'wpseo_term_description_for_recalculation', $description, $item );

		return [
			'term_id'       => $item->term_id,
			'taxonomy'      => $item->taxonomy,
			'text'          => $description,
			'keyword'       => $focus_keyword,
			'url'           => urldecode( $item->slug ),
			'pageTitle'     => apply_filters( 'wpseo_title', wpseo_replace_vars( $title, $item, [ 'page' ] ) ),
			'meta'          => apply_filters( 'wpseo_metadesc', wpseo_replace_vars( $meta, $item ) ),
			'keyword_usage' => [
				$focus_keyword => WPSEO_Taxonomy_Meta::get_keyword_usage( $focus_keyword, $item->term_id, $item->taxonomy ),
			],
		];
	}

	/**
	 * Gets the focus keyword for the term.
	 *
	 * @param stdClass|WP_Term $term Term to determine the keyword for.
	 *
	 * @return bool|string
	 */
	private function get_focus_keyword( $term ) {
		$focus_keyword = WPSEO_Taxonomy_Meta::get_term_meta( 'focuskw', $term->term_id, $term->taxonomy );
		if ( ! empty( $focus_keyword ) ) {
			return $focus_keyword;
		}

		return $term->name;
	}

	/**
	 * Get the title for given term.
	 *
	 * @param stdClass|WP_Term $term The term object.
	 *
	 * @return mixed|string
	 */
	private function get_title( $term ) {
		$title = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'title' );
		if ( $title !== '' ) {
			return $title;
		}

		$default_from_options = $this->default_from_options( 'title-tax', $term->taxonomy );
		if ( $default_from_options !== false ) {
			return $default_from_options;
		}

		return '%%title%%';
	}

	/**
	 * Get the meta description for given post.
	 *
	 * @param stdClass|WP_Term $term The term object.
	 *
	 * @return bool|string
	 */
	private function get_meta_description( $term ) {
		$meta_description = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'desc' );
		if ( $meta_description !== '' ) {
			return $meta_description;
		}

		$default_from_options = $this->default_from_options( 'metadesc-tax', $term->taxonomy );
		if ( $default_from_options !== false ) {
			return $default_from_options;
		}

		return '';
	}
}
