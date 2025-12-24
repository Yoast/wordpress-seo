<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

require_once __DIR__ . '/../../../../../../src/schema-aggregator/application/enhancement/abstract-schema-enhancer.php';
require_once __DIR__ . '/../../../../../../src/schema-aggregator/application/enhancement/article-schema-enhancer.php';

use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Article_Schema_Enhancer tests.
 */
abstract class Abstract_Article_Schema_Enhancer_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Article_Schema_Enhancer
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Article_Schema_Enhancer();
	}
}
