<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Locale_Generator;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Presentation
 *
 * @property string $title
 * @property string $meta_description
 * @property array  $robots
 * @property array  $bingbot
 * @property array  $googlebot
 * @property string $canonical
 * @property string $rel_next
 * @property string $rel_prev
 * @property string $open_graph_type
 * @property string $open_graph_title
 * @property string $open_graph_description
 * @property array  $open_graph_images
 * @property string $open_graph_url
 * @property string $open_graph_site_name
 * @property string $open_graph_article_publisher
 * @property string $open_graph_article_author
 * @property string $open_graph_article_published_time
 * @property string $open_graph_article_modified_time
 * @property string $open_graph_locale
 * @property string $open_graph_fb_app_id
 * @property array  $schema
 * @property string $twitter_card
 * @property string $twitter_title
 * @property string $twitter_description
 * @property string $twitter_image
 * @property string $twitter_creator
 * @property string $twitter_site
 * @property array  $source
 * @property array  $breadcrumbs
 */
class Indexable_Presentation extends Abstract_Presentation {

	/**
	 * The indexable.
	 *
	 * @var Indexable
	 */
	public $model;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	public $context;

	/**
	 * The Schema generator.
	 *
	 * @var Schema_Generator
	 */
	protected $schema_generator;

	/**
	 * The Open Graph image generator.
	 *
	 * @var Open_Graph_Image_Generator
	 */
	protected $open_graph_image_generator;

	/**
	 * The Twitter image generator.
	 *
	 * @var Twitter_Image_Generator
	 */
	protected $twitter_image_generator;

	/**
	 * The Open Graph locale generator.
	 *
	 * @var Open_Graph_Locale_Generator
	 */
	private $open_graph_locale_generator;

	/**
	 * The breadcrumbs generator.
	 *
	 * @var Breadcrumbs_Generator
	 */
	private $breadcrumbs_generator;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	protected $image;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	protected $url;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	protected $user;

	/**
	 * @required
	 *
	 * Sets the generator dependencies.
	 *
	 * @param Schema_Generator            $schema_generator            The schema generator.
	 * @param Open_Graph_Locale_Generator $open_graph_locale_generator The Open Graph locale generator.
	 * @param Open_Graph_Image_Generator  $open_graph_image_generator  The Open Graph image generator.
	 * @param Twitter_Image_Generator     $twitter_image_generator     The Twitter image generator.
	 * @param Breadcrumbs_Generator       $breadcrumbs_generator       The breadcrumbs generator.
	 */
	public function set_generators(
		Schema_Generator $schema_generator,
		Open_Graph_Locale_Generator $open_graph_locale_generator,
		Open_Graph_Image_Generator $open_graph_image_generator,
		Twitter_Image_Generator $twitter_image_generator,
		Breadcrumbs_Generator $breadcrumbs_generator
	) {
		$this->schema_generator            = $schema_generator;
		$this->open_graph_locale_generator = $open_graph_locale_generator;
		$this->open_graph_image_generator  = $open_graph_image_generator;
		$this->twitter_image_generator     = $twitter_image_generator;
		$this->breadcrumbs_generator       = $breadcrumbs_generator;
	}

	/**
	 * @required
	 *
	 * Used by dependency injection container to inject the helpers.
	 *
	 * @param Image_Helper        $image        The image helper.
	 * @param Options_Helper      $options      The options helper.
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param Url_Helper          $url          The URL helper.
	 * @param User_Helper         $user         The user helper.
	 */
	public function set_helpers(
		Image_Helper $image,
		Options_Helper $options,
		Current_Page_Helper $current_page,
		Url_Helper $url,
		User_Helper $user
	) {
		$this->image        = $image;
		$this->options      = $options;
		$this->current_page = $current_page;
		$this->url          = $url;
		$this->user         = $user;
	}

	/**
	 * Generates the title.
	 *
	 * @return string The title.
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return '';
	}

	/**
	 * Generates the meta description.
	 *
	 * @return string The meta description.
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return '';
	}

	/**
	 * Generates the robots value.
	 *
	 * @return array The robots value.
	 */
	public function generate_robots() {
		$robots = $this->get_base_robots();

		return $this->filter_robots( $robots );
	}

