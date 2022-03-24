<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Options_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Integration_Test.
 *
 * @group integrations
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Options_Integration
 */
class Options_Integration_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Options_Integration
	 */
	protected $instance;

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Options_Integration( $this->options_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Options_Integration::class, $this->instance );
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Options_Integration::get_conditionals() );
	}

	/**
	 * Tests that the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'registered_post_type' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'unregistered_post_type' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'registered_taxonomy' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'unregistered_taxonomy' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();

		$this->instance->register_hooks();
	}
}
