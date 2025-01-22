<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories;

use Mockery;
use Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introductions seen repository.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Permanently_Dismissed_Site_Kit_Widget_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Permanently_Dismissed_Site_Kit_Widget_Repository
	 */
	private $instance;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Permanently_Dismissed_Site_Kit_Widget_Repository( $this->options_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests if the Site Kit widget dismissal status can be set.
	 *
	 * @covers ::set_site_kit_widget_dismissal
	 *
	 * @return void
	 */
	public function test_set_site_kit_widget_dismissal() {
		$is_dismissed = true;
		$this->options_helper->shouldReceive( 'set' )
			->with( 'site_kit_widget_permanently_dismissed', $is_dismissed )
			->andReturn( true );

		$this->assertTrue( $this->instance->set_site_kit_widget_dismissal( $is_dismissed ) );
	}

	/**
	 * Tests if the Site Kit widget dismissal status can be retrieved.
	 *
	 * @covers ::is_site_kit_widget_dismissed
	 *
	 * @return void
	 */
	public function test_is_site_kit_widget_dismissed() {
		$this->options_helper->shouldReceive( 'get' )
			->with( 'site_kit_widget_permanently_dismissed', false )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_site_kit_widget_dismissed() );
	}
}
