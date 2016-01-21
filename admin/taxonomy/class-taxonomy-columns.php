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

		$this->taxonomy = $this->get_taxonomy();

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
	 * Returns the posted/get taxonomy value if it is set.
	 *
	 * @return string|null
	 */
	private function get_taxonomy() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX === true ) {
			return FILTER_INPUT( INPUT_POST, 'taxonomy' );
		}

		return FILTER_INPUT( INPUT_GET, 'taxonomy' );
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

		// When the term isn't indexable.
		if ( ! $this->is_indexable( $term ) ) {
			return $this->create_score_icon(
				new WPSEO_Rank( WPSEO_Rank::NO_INDEX ),
				__( 'Term is set to noindex.', 'wordpress-seo' )
			);
		}

		// When there is a focus key word.
		if ( $focus_keyword = $this->get_focus_keyword( $term ) ) {
			$score = (int) WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'linkdex' );
			$rank  = WPSEO_Rank::from_numeric_score( $score );

			return $this->create_score_icon( $rank, $rank->get_label() );
		}

		// Default icon.
		return $this->create_score_icon(
			new WPSEO_Rank( WPSEO_Rank::NO_FOCUS ),
			__( 'Focus keyword not set.', 'wordpress-seo' )
		);
	}

	/**
	 * Creates an icon by the given values.
	 *
	 * @param WPSEO_Rank $rank  The ranking object.
	 * @param string     $title The title to show.
	 *
	 * @return string
	 */
	private function create_score_icon( WPSEO_Rank $rank, $title ) {
		return '<div title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div>';
	}

	/**
	 * Check if the taxonomy is indexable.
	 *
	 * @param mixed $term The current term.
	 *
	 * @return bool
	 */
	private function is_indexable( $term ) {
		static $options;

		// Saving the options once, because it's static.
		if ( $options === null ) {
			$options = WPSEO_Options::get_all();
		}

		// When the no_index value is not empty and not default, check if its value is index.
		$no_index = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $this->taxonomy, 'noindex' );
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

	/**
	 * Returns the focus keyword if this is set, otherwise it will give the term name.
	 *
	 * @param stdClass|WP_Term $term The current term.
	 *
	 * @return string
	 */
	private function get_focus_keyword( $term ) {
		if ( $focus_keyword = WPSEO_Taxonomy_Meta::get_term_meta( 'focuskw', $term->term_id, $term->taxonomy ) ) {
			return $focus_keyword;
		}

		return $term->name;
	}

}
