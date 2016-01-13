<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class handles the calculation of the SEO score for all terms
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
		return get_terms(
			get_taxonomies(),
			array(
				'hide_empty' => false,
				'number'     => $this->items_per_page,
				'offset'     => $this->items_per_page * abs( $paged - 1 ),
			)
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

		return array(
			'term_id'       => $item->term_id,
			'taxonomy'      => $item->taxonomy,
			'text'          => $item->description,
			'keyword'       => $focus_keyword,
			'url'           => urldecode( $item->slug ),
			'pageTitle'     => apply_filters( 'wpseo_title', wpseo_replace_vars( $title, $item, array( 'page' ) ) ),
			'meta'          => apply_filters( 'wpseo_metadesc', wpseo_replace_vars( $meta, $item ) ),
			'keyword_usage' => array(
				$focus_keyword => WPSEO_Taxonomy_Meta::get_keyword_usage( $focus_keyword, $item->term_id, $item->taxonomy ),
			),
		);
	}

	/**
	 * Gets the focus keyword for the term
	 *
	 * @param stdClass|WP_Term $term Term to determine the keyword for.
	 *
	 * @return bool|string
	 */
	private function get_focus_keyword( $term ) {
		if ( $focus_keyword = WPSEO_Taxonomy_Meta::get_term_meta( 'focuskw', $term->term_id, $term->taxonomy ) ) {
			return $focus_keyword;
		}

		return $term->name;
	}

	/**
	 * Get the title for given term
	 *
	 * @param stdClass|WP_Term $term The term object.
	 *
	 * @return mixed|string
	 */
	private function get_title( $term ) {
		if ( ( $title = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'title' )  ) !== '' ) {
			return $title;
		}

		if ( $default_from_options = $this->default_from_options( 'title-tax', $term->taxonomy ) ) {
			return $default_from_options;
		}

		return '%%title%%';
	}

	/**
	 * Get the meta description for given post
	 *
	 * @param stdClass|WP_Term $term The term object.
	 *
	 * @return bool|string
	 */
	private function get_meta_description( $term ) {
		if ( ( $meta_description = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $term->taxonomy, 'desc' ) ) !== '' ) {
			return $meta_description;
		}

		if ( $default_from_options = $this->default_from_options( 'metadesc-tax', $term->taxonomy ) ) {
			return $default_from_options;
		}

		return '';
	}

}
