<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\SEO_Data_Optimization_Status_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_SEO_Data_Optimization_Status_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_SEO_Data_Optimization_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_SEO_Data_Optimization_Status_Ability
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_SEO_Data_Optimization_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The SEO data optimization status collector mock.
	 *
	 * @var Mockery\MockInterface|SEO_Data_Optimization_Status_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_SEO_Data_Optimization_Status_Ability
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->collector         = Mockery::mock( SEO_Data_Optimization_Status_Collector::class );

		$this->instance = new Get_SEO_Data_Optimization_Status_Ability( $this->capability_helper, $this->collector );
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-seo-data-optimization-status', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers ::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the Yoast SEO management capability and returns its result.
	 *
	 * @covers ::__construct
	 * @covers ::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $can Whether the current user can manage Yoast SEO.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $can ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $can );

		$this->assertSame( $can, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the status of the collector.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$status = [
			'optimization_enabled'  => true,
			'optimization_complete' => false,
		];

		$this->collector->expects( 'get' )->once()->andReturn( $status );

		$this->assertSame( $status, $this->instance->execute() );
	}

	/**
	 * Tests that get_args accepts no input and returns the status as booleans.
	 *
	 * @covers ::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		// The default input is a new object, so it can only be compared by value.
		$this->assertEquals(
			[
				'label'               => 'Get SEO Data Optimization Status',
				'description'         => 'Get whether the SEO data optimization of Yoast SEO is enabled, and whether it is complete. The abilities that get or update the SEO data of posts, terms and authors, and the abilities that get the scores, are only available when the SEO data optimization is enabled, and only find content whose SEO data has been optimized, so while the SEO data optimization has not finished, they can miss content that exists. This status explains why those abilities can be missing or not find content that exists. A user who can manage the SEO settings can start the SEO data optimization from the Tools page of the plugin.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'default'              => new stdClass(),
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'optimization_enabled'  => [
							'type'        => 'boolean',
							'description' => 'Whether the SEO data optimization is enabled. It is disabled on non-production environments, unless custom code enables it, and custom code can also disable it on any environment.',
						],
						'optimization_complete' => [
							'type'        => 'boolean',
							'description' => 'Whether the SEO data optimization is complete for the data that the SEO data and score abilities read. Always false when the SEO data optimization is disabled.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_manage_seo' ],
				'execute_callback'    => [ $this->instance, 'execute' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => true,
						'destructive' => false,
						'idempotent'  => true,
					],
					'mcp'          => [
						'public' => true,
					],
				],
			],
			$this->instance->get_args(),
		);
	}
}
