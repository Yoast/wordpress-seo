<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Breadcrumbs_Enabled_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional
 */
class Breadcrumbs_Enabled_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Breadcrumbs_Enabled_Conditional
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
	 */
	protected function set_up() {
		parent::set_up();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Breadcrumbs_Enabled_Conditional( $this->options );
	}

	/**
	 * Tests that the conditional returns the correct option value.
	 *
	 * @covers ::is_met
	 */
	public function test_breadcrumbs_enabled_option() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'breadcrumbs-enable' )
			->andReturn( true );

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
