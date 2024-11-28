<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Scores;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Application\Score_Results\SEO_Score_Results\SEO_Score_Results_Repository;
use Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class SEO_Scores_Route_Test
 *
 * @group dashboard
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route
 */
final class SEO_Scores_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var SEO_Scores_Route
	 */
	private $instance;

	/**
	 * Holds the SEO_Score_Results_Repository instance.
	 *
	 * @var Mockery\MockInterface|SEO_Score_Results_Repository
	 */
	private $score_results_repository;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->score_results_repository = Mockery::mock( SEO_Score_Results_Repository::class );

		$this->instance = new SEO_Scores_Route( $this->score_results_repository );

		$user = $this->factory->user->create_and_get();
		$user->add_cap( 'wpseo_manage_options' );

		\wp_set_current_user( $user->ID );
	}

	/**
	 * Tests the get_scores method.
	 *
	 * @covers ::get_scores
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\SEO_Score_Results\SEO_Score_Results_Repository::get_score_results
	 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\SEO_Score_Results\SEO_Score_Results_Collector::get_score_results
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_scores
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_score_links
	 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector::get_view_link
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Score_Result\Score_Result::to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Scores_List::to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_name
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_amount
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_links_to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_name
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_min_score
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_max_score
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_position
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_filter_key
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_filter_value
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type::get_name
	 *
	 * @return void
	 */
	public function test_get_seo_scores() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$response
		);

		$response_data = $response->get_data();

		$this->assertIsArray( $response_data );
		$this->assertIsArray( $response_data['scores'] );
		$this->assertIsFloat( $response_data['queryTime'] );
		$this->assertIsBool( $response_data['cacheUsed'] );
	}
}
