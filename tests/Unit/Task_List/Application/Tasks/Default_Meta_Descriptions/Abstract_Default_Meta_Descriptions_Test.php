<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Default_Meta_Descriptions;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Default_Meta_Descriptions;
use Yoast\WP\SEO\Task_List\Infrastructure\Indexables\Recent_Content_Indexable_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Default Meta Descriptions task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Default_Meta_Descriptions_Test extends TestCase {

	/**
	 * The recent content indexable collector mock.
	 *
	 * @var Mockery\MockInterface|Recent_Content_Indexable_Collector
	 */
	protected $recent_content_indexable_collector;

	/**
	 * The indexable helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Default_Meta_Descriptions
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

		Monkey\Functions\when( 'get_post_type_object' )->justReturn(
			(object) [
				'label' => 'Posts',
				'name'  => 'post',
			],
		);

		$this->recent_content_indexable_collector = Mockery::mock( Recent_Content_Indexable_Collector::class );
		$this->indexable_helper                   = Mockery::mock( Indexable_Helper::class );
		$this->options_helper                     = Mockery::mock( Options_Helper::class );

		$this->indexable_helper
			->shouldReceive( 'should_index_indexables' )
			->andReturn( true )
			->byDefault();

		$this->options_helper
			->shouldReceive( 'get' )
			->with( 'metadesc-post' )
			->andReturn( '' )
			->byDefault();

		$this->instance = new Default_Meta_Descriptions(
			$this->recent_content_indexable_collector,
			$this->indexable_helper,
			$this->options_helper,
		);
	}
}
