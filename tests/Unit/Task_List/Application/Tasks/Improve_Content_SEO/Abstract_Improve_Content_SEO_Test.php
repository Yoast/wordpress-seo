<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Improve Content SEO task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Improve_Content_SEO_Test extends TestCase {

	/**
	 * The recent content indexable collector mock.
	 *
	 * @var Mockery\MockInterface|Recent_Content_Indexable_Collector
	 */
	protected $recent_content_indexable_collector;

	/**
	 * Holds the instance.
	 *
	 * @var Improve_Content_SEO
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->recent_content_indexable_collector = Mockery::mock( Recent_Content_Indexable_Collector::class );

		$this->instance = new Improve_Content_SEO(
			$this->recent_content_indexable_collector
		);
	}
}
