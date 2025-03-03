<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

use Mockery;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Permanently Dismissed Site Kit Configuration Repository tests.
 *
 * @group Site_Kit_Consent_Repository
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Kit_Consent_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Consent_Repository
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

		$this->instance = new Site_Kit_Consent_Repository( $this->options_helper );
	}
}
