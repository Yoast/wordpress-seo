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
	}

	/**
	 * An array representing items to be added to the At a Glance dashboard widget
	 *
	 * @return array
	 */
	private function glance_items() {

		return array(
			array(
				'seo_filter' => 'na',
				'title' => __( 'Posts with No Focus keyword: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-na',
				'count' => $this->statistics->get_no_focus_post_count(),
			),
			array(
				'seo_filter' => 'bad',
				'title' => __( 'Posts with bad SEO: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-bad',
				'count' => $this->statistics->get_bad_seo_post_count(),
			),
			array(
				'seo_filter' => 'poor',
				'title' => __( 'Posts with poor SEO: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-poor',
				'count' => $this->statistics->get_poor_seo_post_count(),
			),
			array(
				'seo_filter' => 'ok',
				'title' => __( 'Posts with ok SEO: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-ok',
				'count' => $this->statistics->get_ok_seo_post_count(),
			),
			array(
				'seo_filter' => 'good',
				'title' => __( 'Posts with good SEO: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-good',
				'count' => $this->statistics->get_good_seo_post_count(),
			),
			array(
				'seo_filter' => 'noindex',
				'title' => __( 'Posts with noindex: %d', 'wordpress-seo' ),
				'class' => 'wpseo-glance-noindex',
				'count' => $this->statistics->get_no_index_post_count(),
			),
		);
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
