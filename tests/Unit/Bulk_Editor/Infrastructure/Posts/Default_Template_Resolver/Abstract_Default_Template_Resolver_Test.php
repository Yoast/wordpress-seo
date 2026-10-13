<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Default_Template_Resolver tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Default_Template_Resolver_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Default_Template_Resolver
	 */
	protected $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Default_Template_Resolver( $this->options_helper );
	}
}
