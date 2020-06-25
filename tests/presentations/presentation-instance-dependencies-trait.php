<?php

namespace Yoast\WP\SEO\Tests\Presentations;

use Mockery;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Locale_Generator;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

trait Presentation_Instance_Dependencies {

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url;

	/**
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page;

	/**
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user;

	/**
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image;

	/**
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * @var Open_Graph_Image_Generator|Mockery\MockInterface
	 */
	protected $open_graph_image_generator;

	/**
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image_generator;

	/**
	 * Helper function for setting helpers of the base indexable presentation.
	 *
	 * @param Indexable_Presentation $presentation_instance The indexable presentation instance.
	 */
	protected function set_instance_dependencies( Indexable_Presentation $presentation_instance ) {
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->image            = Mockery::mock( Image_Helper::class );
		$this->current_page     = Mockery::mock( Current_Page_Helper::class );
		$this->url              = Mockery::mock( Url_Helper::class );
		$this->user             = Mockery::mock( User_Helper::class );
		$this->open_graph_image = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter          = Mockery::mock( Twitter_Image_Helper::class );

		$presentation_instance->set_helpers(
			$this->image,
			$this->options,
			$this->current_page,
			$this->url,
			$this->user
		);

		$this->open_graph_image_generator = Mockery::mock(
			Open_Graph_Image_Generator::class,
			[
				$this->open_graph_image,
				$this->image,
				$this->options,
				$this->url,
			]
		);

		$this->twitter_image_generator = Mockery::mock(
			Twitter_Image_Generator::class,
			[
				$this->image,
				$this->url,
				$this->twitter,
			]
		);

		$presentation_instance->set_generators(
			Mockery::mock( Schema_Generator::class ),
			new Open_Graph_Locale_Generator(),
			$this->open_graph_image_generator,
			$this->twitter_image_generator,
			Mockery::mock( Breadcrumbs_Generator::class )
		);
	}
}
