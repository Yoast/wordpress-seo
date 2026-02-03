<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Terms_Collector;

use Mockery;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Terms_Collector tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Terms_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Terms_Collector
	 */
	protected $instance;

	/**
	 * Holds the taxonomy helper.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->taxonomy_helper = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Terms_Collector(
			$this->taxonomy_helper
		);
	}
}
