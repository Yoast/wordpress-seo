<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class adds columns to the taxonomy table.
 */
class WPSEO_Taxonomy_Columns {

	/**
	 * WPSEO_Taxonomy_Columns constructor.
	 */
	public function __construct() {

		$this->taxonomy = FILTER_INPUT( INPUT_GET, 'taxonomy' );

		if ( ! empty( $this->taxonomy ) ) {
			add_filter( 'manage_edit-' . $this->taxonomy . '_columns', array( $this, 'add_columns' ) );
			add_filter( 'manage_' . $this->taxonomy . '_custom_column', array( $this, 'parse_column' ), 10, 3 );
		}
	}

	/**
	 * Adds an SEO score column to the terms table, right after the description column.
	 *
	 * @param array $columns Current set columns.
	 *
	 * @return array
	 */
	public function add_columns( array $columns ) {

		$new_columns = array();

		foreach ( $columns as $column_name => $column_value ) {
			$new_columns[ $column_name ] = $column_value;

			if ( $column_name === 'description' ) {
				$new_columns['wpseo_score'] = __( 'SEO', 'wordpress-seo' );
			}
		}

		return $new_columns;
	}

	/**
	 * Parses the column.
	 *
	 * @param string  $content		The current content of the column.
	 * @param string  $column_name  The name of the column.
	 * @param integer $term_id      ID of requested taxonomy.
	 *
	 * @return string
	 */
	public function parse_column( $content, $column_name, $term_id ) {

		switch ( $column_name ) {
			case 'wpseo_score':
				return $this->get_score_value( $term_id );

				break;
		}

		return $content;
	}

	/**
	 * Parses the value for the score column.
	 *
	 * @param integer $term_id ID of requested taxonomy.
	 *
	 * @return string
	 */
	private function get_score_value( $term_id ) {
		$term = get_term( $term_id, $this->taxonomy );

		$no_index = WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'noindex' );

		if ( ! $this->is_indexable( $term, $no_index ) ) {
			$rank  = new WPSEO_Rank( WPSEO_Rank::NO_INDEX );
			$title = __( 'Term is set to noindex.', 'wordpress-seo' );
		}
		elseif ( WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'focuskw' ) === '' ) {
			$rank  = new WPSEO_Rank( WPSEO_Rank::NO_FOCUS );
			$title = __( 'Focus keyword not set.', 'wordpress-seo' );
		}
		else {
			$score = (int) WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'linkdex' );
			$rank  = WPSEO_Rank::from_numeric_score( $score );
			$title = $rank->get_label();
		}

		return '<div title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div>';
	}

	/**
	 * Check if the taxonomy is indexable.
	 *
	 * @param mixed       $term     The current term.
	 * @param bool|string $no_index The no index meta value.
	 *
	 * @return bool
	 */
	private function is_indexable( $term, $no_index ) {
		static $options;

		// Saving the options once, because it's static.
		if ( $options === null ) {
			$options = WPSEO_Options::get_all();
		}

		// When the no_index value is not empty and not default, check if its value is index.
		if ( ! empty( $no_index ) && $no_index !== 'default' ) {
			return ( $no_index === 'index' );
		}

		// Check if the default for taxonomy is empty (this will be index).
		$no_index_key = 'noindex-tax-' . $term->taxonomy;
		if ( is_object( $term ) && ( isset( $options[ $no_index_key ] ) ) ) {
			return ( empty( $options[ $no_index_key ] ) );
		}

		return true;
	}

}
