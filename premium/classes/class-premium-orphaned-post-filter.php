<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Registers the filter for filtering posts by orphaned content.
 */
class WPSEO_Premium_Orphaned_Post_Filter extends WPSEO_Abstract_Post_Filter {

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return string The query value this filter uses.
	 */
	public function get_query_val() {
		return 'orphaned';
	}

	/**
	 * Registers the hooks when the link feature is enabled.
	 */
	public function register_hooks() {
		if ( WPSEO_Premium_Orphaned_Post_Utils::is_link_feature_enabled() ) {
			parent::register_hooks();
		}
	}

	/**
	 * Returns a text explaining this filter.
	 *
	 * @return string The explanation.
	 */
	protected function get_explanation() {
		$post_type_object = get_post_type_object( $this->get_current_post_type() );

		return sprintf(
			/* translators: %2$s expands anchor to knowledge base article, %3$s expands to </a> */
			__( '\'Orphaned content\' refers to %1$s that have no inbound links, consider adding links towards these %1$s. %2$sLearn more about orphaned content%3$s.', 'wordpress-seo' ),
			strtolower( $post_type_object->labels->name ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1ja' ) . '" target="_blank">',
			'</a>'
		);
	}

	/**
	 * Modifies the query based on the seo_filter variable in $_GET
	 *
	 * @param string $where Query variables.
	 *
	 * @return string The modified query.
	 */
	public function filter_posts( $where ) {
		if ( $this->is_filter_active() ) {
			global $wpdb;

			$post_ids = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();
			$where .= ' AND ' . $wpdb->posts . '.ID IN ( ' . implode( ',', array_map( 'intval', $post_ids ) ) . ' ) ';
		}

		return $where;
	}

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	protected function get_label() {
		static $label;

		if ( $label === null ) {
			$label = __( 'Orphaned content', 'wordpress-seo-premium' );
		}

		return $label;
	}

	/**
	 * Returns the total amount of articles that are orphaned content.
	 *
	 * @return integer
	 */
	protected function get_post_total() {
		global $wpdb;

		$post_ids = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();
		if ( empty( $post_ids ) ) {
			return 0;
		}

		$query = $wpdb->prepare('
				SELECT COUNT(ID)
				  FROM ' . $wpdb->posts . '
				 WHERE ID IN (' . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ')
				   AND post_status = "publish"
				   AND post_type = %s',
			array_merge( $post_ids, array( $this->get_current_post_type() ) )
		);

		return (int) $wpdb->get_var( $query );
	}
}
