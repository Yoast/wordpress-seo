<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Link List Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Link_Lists_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Link_Lists_Builder
	 */
	protected $instance;

	/**
	 * Holds the content types collector.
	 *
	 * @var Mockery\MockInterface|Content_Types_Collector
	 */
	protected $content_types_collector;

	/**
	 * Holds the terms collector.
	 *
	 * @var Mockery\MockInterface|Terms_Collector
	 */
	protected $terms_collector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->content_types_collector = Mockery::mock( Content_Types_Collector::class );
		$this->terms_collector         = Mockery::mock( Terms_Collector::class );

		$this->instance = new Link_Lists_Builder(
			$this->content_types_collector,
			$this->terms_collector
		);
	}
}
