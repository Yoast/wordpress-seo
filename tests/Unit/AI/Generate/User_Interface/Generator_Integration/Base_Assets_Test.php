<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Generator_Integration;

use Mockery;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Base class for assets enqueuing.
 *
 * @group ai-generator
 */
abstract class Base_Assets_Test extends Abstract_Generator_Integration_Test {

	/**
	 * Mock for the generator endpoint list.
	 *
	 * @var Endpoint_List|Mockery\MockInterface
	 */
	private $generator_endpoint_list;

	/**
	 * Mock for the free sparks endpoint list.
	 *
	 * @var Endpoint_List|Mockery\MockInterface
	 */
	private $free_sparks_endpoint_list;

	/**
	 * Mock for the merged endpoint list.
	 *
	 * @var Endpoint_List|Mockery\MockInterface
	 */
	private $merged_endpoint_list;

	/**
	 * Array representation of the generator endpoints.
	 *
	 * @var array<string, string>
	 */
	private $generator_endpoint_array;

	/**
	 * Array representation of the free sparks endpoints.
	 *
	 * @var array<string, string>
	 */
	private $free_sparks_endpoint_array;

	/**
	 * Array representation of the merged endpoints.
	 *
	 * @var array<string, string>
	 */
	private $merged_endpoint_array;

	/**
	 * The expected script data.
	 *
	 * @var array<string, bool|int|array<string, bool|string>>
	 */
	private $script_data;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->generator_endpoint_list    = Mockery::mock( Endpoint_List::class );
		$this->free_sparks_endpoint_list  = Mockery::mock( Endpoint_List::class );
		$this->merged_endpoint_list       = Mockery::mock( Endpoint_List::class );
		$this->generator_endpoint_array   = [
			'getSuggestions' => 'http://example.test/wp-json/yoast/v1/ai_generator/get_suggestions',
			'getUsage'       => 'http://example.test/wp-json/yoast/v1/ai_generator/get_usage',
		];
		$this->free_sparks_endpoint_array = [
			'freeSparks' => 'http://example.test/wp-json/yoast/v1/ai/free_sparks',
		];
		$this->merged_endpoint_array      = [
			'getSuggestions' => 'http://example.test/wp-json/yoast/v1/ai_generator/get_suggestions',
			'getUsage'       => 'http://example.test/wp-json/yoast/v1/ai_generator/get_usage',
			'freeSparks'     => 'http://example.test/wp-json/yoast/v1/ai/free_sparks',
		];

		$this->script_data = [
			'hasConsent'           => true,
			'productSubscriptions' => [
				'premiumSubscription'     => true,
				'wooCommerceSubscription' => true,
			],
			'hasSeenIntroduction'  => true,
			'requestTimeout'       => 0,
			'isFreeSparks'         => true,
			'endpoints'            => $this->merged_endpoint_array,
		];
	}

	/**
	 * Sets up the expectations for the endpoint fetching and script localization.
	 *
	 * @return array<string, bool|int|array<string, bool|string>> The script data.
	 */
	protected function get_script_data(): array {
		return $this->script_data;
	}

	/**
	 * Sets up the expectations for fetching and merging the endpoints.
	 *
	 * @return void
	 */
	protected function endpoints_expectations() {
		$this->generator_endpoint_repository->expects( 'get_all_endpoints' )
			->once()
			->andReturn( $this->generator_endpoint_list );

		$this->free_sparks_endpoint_repository->expects( 'get_all_endpoints' )
			->once()
			->andReturn( $this->free_sparks_endpoint_list );

		$this->generator_endpoint_list->expects( 'merge_with' )
			->once()
			->with( $this->free_sparks_endpoint_list )
			->andReturn( $this->merged_endpoint_list );

		$this->merged_endpoint_list->expects( 'to_array' )
			->once()
			->andReturn( $this->merged_endpoint_array );
	}
}
