<?php
/**
 * @package WPSEO\Admin\Statistics
 */

/**
 * Class WPSEO_Statistics_Service
 */
class WPSEO_Statistics_Service {

	const CACHE_TRANSIENT_KEY = 'wpseo-dashboard-totals';

	/**
	 * @var WPSEO_Statistics
	 */
	protected $statistics;

	protected $labels;

	/**
	 * WPSEO_Statistics_Service contructor.
	 *
	 * @param WPSEO_Statistics $statistics The statistics class to retrieve statistics from.
	 */
	public function __construct( WPSEO_Statistics $statistics = null ) {
		if ( null === $statistics ) {
			$statistics = new WPSEO_Statistics();
		}

		$this->statistics = $statistics;
	}

	/**
	 * Fetches statistics by REST request.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public function get_statistics() {
		$statistics = $this->statistic_items();

		$header = __( 'Below are your published posts&#8217; SEO scores. Now is as good a time as any to start improving some of your posts!', 'wordpress-seo' );

		$data = array(
			'header'     => $header,
			'seo_scores' => $statistics,
		);

		return new WP_REST_Response( $data );
	}

	/**
	 * An array representing items to be added to the At a Glance dashboard widget
	 *
	 * @return array
	 */
	private function statistic_items() {
		$transient = get_transient( self::CACHE_TRANSIENT_KEY );
		$user_id   = get_current_user_id();

		if ( isset( $transient[ $user_id ] ) ) {
			return $transient[ $user_id ];
		}

		return $this->set_statistic_items_for_this_user( $transient );
	}

	/**
	 * Set the cache for a specific user
	 *
	 * @param array|boolean $transient The current stored transient with the cached data.
	 *
	 * @return mixed
	 */
	private function set_statistic_items_for_this_user( $transient ) {
		if ( $transient === false ) {
			$transient = array();
		}

		$user_id               = get_current_user_id();
		// Use array_values because array_filter may return non-zero indexed arrays.
		$transient[ $user_id ] = array_values( array_filter( $this->get_seo_scores_with_post_count(), array( $this, 'filter_items' ) ) );

		set_transient( self::CACHE_TRANSIENT_KEY, $transient, DAY_IN_SECONDS );

		return $transient[ $user_id ];
	}

	/**
	 * Get all SEO ranks and data associated with them.
	 *
	 * @return array An array of SEO scores and associated data.
	 */
	private function get_seo_scores_with_post_count() {
		$ranks = WPSEO_Rank::get_all_ranks();

		return array_map( array( $this, 'map_rank_to_widget' ), $ranks );
	}

	/**
	 * Converts a rank to data usable in the dashboard widget.
	 *
	 * @param WPSEO_Rank $rank The rank to map.
	 *
	 * @return array The mapped rank.
	 */
	private function map_rank_to_widget( WPSEO_Rank $rank ) {
		return array(
			'seo_rank' => $rank->get_rank(),
			'label'    => $this->get_label_for_rank( $rank ),
			'count'    => $this->statistics->get_post_count( $rank ),
			'link'     => $this->get_link_for_rank( $rank ),
		);
	}

	/**
	 * Returns a dashboard widget label to use for a certain rank.
	 *
	 * @param WPSEO_Rank $rank The rank to return a label for.
	 *
	 * @return string The label for the rank.
	 */
	private function get_label_for_rank( WPSEO_Rank $rank ) {
		$labels = $this->get_labels();

		return $labels[ $rank->get_rank() ];
	}

	/**
	 * Gets the labels for the different SEO Scores.
	 *
	 * @return array
	 */
	private function get_labels() {
		if ( ! isset( $this->labels ) ) {
			$this->labels = array(
				/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag */
				WPSEO_Rank::NO_FOCUS => sprintf( __( 'Posts %1$swithout%2$s a focus keyword', 'wordpress-seo' ), '<strong>', '</strong>' ),
				/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag */
				WPSEO_Rank::BAD      => sprintf( __( 'Posts with a %1$sneeds improvement%2$s SEO score', 'wordpress-seo' ), '<strong>', '</strong>' ),
				/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag */
				WPSEO_Rank::OK       => sprintf( __( 'Posts with an %1$sOK%2$s SEO score', 'wordpress-seo' ), '<strong>', '</strong>' ),
				/* translators: %1$s expands to an opening strong tag, %2$s expands to a closing strong tag */
				WPSEO_Rank::GOOD     => sprintf( __( 'Posts with a %1$sgood%2$s SEO score', 'wordpress-seo' ), '<strong>', '</strong>' ),
				/* translators: %s expands to <span lang="en">noindex</span> */
				WPSEO_Rank::NO_INDEX => sprintf( __( 'Posts that are set to &#8220;%s&#8221;', 'wordpress-seo' ), '<span lang="en">noindex</span>' ),
			);
		}

		return $this->labels;
	}

	/**
	 * Filter items if they have a count of zero.
	 *
	 * @param array $item Data array.
	 *
	 * @return bool Whether or not the count is zero.
	 */
	private function filter_items( $item ) {
		return 0 !== $item['count'];
	}

	/**
	 * Returns a link for the overview of posts of a certain rank.
	 *
	 * @param WPSEO_Rank $rank The rank to return a link for.
	 *
	 * @return string The link that shows an overview of posts with that rank.
	 */
	private function get_link_for_rank( WPSEO_Rank $rank ) {
		if ( current_user_can( 'edit_others_posts' ) === false ) {
			return esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $rank->get_rank() . '&author=' . get_current_user_id() ) );
		}

		return esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=' . $rank->get_rank() ) );
	}

	/**
	 * Gets permissions of the current user to view the onpage result.
	 *
	 * @return bool Whether or not the current user can view the onpage option result.
	 */
	private function can_view_onpage() {
		return is_multisite() ? WPSEO_Utils::grant_access() : current_user_can( 'manage_options' );
	}
}
