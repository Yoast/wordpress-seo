<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Link List Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Optional_Link_List_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Optional_Link_List_Builder
	 */
	protected $instance;

	/**
	 * Holds the sitemap link collector.
	 *
	 * @var Mockery\MockInterface|Sitemap_Link_Collector
	 */
	protected $sitemap_link_collector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->sitemap_link_collector = Mockery::mock( Sitemap_Link_Collector::class );

		$this->instance = new Optional_Link_List_Builder(
			$this->sitemap_link_collector
		);
	}
}
