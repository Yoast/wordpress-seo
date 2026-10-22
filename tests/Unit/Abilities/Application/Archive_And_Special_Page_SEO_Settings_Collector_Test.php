<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Archive_And_Special_Page_SEO_Settings_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Settings_Collector
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Archive_And_Special_Page_SEO_Settings_Collector_Test extends TestCase {

	/**
	 * The global setting field map mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Field_Map
	 */
	private $field_map;

	/**
	 * The global setting target repository mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Target_Repository
	 */
	private $target_repository;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Archive_And_Special_Page_SEO_Settings_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->field_map         = Mockery::mock( Global_Setting_Field_Map::class );
		$this->target_repository = Mockery::mock( Global_Setting_Target_Repository::class );
		$this->options_helper    = Mockery::mock( Options_Helper::class );

		$this->instance = new Archive_And_Special_Page_SEO_Settings_Collector( $this->field_map, $this->target_repository, $this->options_helper );
	}

	/**
	 * Creates a target mock.
	 *
	 * @param array<string, string> $identifiers The identifiers of the target.
	 * @param bool                  $shared      Whether the template is shared.
	 *
	 * @return Mockery\MockInterface|Global_Setting_Target_Interface The target mock.
	 */
	private function mock_target( array $identifiers, bool $shared ) {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->allows( 'get_identifiers' )->andReturn( $identifiers );
		$target->allows( 'is_enabled' )->andReturnTrue();
		$target->allows( 'is_shared' )->andReturn( $shared );

		return $target;
	}

	/**
	 * Tests that get_target returns the identifiers of the target, the value of each field it has cast to its
	 * type, skipping the fields it does not have, and what agents need to know about the target.
	 *
	 * @covers ::__construct
	 * @covers ::get_target
	 *
	 * @return void
	 */
	public function test_get_target() {
		$identifiers = [
			'target'    => 'post_type_archive',
			'post_type' => 'portfolio',
			'label'     => 'Portfolio',
		];

		$target = $this->mock_target( $identifiers, false );

		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'seo_title'        => [ 'type' => 'string' ],
				'meta_description' => [ 'type' => 'string' ],
				'noindex'          => [ 'type' => 'boolean' ],
			],
		);
		$this->field_map->expects( 'get_option_name' )->once()->with( 'seo_title', $target )->andReturn( 'title-ptarchive-portfolio' );
		$this->field_map->expects( 'get_option_name' )->once()->with( 'meta_description', $target )->andReturnNull();
		$this->field_map->expects( 'get_option_name' )->once()->with( 'noindex', $target )->andReturn( 'noindex-ptarchive-portfolio' );
		$this->options_helper->expects( 'get' )->once()->with( 'title-ptarchive-portfolio' )->andReturn( '%%pt_plural%% Archive' );
		$this->options_helper->expects( 'get' )->once()->with( 'noindex-ptarchive-portfolio' )->andReturnNull();

		$this->assertSame(
			[
				'target'    => 'post_type_archive',
				'post_type' => 'portfolio',
				'label'     => 'Portfolio',
				'seo_title' => '%%pt_plural%% Archive',
				'noindex'   => false,
				'enabled'   => true,
				'shared'    => false,
			],
			$this->instance->get_target( $target ),
		);
	}

	/**
	 * Tests that get_all returns the global settings of every target of the repository.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all() {
		$homepage = $this->mock_target( [ 'target' => 'homepage' ], false );
		$search   = $this->mock_target( [ 'target' => 'search_page' ], true );

		$this->target_repository->expects( 'get_all' )->once()->andReturn( [ $homepage, $search ] );
		$this->field_map->allows( 'get_fields' )->andReturn( [] );

		$data = $this->instance->get_all();

		$this->assertSame( [ 'homepage', 'search_page' ], \array_column( $data, 'target' ) );
		$this->assertTrue( $data[1]['shared'] );
	}
}
