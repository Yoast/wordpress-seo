<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Application\Endpoints;

use Yoast\WP\SEO\Dashboard\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Readability_Scores_Endpoint;
use Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\SEO_Scores_Endpoint;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Yoast\WP\SEO\Dashboard\Application\Taxonomies\Endpoints_Repository.
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Endpoints\Endpoints_Repository::get_all_endpoints
 */
final class Endpoints_Repository_Test extends TestCase {

	/**
	 * Tests if both endpoints make it into the endpoint list with the needed data
	 *
	 * @dataProvider data_get_all_endpoints
	 *
	 * @param Endpoint_Interface[] $endpoints     List of possible endpoints.
	 * @param array<string>        $expected_list Expected url list.
	 *
	 * @return void
	 */
	public function test_get_all_endpoints( array $endpoints, array $expected_list ) {
		$instance = new Endpoints_Repository( ...$endpoints );

		self::assertEquals( $expected_list, $instance->get_all_endpoints()->to_array() );
	}

	/**
	 * Data provider for test_get_all_endpoints.
	 *
	 * @return array<array<Endpoint_Interface[],array<string>>>
	 */
	public static function data_get_all_endpoints() {
		$readability_endpoint = new Readability_Scores_Endpoint();
		$seo_scores_endpoint  = new SEO_Scores_Endpoint();

		return [
			'Seo and Readability endpoint' => [
				'endpoints'     => [ $readability_endpoint, $seo_scores_endpoint ],
				'expected_list' => [
					'readabilityScores' => 'http://example.org/index.php?rest_route=/yoast/v1/readability_scores',
					'seoScores'         => 'http://example.org/index.php?rest_route=/yoast/v1/seo_scores',
				],
			],
			'Seo endpoint'                 => [
				'endpoints'     => [ $seo_scores_endpoint ],
				'expected_list' => [

					'seoScores' => 'http://example.org/index.php?rest_route=/yoast/v1/seo_scores',
				],
			],
			'no endpoints'                 => [
				'endpoints'     => [],
				'expected_list' => [],
			],
		];
	}
}
