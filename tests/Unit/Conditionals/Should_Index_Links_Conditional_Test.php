<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey\Filters;
use Mockery;
use Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Should_Index_Links_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional
 */
final class Should_Index_Links_Conditional_Test extends TestCase {

	/**
	 * Represents the conditional to test.
	 *
	 * @var Should_Index_Links_Conditional
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new Should_Index_Links_Conditional( $this->options );
	}

	/**
	 * Tests if the class attributes are set propertly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests that the conditional returns the correct option value.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_option_enabled_option() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'enable_text_link_counter' )
			->andReturnTrue();

		Filters\expectApplied( 'wpseo_should_index_links' )->once()->andReturnFirstArg();

		$this->assertTrue( $this->instance->is_met() );
	}
}
