<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to change or add WordPress dashboard widgets
 */
class Yoast_Dashboard_Widget {

	const CACHE_TRANSIENT_KEY = 'wpseo-dashboard-totals';

	/**
	 * @var WPSEO_Statistics
	 */
	protected $statistics;

	/**
	 * @param WPSEO_Statistics $statistics The statistics class to retrieve statistics from.
	 */
	public function __construct( WPSEO_Statistics $statistics = null ) {
		if ( null === $statistics ) {
			$statistics = new WPSEO_Statistics();
		}

		$this->statistics = $statistics;

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dashboard_stylesheet' ) );
		add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
		add_action( 'wp_insert_post', array( $this, 'clear_cache' ) );
		add_action( 'delete_post', array( $this, 'clear_cache' ) );
	}

	/**
	 * Adds dashboard widget to WordPress
	 */
	public function add_dashboard_widget() {
		wp_add_dashboard_widget(
			'wpseo-dashboard-overview',
			/* translators: %s is the plugin name */
			sprintf( __( '%s Posts Overview', 'wordpress-seo' ), 'Yoast SEO' ),
			array( $this, 'display_dashboard_widget' )
		);
	}

	/**
	 * Display the dashboard widget
	 */
	public function display_dashboard_widget() {
		$statistics = $this->statistic_items();

		include WPSEO_PATH . '/admin/views/dashboard-widget.php';
	}

	/**
	 * Enqueue's stylesheet for the dashboard if the current page is the dashboard
	 */
	public function enqueue_dashboard_stylesheet() {
		if ( 'dashboard' === get_current_screen()->id ) {

			$asset_manager = new WPSEO_Admin_Asset_Manager();
			$asset_manager -> enqueue_style( 'wp-dashboard' );
		}
	}

	/**
	 * Clears the dashboard widget items cache
	 */
	public function clear_cache() {
		delete_transient( self::CACHE_TRANSIENT_KEY );
	}

	/**
	 * An array representing items to be added to the At a Glance dashboard widget
	 *
	 * @return array
	 */
	private function statistic_items() {
		$transient = get_transient( self::CACHE_TRANSIENT_KEY );
		$user_id   = get_current_user_id();

		if ( isset( $transient[ $user_id ][1] ) ) {
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

		$user_id                  = get_current_user_id();
		$filtered_items[ $user_id ] = array_filter( $this->get_seo_scores_with_post_count(), array( $this, 'filter_items' ) );

		set_transient( self::CACHE_TRANSIENT_KEY, array_merge( $filtered_items, $transient ), DAY_IN_SECONDS );

		return $filtered_items[ $user_id ];
	}

	/**
	 * Set the SEO scores belonging to their SEO score result
	 *
	 * @return array
	 */
	private function get_seo_scores_with_post_count() {
		return array(
			array(
				'seo_rank' => 'good',
				'title'    => __( 'Posts with good SEO score', 'wordpress-seo' ),
				'class'    => 'wpseo-glance-good',
				'count'    => $this->statistics->get_good_seo_post_count(),
			),
			array(
				'seo_rank' => 'ok',
				'title'    => __( 'Posts with OK SEO score', 'wordpress-seo' ),
				'class'    => 'wpseo-glance-ok',
				'count'    => $this->statistics->get_ok_seo_post_count(),
			),
			array(
				'seo_rank' => 'poor',
				'title'    => __( 'Posts with poor SEO score', 'wordpress-seo' ),
				'class'    => 'wpseo-glance-poor',
				'count'    => $this->statistics->get_poor_seo_post_count(),
			),
			array(
				'seo_rank' => 'bad',
				'title'    => __( 'Posts with bad SEO score', 'wordpress-seo' ),
				'class'    => 'wpseo-glance-bad',
				'count'    => $this->statistics->get_bad_seo_post_count(),
			),
			array(
				'seo_rank' => 'na',
				'title'    => __( 'Posts without focus keyword', 'wordpress-seo' ),
				'class'    => 'wpseo-glance-na',
				'count'    => $this->statistics->get_no_focus_post_count(),
			),
			array(
				'seo_rank' => 'noindex',
				/* translators: %s expands to <code>noindex</code> */
				'title'    => sprintf( __( 'Posts that are set to %s', 'wordpress-seo' ), '<code>noindex</code>' ),
				'class'    => 'wpseo-glance-noindex',
				'count'    => $this->statistics->get_no_index_post_count(),
			),
		);
	}

	/**
	 * Filter items if they have a count of zero
	 *
	 * @param array $item Data array.
	 *
	 * @return bool
	 */
	private function filter_items( $item ) {
		return 0 !== $item['count'];
	}
}
