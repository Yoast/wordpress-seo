<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Title_Builder;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Title_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Title Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Title_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Title_Builder
	 */
	protected $instance;

	/**
	 * Holds the description adapter.
	 *
	 * @var Mockery\MockInterface|Title_Adapter
	 */
	protected $title_adapter;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->title_adapter = Mockery::mock( Title_Adapter::class );

		$this->instance = new Title_Builder(
			$this->title_adapter
		);
	}
}
