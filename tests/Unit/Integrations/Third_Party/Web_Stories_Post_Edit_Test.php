<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Web_Stories_Post_Edit;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Web Stories integration test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Web_Stories_Post_Edit
 *
 * @group integrations
 * @group third-party
 */
final class Web_Stories_Post_Edit_Test extends TestCase {

	/**
	 * The Web Stories integration.
	 *
	 * @var Web_Stories_Post_Edit
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Web_Stories_Post_Edit();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Web_Stories_Conditional::class, Post_Conditional::class ],
			Web_Stories_Post_Edit::get_conditionals()
		);
	}

	/**
	 * Tests register hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'wpseo_admin_l10n', [ $this->instance, 'add_admin_l10n' ] ), 'The add_admin_l10n filter is registered.' );
	}

	/**
	 * Tests add_admin_l10n integration.
	 *
	 * @covers ::add_admin_l10n
	 *
	 * @return void
	 */
	public function test_add_admin_l10n() {
		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->andReturn( 'page' );

		$additional_entries = $this->instance->add_admin_l10n( [] );
		$this->assertEmpty( $additional_entries );

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->andReturn( 'web-story' );
		$additional_entries = $this->instance->add_admin_l10n( [] );
		$this->assertEquals( [ 'isWebStoriesIntegrationActive' => 1 ], $additional_entries );
	}
}
