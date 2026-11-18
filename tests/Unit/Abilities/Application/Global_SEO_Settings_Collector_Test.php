<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Global_SEO_Settings_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector
 */
final class Global_SEO_Settings_Collector_Test extends TestCase {

	/**
	 * The global setting field map mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Field_Map
	 */
	private $field_map;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Global_SEO_Settings_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->field_map      = Mockery::mock( Global_Setting_Field_Map::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Global_SEO_Settings_Collector( $this->field_map, $this->options_helper );
	}

	/**
	 * Tests that get_target_settings returns the identifiers of the target, the value of each field it has cast to its
	 * type, skipping the fields it does not have, and what agents need to know about the target.
	 *
	 * @covers ::__construct
	 * @covers ::get_target_settings
	 *
	 * @return void
	 */
	public function test_get_target_settings() {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->allows( 'get_identifiers' )->andReturn(
			[
				'post_type' => 'portfolio',
				'label'     => 'Portfolio',
			],
		);
		$target->allows( 'is_enabled' )->andReturnTrue();
		$target->allows( 'is_shared' )->andReturnTrue();

		$this->field_map->expects( 'get_fields' )->once()->andReturn(
			[
				'seo_title'        => [ 'type' => 'string' ],
				'meta_description' => [ 'type' => 'string' ],
				'noindex'          => [ 'type' => 'boolean' ],
			],
		);
		$this->field_map->expects( 'get_option_name' )->once()->with( 'seo_title', $target )->andReturn( 'title-portfolio' );
		$this->field_map->expects( 'get_option_name' )->once()->with( 'meta_description', $target )->andReturnNull();
		$this->field_map->expects( 'get_option_name' )->once()->with( 'noindex', $target )->andReturn( 'noindex-portfolio' );
		$this->options_helper->expects( 'get' )->once()->with( 'title-portfolio' )->andReturn( '%%title%% %%sep%% %%sitename%%' );
		$this->options_helper->expects( 'get' )->once()->with( 'noindex-portfolio' )->andReturnNull();

		$this->assertSame(
			[
				'post_type' => 'portfolio',
				'label'     => 'Portfolio',
				'seo_title' => '%%title%% %%sep%% %%sitename%%',
				'noindex'   => false,
				'enabled'   => true,
				'shared'    => true,
			],
			$this->instance->get_target_settings( $target ),
		);
	}
}
