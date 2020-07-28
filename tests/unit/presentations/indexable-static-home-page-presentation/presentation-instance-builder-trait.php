<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Static_Home_Page_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation;
use Yoast\WP\SEO\Presentations\Indexable_Static_Home_Page_Presentation;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Represents the indexable.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the presentation.
	 *
	 * @var Indexable_Post_Type_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Represents the post type helper.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type;

	/**
	 * Represents the meta tags context.
	 *
	 * @var Meta_Tags_Context_Mock|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * Represents the date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post;

	/**
	 * Builds an instance of Indexable_Static_Home_Page_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$this->post_type  = Mockery::mock( Post_Type_Helper::class );
		$this->post       = Mockery::mock( Post_Helper::class );
		$this->context    = Mockery::mock( Meta_Tags_Context_Mock::class )->makePartial();
		$this->date       = Mockery::mock( Date_Helper::class );
		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = Mockery::mock(
			Indexable_Static_Home_Page_Presentation::class,
			[
				$this->post_type,
				$this->date,
				$this->pagination,
				$this->post,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance = $instance->of(
			[
				'model'   => $this->indexable,
				'context' => $this->context,
			]
		);

		$this->set_instance_dependencies( $this->instance );

		$this->context->indexable = $this->indexable;
	}
}
