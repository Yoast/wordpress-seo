<?php
/**
 * @package WPSEO\Tests\Statistics
 */

/**
 * Test Helper Class.
 */
class Statistics_Mock extends WPSEO_Statistics {
	private $rank_counts;

	public function __construct( array $rank_counts ) {
		$this->rank_counts = $rank_counts;
	}

	public function get_post_count( $rank ) {
		if ( array_key_exists( $rank->get_rank(), $this->rank_counts ) ) {
			return $this->rank_counts[ $rank->get_rank() ];
		}

		return 0;
	}
}

/**
 * Unit Test Class.
 */
class WPSEO_Statistics_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Reset after each test.
	 */
	public function tearDown() {
		delete_transient( WPSEO_Statistics_Service::CACHE_TRANSIENT_KEY );
	}

	public function test_filter_zero_counts() {
		$statistics = new Statistics_Mock(
			array(
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			)
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertCount( 1, $response_data['seo_scores'] );
	}

	public function test_seo_score_links() {
		$statistics = new Statistics_Mock(
			array(
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			)
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals(
			esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=ok&author=0' ) ),
			$response_data['seo_scores'][0]['link']
		);
	}

	public function test_admin_seo_score_links() {
		$user = wp_get_current_user();
		$user->add_cap( 'edit_others_posts' );

		$statistics = new Statistics_Mock(
			array(
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			)
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals(
			esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=ok' ) ),
			$response_data['seo_scores'][0]['link']
		);

		$user->remove_cap( 'edit_others_posts' );
	}

	public function test_page_counts() {
		$statistics = new Statistics_Mock(
			array(
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			)
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals( 10, $response_data['seo_scores'][0]['count'] );
	}
}
