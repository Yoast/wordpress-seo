<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Collector;
use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Feature_Status_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Feature_Status_Collector
 */
final class Feature_Status_Collector_Test extends TestCase {

	/**
	 * The feature repository mock.
	 *
	 * @var Mockery\MockInterface|Feature_Repository
	 */
	private $feature_repository;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Feature_Status_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->feature_repository = Mockery::mock( Feature_Repository::class );
		$this->options_helper     = Mockery::mock( Options_Helper::class );

		$this->instance = new Feature_Status_Collector( $this->feature_repository, $this->options_helper );
	}

	/**
	 * Tests that get_all returns whether each available feature is enabled, keyed by feature key, treating anything
	 * but a stored true as disabled, and a feature that code turns off despite its setting as disabled too.
	 *
	 * The features whose setting is off are mocked without `is_disabled_programmatically`, so the test fails if it is
	 * checked needlessly.
	 *
	 * @covers ::__construct
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all() {
		$this->feature_repository
			->expects( 'get_available' )
			->once()
			->andReturn(
				[
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'                      => 'open_graph',
							'get_option_name'              => 'opengraph',
							'get_name'                     => 'Open Graph data',
							'is_disabled_programmatically' => false,
						],
					),
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'         => 'x_card',
							'get_option_name' => 'twitter',
							'get_name'        => 'X card data',
						],
					),
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'         => 'xml_sitemap',
							'get_option_name' => 'enable_xml_sitemap',
							'get_name'        => 'XML sitemap',
						],
					),
					Mockery::mock(
						Feature_Interface::class,
						[
							'get_key'                      => 'schema_framework',
							'get_option_name'              => 'enable_schema',
							'get_name'                     => 'Schema Framework',
							'is_disabled_programmatically' => true,
						],
					),
				],
			);

		$this->options_helper->expects( 'get' )->once()->with( 'opengraph', false )->andReturnTrue();
		$this->options_helper->expects( 'get' )->once()->with( 'twitter', false )->andReturnFalse();
		$this->options_helper->expects( 'get' )->once()->with( 'enable_xml_sitemap', false )->andReturn( 'on' );
		$this->options_helper->expects( 'get' )->once()->with( 'enable_schema', false )->andReturnTrue();

		$this->assertSame(
			[
				'open_graph'       => true,
				'x_card'           => false,
				'xml_sitemap'      => false,
				'schema_framework' => false,
			],
			$this->instance->get_all(),
		);
	}

	/**
	 * Tests that get_all returns an empty array when no feature can be changed on the site.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all_without_available_features() {
		$this->feature_repository->expects( 'get_available' )->once()->andReturn( [] );
		$this->options_helper->expects( 'get' )->never();

		$this->assertSame( [], $this->instance->get_all() );
	}
}
