<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use WP_Post;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Zapier_Free;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Zapier_Free_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Zapier_Free
 *
 * @group integrations
 * @group third-party
 */
class Zapier_Free_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Zapier_Free
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Zapier_Free();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Premium_Inactive_Conditional::class ],
			Zapier_Free::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wpseo_publishbox_misc_actions', [ $this->instance, 'add_publishbox_text' ] ) );
	}
}
