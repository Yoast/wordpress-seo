<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexable_Presenter_Test.
 *
 * @group presenters
 *
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Abstract_Cached_Indexable_Tag_Presenter_Test extends TestCase {

	/**
	 * Test that the value is refreshed only once and subsequent gets return a cached value.
	 *
	 * @covers \Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter
	 */
	public function test_get_should_run_once() {
		$instance = new Concrete_Cached_Presenter();

		$initial = $instance->get(); // Refreshed; hit count 1.
		$cached  = $instance->get(); // Cache should be hit.
		$cached2 = $instance->get(); // Cache should be hit.

		$this->assertEquals( $initial, $cached );
		$this->assertEquals( $initial, $cached2 );
		$this->assertEquals( 1, $instance->get_hit_count() );
	}
}

/**
 * Class Concrete_Cached_Presenter, needed because abstract classes cannot be instantiated.
 */
class Concrete_Cached_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	/**
	 * The number of times the get method was hit.
	 *
	 * @var int
	 */
	protected $hit_count = 0;

	/**
	 * For testing purposes, returns the number of times a refresh was run.
	 *
	 * @return int
	 */
	public function get_hit_count() {
		return $this->hit_count;
	}

	/**
	 * Provide a fresh value.
	 *
	 * @return string
	 */
	public function refresh() {
		$this->hit_count++;
		return 'value refreshed!';
	}
}
