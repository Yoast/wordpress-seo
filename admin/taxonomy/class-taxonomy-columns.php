<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class adds columns to the taxonomy table.
 */
class WPSEO_Taxonomy_Columns {

	/**
	 * The SEO analysis.
	 *
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	private $analysis_seo;

	/**
	 * The readability analysis.
	 *
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	private $analysis_readability;

	/**
	 * The current taxonomy.
	 *
	 * @var string
	 */
	private $taxonomy;

	/**
	 * WPSEO_Taxonomy_Columns constructor.
	 */
	public function __construct() {

		$this->taxonomy = $this->get_taxonomy();

		if ( ! empty( $this->taxonomy ) ) {
			add_filter( 'manage_edit-' . $this->taxonomy . '_columns', array( $this, 'add_columns' ) );
			add_filter( 'manage_' . $this->taxonomy . '_custom_column', array( $this, 'parse_column' ), 10, 3 );
		}

		$this->analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
		$this->analysis_readability = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Adds an SEO score column to the terms table, right after the description column.
	 *
	 * @param array $columns Current set columns.
	 *
	 * @return array
	 */
	public function add_columns( array $columns ) {
		if ( $this->display_metabox( $this->taxonomy ) === false ) {
			return $columns;
		}

		$new_columns = array();

		foreach ( $columns as $column_name => $column_value ) {
			$new_columns[ $column_name ] = $column_value;

			if ( $column_name === 'description' && $this->analysis_seo->is_enabled() ) {
				$new_columns['wpseo-score'] = '<span class="yoast-tooltip yoast-tooltip-n yoast-tooltip-alt" data-label="' . esc_attr__( 'SEO score', 'wordpress-seo' ) . '"><span class="yoast-column-seo-score yoast-column-header-has-tooltip"><span class="screen-reader-text">' . __( 'SEO score', 'wordpress-seo' ) . '</span></span></span>';
			}

			if ( $column_name === 'description' && $this->analysis_readability->is_enabled() ) {
				$new_columns['wpseo-score-readability'] = '<span class="yoast-tooltip yoast-tooltip-n yoast-tooltip-alt" data-label="' . esc_attr__( 'Readability score', 'wordpress-seo' ) . '"><span class="yoast-column-readability yoast-column-header-has-tooltip"><span class="screen-reader-text">' . __( 'Readability score', 'wordpress-seo' ) . '</span></span></span>';
			}
		}

		return $new_columns;
	}

	/**
	 * Parses the column.
	 *
	 * @param string  $content     The current content of the column.
	 * @param string  $column_name The name of the column.
	 * @param integer $term_id     ID of requested taxonomy.
	 *
	 * @return string
	 */
	public function parse_column( $content, $column_name, $term_id ) {

		switch ( $column_name ) {
			case 'wpseo-score':
				return $this->get_score_value( $term_id );

			case 'wpseo-score-readability':
				return $this->get_score_readability_value( $term_id );
		}

		return $content;
	}

	/**
	 * Retrieves the taxonomy from the $_GET variable.
	 *
	 * @return string The current taxonomy.
	 */
	public function get_current_taxonomy() {
		return filter_input( $this->get_taxonomy_input_type(), 'taxonomy' );
	}

	/**
	 * Returns the posted/get taxonomy value if it is set.
	 *
	 * @return string|null
	 */
	private function get_taxonomy() {
		if ( wp_doing_ajax() ) {
			return FILTER_INPUT( INPUT_POST, 'taxonomy' );
		}

		return FILTER_INPUT( INPUT_GET, 'taxonomy' );
	}

	/**
	 * Parses the value for the score column.
	 *
	 * @param integer $term_id ID of requested term.
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
		$focus_keyword = $this->get_focus_keyword( $term );
		$score         = (int) WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'linkdex' );
		$rank          = WPSEO_Rank::from_numeric_score( $score );

		return $this->create_score_icon( $rank, $rank->get_label() );
	}

	/**
	 * Parses the value for the readability score column.
	 *
	 * @param int $term_id ID of the requested term.
	 *
	 * @return string The HTML for the readability score indicator.
	 */
	private function get_score_readability_value( $term_id ) {
		$score = (int) WPSEO_Taxonomy_Meta::get_term_meta( $term_id, $this->taxonomy, 'content_score' );
		$rank  = WPSEO_Rank::from_numeric_score( $score );

		return $this->create_score_icon( $rank );
	}

	/**
	 * Creates an icon by the given values.
	 *
	 * @param WPSEO_Rank $rank  The ranking object.
	 * @param string     $title Optional. The title to show. Defaults to the rank label.
	 *
	 * @return string The HTML for a score icon.
	 */
	private function create_score_icon( WPSEO_Rank $rank, $title = '' ) {
		if ( empty( $title ) ) {
			$title = $rank->get_label();
		}

		return '<div aria-hidden="true" title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div><span class="screen-reader-text wpseo-score-text">' . $title . '</span>';
	}

	/**
	 * Check if the taxonomy is indexable.
	 *
	 * @param mixed $term The current term.
	 *
	 * @return bool Whether or not the term is indexable.
	 */
	private function is_indexable( $term ) {
		// When the no_index value is not empty and not default, check if its value is index.
		$no_index = WPSEO_Taxonomy_Meta::get_term_meta( $term->term_id, $this->taxonomy, 'noindex' );

		// Check if the default for taxonomy is empty (this will be index).
		if ( ! empty( $no_index ) && $no_index !== 'default' ) {
			return ( $no_index === 'index' );
		}

		if ( is_object( $term ) ) {
			$no_index_key = 'noindex-tax-' . $term->taxonomy;

			// If the option is false, this means we want to index it.
			return WPSEO_Options::get( $no_index_key, false ) === false;
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
		$focus_keyword = WPSEO_Taxonomy_Meta::get_term_meta( 'focuskw', $term->term_id, $term->taxonomy );
		if ( $focus_keyword !== false ) {
			return $focus_keyword;
		}

		return $term->name;
	}

	/**
	 * Checks if a taxonomy is being added via a POST method. If not, it defaults to a GET request.
	 *
	 * @return int
	 */
	private function get_taxonomy_input_type() {
		if ( ! empty( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'POST' ) {
			return INPUT_POST;
		}

		return INPUT_GET;
	}

	/**
	 * Wraps the WPSEO_Metabox check to determine whether the metabox should be displayed either by
	 * choice of the admin or because the taxonomy is not public.
	 *
	 * @since 7.0
	 *
	 * @param string $taxonomy Optional. The taxonomy to test, defaults to the current taxonomy.
	 *
	 * @return bool Whether or not the meta box (and associated columns etc) should be hidden.
	 */
	private function display_metabox( $taxonomy = null ) {
		$current_taxonomy = sanitize_text_field( $this->get_current_taxonomy() );

		if ( ! isset( $taxonomy ) && ! empty( $current_taxonomy ) ) {
			$taxonomy = $current_taxonomy;
		}

		return WPSEO_Utils::is_metabox_active( $taxonomy, 'taxonomy' );
	}
}