	/**
	 * Gets the base robots value.
	 *
	 * @return array The base robots value.
	 */
	protected function get_base_robots() {
		return [
			'index'  => ( $this->model->is_robots_noindex === true ) ? 'noindex' : 'index',
			'follow' => ( $this->model->is_robots_nofollow === true ) ? 'nofollow' : 'follow',
		];
	}

	/**
	 * Run the robots output content through the `wpseo_robots` filter.
	 *
	 * @param array $robots The meta robots values to filter.
	 *
	 * @return array The filtered meta robots values.
	 */
	protected function filter_robots( $robots ) {
		$robots_string = \implode( ', ', $robots );

		/**
		 * Filter: 'wpseo_robots' - Allows filtering of the meta robots output of Yoast SEO.
		 *
		 * @api string $robots The meta robots directives to be echoed.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		$robots_filtered = \apply_filters( 'wpseo_robots', $robots_string, $this );

		if ( \is_string( $robots_filtered ) ) {
			$robots_values = \explode( ', ', $robots_filtered );
			$robots_new    = [];

			foreach ( $robots_values as $value ) {
				$key = $value;
				if ( \strpos( $key, 'no' ) === 0 ) {
					$key = \substr( $value, 2 );
				}
				$robots_new[ $key ] = $value;
			}

			$robots = $robots_new;
		}

		if ( ! $robots_filtered ) {
			return [];
		}

		/**
		 * Filter: 'wpseo_robots_array' - Allows filtering of the meta robots output array of Yoast SEO.
		 *
		 * @api array $robots The meta robots directives to be used.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_robots_array', \array_filter( $robots ), $this );
	}

	/**
	 * Generates the robots value for the googlebot tag.
	 *
	 * @return array The robots value with opt-in snippets.
	 */
	public function generate_googlebot() {
		return $this->generate_snippet_opt_in();
	}

	/**
	 * Generates the value for the bingbot tag.
	 *
	 * @return array The robots value with opt-in snippets.
	 */
	public function generate_bingbot() {
		return $this->generate_snippet_opt_in();
	}

	/**
	 * Generates a snippet opt-in robots value.
	 *
	 * @return array The googlebot value.
	 */
	private function generate_snippet_opt_in() {
		if ( \in_array( 'noindex', $this->robots, true ) ) {
			return [];
		}

		return \array_filter( \array_merge( $this->robots, [ 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1' ] ) );
	}

	/**
	 * Generates the canonical.
	 *
	 * @return string The canonical.
	 */
	public function generate_canonical() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		if ( $this->model->permalink ) {
			return $this->model->permalink;
		}

		return '';
	}

	/**
	 * Generates the rel prev.
	 *
	 * @return string The rel prev value.
	 */
	public function generate_rel_prev() {
		return '';
	}

	/**
	 * Generates the rel next.
	 *
	 * @return string The rel prev next.
	 */
	public function generate_rel_next() {
		return '';
	}

	/**
	 * Generates the Open Graph type.
	 *
	 * @return string The Open Graph type.
	 */
	public function generate_open_graph_type() {
		return 'website';
	}

	/**
	 * Generates the open graph title.
	 *
	 * @return string The open graph title.
	 */
	public function generate_open_graph_title() {
		if ( $this->model->open_graph_title ) {
			return $this->model->open_graph_title;
		}

		return $this->title;
	}

	/**
	 * Generates the open graph description.
	 *
	 * @return string The open graph description.
	 */
	public function generate_open_graph_description() {
		if ( $this->model->open_graph_description ) {
			return $this->model->open_graph_description;
		}

		return $this->meta_description;
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_open_graph_images() {
		if ( $this->context->open_graph_enabled === false ) {
			return [];
		}

		return $this->open_graph_image_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_open_graph_url() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		return $this->model->permalink;
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_open_graph_article_publisher() {
		return '';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_open_graph_article_author() {
		return '';
	}

	/**
	 * Generates the open graph article published time.
	 *
	 * @return string The open graph article published time.
	 */
	public function generate_open_graph_article_published_time() {
		return '';
	}

	/**
	 * Generates the open graph article modified time.
	 *
	 * @return string The open graph article modified time.
	 */
	public function generate_open_graph_article_modified_time() {
		return '';
	}

	/**
	 * Generates the open graph locale.
	 *
	 * @return string The open graph locale.
	 */
	public function generate_open_graph_locale() {
		return $this->open_graph_locale_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph Facebook app ID.
	 *
	 * @return string The open graph Facebook app ID.
	 */
	public function generate_open_graph_fb_app_id() {
		return $this->options->get( 'fbadminapp', '' );
	}

	/**
	 * Generates the open graph site name.
	 *
	 * @return string The open graph site name.
	 */
	public function generate_open_graph_site_name() {
		return $this->context->wordpress_site_name;
	}

	/**
	 * Generates the Twitter card type.
	 *
	 * @return string The Twitter card type.
	 */
	public function generate_twitter_card() {
		return $this->context->twitter_card;
	}

	/**
	 * Generates the Twitter title.
	 *
	 * @return string The Twitter title.
	 */
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		if ( $this->open_graph_title && $this->context->open_graph_enabled === true ) {
			return '';
		}

		if ( $this->title ) {
			return $this->title;
		}

		return '';
	}

	/**
	 * Generates the Twitter description.
	 *
	 * @return string The Twitter description.
	 */
	public function generate_twitter_description() {
		if ( $this->model->twitter_description ) {
			return $this->model->twitter_description;
		}

		if ( $this->open_graph_description && $this->context->open_graph_enabled === true ) {
			return '';
		}

		if ( $this->meta_description ) {
			return $this->meta_description;
		}

		return '';
	}

	/**
	 * Generates the Twitter image.
	 *
	 * @return string The Twitter image.
	 */
	public function generate_twitter_image() {
		$images = $this->twitter_image_generator->generate( $this->context );
		$image  = \reset( $images );

		// When there is an image set by the user.
		if ( $image && $this->context->indexable->twitter_image_source === 'set-by-user' ) {
			return $image['url'];
		}

		// When there isn't a set image or there is a Open Graph image set.
		if ( empty( $image ) || ( $this->context->open_graph_enabled === true && $this->open_graph_images ) ) {
			return '';
		}

		return $image['url'];
	}

	/**
	 * Generates the Twitter creator.
	 *
	 * @return string The Twitter creator.
	 */
	public function generate_twitter_creator() {
		return '';
	}

	/**
	 * Generates the Twitter site.
	 *
	 * @return string The Twitter site.
	 */
	public function generate_twitter_site() {
		switch ( $this->context->site_represents ) {
			case 'person':
				$twitter = $this->user->get_the_author_meta( 'twitter', (int) $this->context->site_user_id );
				if ( empty( $twitter ) ) {
					$twitter = $this->options->get( 'twitter_site' );
				}
				break;
			case 'company':
			default:
				$twitter = $this->options->get( 'twitter_site' );
				break;
		}

		return $twitter;
	}

	/**
	 * Generates the source.
	 *
	 * @return array The source.
	 */
	public function generate_source() {
		return [];
	}

	/**
	 * Generates the schema for the page.
	 *
	 * @return array The Schema object.
	 *
	 * @codeCoverageIgnore Wrapper method.
	 */
	public function generate_schema() {
		return $this->schema_generator->generate( $this->context );
	}

	/**
	 * Generates the breadcrumbs for the page.
	 *
	 * @return array The breadcrumbs.
	 *
	 * @codeCoverageIgnore Wrapper method.
	 */
	public function generate_breadcrumbs() {
		return $this->breadcrumbs_generator->generate( $this->context );
	}

	/**
	 * Strips all nested dependencies from the debug info.
	 *
	 * @return array
	 */
	public function __debugInfo() {
		return [
			'model'   => $this->model,
			'context' => $this->context,
		];
	}
}
