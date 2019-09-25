<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Presenters\Abstract_Robots_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @group presenters
 *
 * @package Yoast\WP\Free\Tests\Presenters
 */
class Abstract_Robots_Presenter_Test extends TestCase {

	/**
	 * @var \Yoast\WP\Free\Presenters\Abstract_Robots_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Abstract_Robots_Presenter::class )
			->makePartial();

		$this->instance->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 */
	public function test_present() {
		$indexable = Mockery::mock( 'Yoast\WP\Free\Models\Indexable' );
		$this->instance
			->expects( 'generate' )
			->once()
			->with( $indexable )
			->andReturn( 'index,nofollow' );

		$actual = $this->instance->present( $indexable );
		$expected = '<meta name="robots" content="index,nofollow"/>';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_robots` filter is applied.
	 */
	public function test_present_filter() {
		$indexable = Mockery::mock( 'Yoast\WP\Free\Models\Indexable' );
		$this->instance
			->expects( 'generate' )
			->once()
			->with( $indexable )
			->andReturn( 'index,nofollow' );

		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index,nofollow')
			->andReturn( 'noindex' );

		$actual = $this->instance->present( $indexable );
		$expected = '<meta name="robots" content="noindex"/>';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the presenter returns no meta tag when the robots meta content is empty.
	 */
	public function test_present_empty_robots_content() {
		$indexable = Mockery::mock( 'Yoast\WP\Free\Models\Indexable' );
		$this->instance
			->expects( 'generate' )
			->once()
			->with( $indexable )
			->andReturn( '' );

		$actual = $this->instance->present( $indexable );
		$expected = '';

		$this->assertEquals( $actual, $expected );
	}
}
