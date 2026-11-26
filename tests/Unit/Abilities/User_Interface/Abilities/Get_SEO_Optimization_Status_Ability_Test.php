<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\SEO_Optimization_Status_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_SEO_Optimization_Status_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_SEO_Optimization_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_SEO_Optimization_Status_Ability
 */
final class Get_SEO_Optimization_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The SEO optimization status collector mock.
	 *
	 * @var Mockery\MockInterface|SEO_Optimization_Status_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_SEO_Optimization_Status_Ability
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
		$this->collector         = Mockery::mock( SEO_Optimization_Status_Collector::class );

		$this->instance = new Get_SEO_Optimization_Status_Ability( $this->capability_helper, $this->collector );
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
		$this->assertSame( 'yoast-seo/get-seo-optimization-status', $this->instance->get_name() );
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
	 * Tests that can_edit_advanced_metadata checks the advanced metadata capability and returns its result.
	 *
	 * @covers ::__construct
	 * @covers ::can_edit_advanced_metadata
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $can Whether the current user can edit advanced SEO metadata.
	 *
	 * @return void
	 */
	public function test_can_edit_advanced_metadata( bool $can ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $can );

		$this->assertSame( $can, $this->instance->can_edit_advanced_metadata() );
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
			'indexables_enabled' => true,
			'is_optimized'       => false,
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
				'label'               => 'Get SEO Optimization Status',
				'description'         => 'Get whether Yoast SEO stores the SEO data of the site in its indexables, and whether it has finished optimizing that SEO data. The abilities that get or update the SEO data of posts, terms and authors, and the abilities that get the scores, are only available when the indexables are enabled, and only find content whose SEO data has been optimized, so while the optimization has not finished, they can miss content that exists. Check this status when those abilities are missing or don\'t find content you expect. A user who can manage the SEO settings can start the optimization from the Tools page of the plugin.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'default'              => new stdClass(),
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'indexables_enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether the indexables are enabled. They are disabled on non-production environments, unless a developer enables them, and a developer can also disable them on any environment.',
						],
						'is_optimized'       => [
							'type'        => 'boolean',
							'description' => 'Whether the SEO data of all the content of the site has been optimized. Always false when the indexables are disabled.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_edit_advanced_metadata' ],
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
