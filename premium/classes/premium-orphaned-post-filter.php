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
		if ( ! WPSEO_Link_Table_Accessible::is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return;
		}

		if ( WPSEO_Premium_Orphaned_Content_Utils::is_feature_enabled() ) {
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

		if ( $post_type_object === null ) {
			return null;
		}

		$unprocessed     = WPSEO_Premium_Orphaned_Content_Utils::has_unprocessed_content();
		$can_recalculate = WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );

		$learn_more = sprintf(
			/* translators: %1$s expands to the link to an article to read more about orphaned content, %2$s expands to </a> */
			__( '%1$sLearn more about orphaned content%2$s.', 'wordpress-seo-premium' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1ja' ) . '" target="_blank">',
			'</a>'
		);

		if ( $unprocessed && ! $can_recalculate ) {
			return sprintf(
				/* translators: %1$s: plural form of the current post type, %2$s: a Learn more about link */
				__( 'Ask your SEO Manager or Site Administrator to count links in all texts, so we can identify orphaned %1$s. %2$s', 'wordpress-seo-premium' ),
				strtolower( $post_type_object->labels->name ),
				$learn_more
			);
		}

		if ( $unprocessed ) {
			return sprintf(
				/* translators: %1$s expands to link to the recalculation option, %2$s: anchor closing, %3$s: plural form of the current post type, %4$s: a Learn more about link */
				__( '%1$sClick here%2$s to index your links, so we can identify orphaned %3$s. %4$s', 'wordpress-seo-premium' ),
				'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&reIndexLinks=1' ) ) . '">',
				'</a>',
				strtolower( $post_type_object->labels->name ),
				$learn_more
			);
		}

		return sprintf(
			/* translators: %1$s: plural form of the current post type, %2$s: a Learn more about link */
			__( '\'Orphaned content\' refers to %1$s that have no inbound links, consider adding links towards these %1$s. %2$s', 'wordpress-seo-premium' ),
			strtolower( $post_type_object->labels->name ),
			$learn_more
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
			$where .= $this->get_where_filter();
		}

		return $where;
	}

	/**
	 * Returns the where clause to use.
	 *
	 * @return string The where clause.
	 */
	protected function get_where_filter() {
		global $wpdb;

		if ( WPSEO_Premium_Orphaned_Content_Utils::has_unprocessed_content() ) {
			// Hide all posts, because we cannot tell anything for certain.
			return 'AND 1 = 0';
		}

		$post_ids = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();
		if ( empty( $post_ids ) ) {
			return 'AND 1 = 0';
		}

		return $wpdb->prepare(
			' AND ' . $wpdb->posts . '.ID IN ( ' . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ' ) ',
			$post_ids
		);
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

		if ( WPSEO_Premium_Orphaned_Content_Utils::has_unprocessed_content() ) {
			return '?';
		}

		$post_ids = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();
		if ( empty( $post_ids ) ) {
			return 0;
		}

		$replacements   = $post_ids;
		$replacements[] = $this->get_current_post_type();

		$count = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(ID)
					FROM `{$wpdb->posts}`
					WHERE ID IN ( " . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ' )
					AND post_status = "publish"
					AND post_type = %s',
				$replacements
			)
		);

		return (int) $count;
	}

	/**
	 * Returns the post types to which this filter should be added.
	 *
	 * @return array The post types to which this filter should be added.
	 */
	protected function get_post_types() {
		$orphaned_content_support = new WPSEO_Premium_Orphaned_Content_Support();

		return $orphaned_content_support->get_supported_post_types();
	}
}
