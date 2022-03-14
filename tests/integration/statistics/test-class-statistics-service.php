<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Statistics
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Statistics_Service
 */
class WPSEO_Statistics_Service_Test extends WPSEO_UnitTestCase {

	/**
	 * Reset after each test.
	 */
	public function tear_down() {
		delete_transient( WPSEO_Statistics_Service::CACHE_TRANSIENT_KEY );

		parent::tear_down();
	}

	/**
	 * Tests filtering the zero counts.
	 *
	 * @covers ::get_statistics
	 */
	public function test_filter_zero_counts() {
		$statistics = new Statistics_Mock(
			[
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			]
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertCount( 1, $response_data['seo_scores'] );
	}

	/**
	 * Tests the rendering of generated link that navigates to an overview with post
	 * for a specific author.
	 *
	 * @covers ::get_statistics
	 */
	public function test_seo_score_links() {
		$statistics = new Statistics_Mock(
			[
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			]
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals(
			esc_url( admin_url( 'edit.php?post_status=publish&post_type=post&seo_filter=ok&author=0' ) ),
			$response_data['seo_scores'][0]['link']
		);
	}

	/**
	 * Tests the rendering of generated link that navigates to an overview with post of that type.
	 *
	 * @covers ::get_statistics
	 */
	public function test_admin_seo_score_links() {
		$user = wp_get_current_user();
		$user->add_cap( 'edit_others_posts' );

		$statistics = new Statistics_Mock(
			[
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			]
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

	/**
	 * Tests the total amount of seo scores.
	 *
	 * @covers ::get_statistics
	 */
	public function test_page_counts() {
		$statistics = new Statistics_Mock(
			[
				'ok'  => 10,
				'na'  => 0,
				'bad' => 0,
			]
		);

		$class_instance = new WPSEO_Statistics_Service( $statistics );
		$rest_response  = $class_instance->get_statistics();
		$response_data  = $rest_response->get_data();

		$this->assertEquals( 10, $response_data['seo_scores'][0]['count'] );
	}
}
