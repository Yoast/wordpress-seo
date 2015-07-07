<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to change or add WordPress dashboard widgets
 */
class Yoast_Dashboard_Widget {

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

		add_filter( 'dashboard_glance_items', array( $this, 'add_glance_items' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_dashboard_stylesheet' ) );
		add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
	}

	/**
	 * Adds dashboard widget to WordPress
	 */
	public function add_dashboard_widget() {
		wp_add_dashboard_widget(
			'wpseo-dashboard-overview',
			__( 'Yoast SEO Posts Overview', 'wordpress-seo' ),
			array( $this, 'display_dashboard_widget' )
		);
	}

	/**
	 * Display the dashboard widget
	 */
	public function display_dashboard_widget() {
		$statistics = $this->glance_items();

		include WPSEO_PATH . '/admin/views/dashboard-widget.php';
	}

	/**
	 * An array representing items to be added to the At a Glance dashboard widget
	 *
	 * @return array
	 */
	private function glance_items() {

		$items = array(
			array(
				'seo_filter' => 'good',
				'title' => _n_noop( '%d post with an SEO score good &raquo;', '%d posts with an SEO score good &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-good',
				'count' => $this->statistics->get_good_seo_post_count(),
			),
			array(
				'seo_filter' => 'ok',
				'title' => _n_noop( '%d post with an SEO score ok &raquo;', '%d posts with an SEO score ok &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-ok',
				'count' => $this->statistics->get_ok_seo_post_count(),
			),
			array(
				'seo_filter' => 'poor',
				'title' => _n_noop( '%d post with an SEO score poor &raquo;', '%d posts with an SEO score poor &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-poor',
				'count' => $this->statistics->get_poor_seo_post_count(),
			),
			array(
				'seo_filter' => 'bad',
				'title' => _n_noop( '%d post with an SEO score bad &raquo;', '%d posts with an SEO score bad &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-bad',
				'count' => $this->statistics->get_bad_seo_post_count(),
			),
			array(
				'seo_filter' => 'na',
				'title' => _n_noop( '%d post that doesn&#8217;t have a focus keyword yet &raquo;', '%d posts that don&#8217;t have a focus keyword yet &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-na',
				'count' => $this->statistics->get_no_focus_post_count(),
			),
			array(
				'seo_filter' => 'noindex',
				'title' => _n_noop( '%d post that is set to <code>noindex</code> and thus not in the search engines &raquo;', '%d posts that are set to <code>noindex</code> and thus not in the search engines &raquo;', 'wordpress-seo' ),
				'class' => 'wpseo-glance-noindex',
				'count' => $this->statistics->get_no_index_post_count(),
			),
		);

		foreach ( $items as $key => $item ) {

			// Remove useless statistics.
			if ( 0 === $item['count'] ) {
				unset( $items[ $key ] );
				continue;
			}

			// Translate titles with actual count.
			$items[ $key ]['title'] = translate_nooped_plural( $item['title'], $item['count'], 'wordpress-seo' );
		}

		return $items;
	}

	/**
	 * Add glance items to the At a Glance dashboard widget
	 *
	 * @param array $items Current glance items.
	 *
	 * @return array
	 */
	public function add_glance_items( $items ) {

		foreach ( $this->glance_items() as $glance_item ) {

			$items[] = sprintf(
				'<a href="%s" class="wpseo-glance %s">%s</a>',
				admin_url( 'edit.php?post_status=all&post_type=post&seo_filter=' . $glance_item['seo_filter'] ),
				$glance_item['class'],
				sprintf( $glance_item['title'], $glance_item['count'] )
			);
		}

		return $items;
	}

	/**
	 * Enqueue's stylesheet for the dashboard if the current page is the dashboard
	 */
	public function enqueue_dashboard_stylesheet() {
		if ( 'dashboard' === get_current_screen()->id ) {
			wp_enqueue_style( 'wpseo-wp-dashboard', plugins_url( 'css/dashboard' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		}
	}

}
