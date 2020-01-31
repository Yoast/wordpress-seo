<?php

namespace Yoast\WP\SEO\Tests\Presentations;

use Mockery;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Generators\OG_Image_Generator;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Presentations\Generators\OG_Locale_Generator;
use Yoast\WP\SEO\Presentations\Generators\Schema_Generator;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;

trait Presentation_Instance_Dependencies {

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url_helper;

	/**
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page_helper;

	/**
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user_helper;

	/**
	 * @var OG_Image_Helper|Mockery\MockInterface
	 */
	protected $og_image_helper;

	/**
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter_helper;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $og_image_generator;

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
		$this->options      = Mockery::mock( Options_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->og_image_helper     = Mockery::mock( OG_Image_Helper::class );
		$this->twitter_helper      = Mockery::mock( Twitter_Image_Helper::class );

		$presentation_instance->set_helpers(
			$this->image,
			$this->options,
			$this->current_page_helper,
			$this->url_helper,
			$this->user_helper
		);

		$this->og_image_generator = Mockery::mock(
			OG_Image_Generator::class,
			[
				$this->og_image_helper,
				$this->image,
				$this->options,
				$this->url_helper,
			]
		);

		$this->twitter_image_generator = Mockery::mock(
			Twitter_Image_Generator::class,
			[
				$this->image,
				$this->url_helper,
				$this->twitter_helper,
			]
		);

		$presentation_instance->set_generators(
			Mockery::mock( Schema_Generator::class ),
			new OG_Locale_Generator(),
			$this->og_image_generator,
			$this->twitter_image_generator,
			Mockery::mock( Breadcrumbs_Generator::class )
		);
	}
}
