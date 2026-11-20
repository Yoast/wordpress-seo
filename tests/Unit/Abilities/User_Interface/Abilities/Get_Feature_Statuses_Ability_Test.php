<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Collector;
use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Feature_Statuses_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Feature_Statuses_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Feature_Statuses_Ability
 */
final class Get_Feature_Statuses_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature repository mock.
	 *
	 * @var Mockery\MockInterface|Feature_Repository
	 */
	private $feature_repository;

	/**
	 * The feature status collector mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Collector
	 */
	private $feature_status_collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Feature_Statuses_Ability
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

		$this->capability_helper        = Mockery::mock( Capability_Helper::class );
		$this->feature_repository       = Mockery::mock( Feature_Repository::class );
		$this->feature_status_collector = Mockery::mock( Feature_Status_Collector::class );

		$this->instance = new Get_Feature_Statuses_Ability(
			$this->capability_helper,
			$this->feature_repository,
			$this->feature_status_collector,
		);
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-feature-statuses', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true.
	 *
	 * @covers ::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
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
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers ::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the statuses from the collector.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$statuses = [
			'open_graph' => true,
			'llms_txt'   => false,
		];

		$this->feature_status_collector->expects( 'get_all' )->once()->andReturn( $statuses );

		$this->assertSame( $statuses, $this->instance->execute() );
	}

	/**
	 * Tests that get_args returns the expected registration arguments, with an output property per available feature.
	 *
	 * @covers ::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->feature_repository
			->expects( 'get_all' )
			->once()
			->andReturn(
				[
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'         => 'open_graph',
							'get_option_name' => 'opengraph',
							'get_name'        => 'Open Graph data',
						],
					),
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'         => 'llms_txt',
							'get_option_name' => 'enable_llms_txt',
							'get_name'        => 'llms.txt',
						],
					),
				],
			);

		$this->assertEquals(
			[
				'label'               => 'Get Feature Statuses',
				'description'         => 'Get whether Yoast SEO features like the XML sitemap and Open Graph data are enabled. A feature that cannot be turned on or off on this site is listed too: for example, llms.txt on multisite, or XML sitemaps when a network admin has disallowed them for the sites of the network. A feature counts as disabled when code on the site, like a filter, turns it off, even if its setting is on.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'default'              => new stdClass(),
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'open_graph' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s Open Graph data feature is enabled.',
						],
						'llms_txt'   => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s llms.txt feature is enabled.',
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
