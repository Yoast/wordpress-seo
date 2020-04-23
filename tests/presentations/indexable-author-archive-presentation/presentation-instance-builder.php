<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Author_Archive_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Presentations\Presentation_Instance_Dependencies;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * Holds the Indexable_Author_Archive_Presentation instance.
	 *
	 * @var Indexable_Author_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Holds the WP_Query_Wrapper instance.
	 *
	 * @var WP_Query_Wrapper|Mockery\MockInterface
	 */
	protected $wp_query_wrapper;

	/**
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Builds an instance of Indexable_Author_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->post_type  = Mockery::mock( Post_Type_Helper::class );
		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Author_Archive_Presentation( $this->post_type );

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}
}
