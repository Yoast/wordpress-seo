<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Discussed in Tech Council, a better solution is being worked on.

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin\Addon_Installation;

use Yoast\WP\SEO\Conditionals\Admin\Licenses_Page_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Addon_Installation\Installation_Success_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Installation_Success_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Addon_Installation\Installation_Success_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\Addon_Installation\Installation_Success_Integration
 */
class Installation_Success_Integration_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Installation_Success_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Installation_Success_Integration();
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {

		$this->instance->register_hooks();

		$this->assertSame( 10, has_action( 'admin_init', [ $this->instance, 'installation_success_alert' ] ) );
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
				Licenses_Page_Conditional::class,
			],
			Installation_Success_Integration::get_conditionals()
		);
	}

	/**
	 * Tests if the install argument is not provided the dialog is not shown.
	 *
	 * @covers ::installation_success_alert
	 */
	public function test_installation_success_alert_returns_when_activation_success_url_parameter_is_false() {

		$_GET['activation_success'] = 'false';

		$this->instance->installation_success_alert();

		$this->assertFalse( has_action( 'admin_enqueue_scripts', [ $this->instance, 'generate_success_box' ] ) );
	}

	/**
	 * Tests if the install argument is not provided the dialog is not shown.
	 *
	 * @covers ::installation_success_alert
	 */
	public function test_installation_success_alert_registers_action_when_activation_success_url_parameter_is_true() {

		$_GET['activation_success'] = 'true';

		$this->instance->installation_success_alert();

		$this->assertNotFalse( has_action( 'admin_enqueue_scripts', [ $this->instance, 'generate_success_box' ] ) );
	}
}
