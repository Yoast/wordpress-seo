<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Generators\Twitter_Image_Generator;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Generators\OG_Locale_Generator;
use Yoast\WP\Free\Presentations\Generators\Schema_Generator;

/**
 * Class Indexable_Presentation
 *
 * @property string title
 * @property string meta_description
 * @property array  robots
 * @property string canonical
 * @property string rel_next
 * @property string rel_prev
 * @property string og_type
 * @property string og_title
 * @property string og_description
 * @property array  og_images
 * @property string og_url
 * @property string og_article_publisher
 * @property string og_article_author
 * @property string og_article_published_time
 * @property string og_article_modified_time
 * @property string og_locale
 * @property array  schema
 * @property string twitter_card
 * @property string twitter_title
 * @property string twitter_description
 * @property string twitter_image
 * @property string twitter_creator
 * @property string twitter_site
 * @property array  replace_vars_object
 */
class Indexable_Presentation extends Abstract_Presentation {

	/**
	 * @var Indexable
	 */
	protected $model;

	/**
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * @var Schema_Generator
	 */
	protected $schema_generator;

	/**
	 * @var OG_Image_Generator
	 */
	protected $og_image_generator;

	/**
	 * @var Twitter_Image_Generator
	 */
	protected $twitter_image_generator;

	/**
	 * @var OG_Locale_Generator
	 */
	private $og_locale_generator;

	/**
	 * @var Robots_Helper
	 */
	protected $robots_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * @var Url_Helper
	 */
	protected $url;

	/**
	 * @var User_Helper
	 */
	protected $user;

	/**
	 * @required
	 *
	 * Sets the generator dependencies.
	 *
	 * @param Schema_Generator        $schema_generator        The schema generator.
	 * @param OG_Locale_Generator     $og_locale_generator     The OG locale generator.
	 * @param OG_Image_Generator      $og_image_generator      The OG image generator.
	 * @param Twitter_Image_Generator $twitter_image_generator The Twitter image generator.
	 */
	public function set_generators(
		Schema_Generator $schema_generator,
		OG_Locale_Generator $og_locale_generator,
		OG_Image_Generator $og_image_generator,
		Twitter_Image_Generator $twitter_image_generator
	) {
		$this->schema_generator        = $schema_generator;
		$this->og_locale_generator     = $og_locale_generator;
		$this->og_image_generator      = $og_image_generator;
		$this->twitter_image_generator = $twitter_image_generator;
	}

	/**
	 * @required
	 *
	 * Used by dependency injection container to inject the Robots_Helper.
	 *
	 * @param Robots_Helper       $robots_helper       The robots helper.
	 * @param Image_Helper        $image_helper        The image helper.
	 * @param Options_Helper      $options_helper      The options helper.
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 * @param Url_Helper          $url_helper          The URL helper.
	 * @param User_Helper         $user                The user helper.
	 */
	public function set_helpers(
		Robots_Helper $robots_helper,
		Image_Helper $image_helper,
		Options_Helper $options_helper,
		Current_Page_Helper $current_page_helper,
		Url_Helper $url_helper,
		User_Helper $user
	) {
		$this->robots_helper  = $robots_helper;
		$this->image_helper   = $image_helper;
		$this->options_helper = $options_helper;
		$this->current_page   = $current_page_helper;
		$this->url            = $url_helper;
		$this->user           = $user;
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
		$robots = $this->robots_helper->get_base_values( $this->model );

		return $this->robots_helper->after_generate( $robots );
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
	 * Generates the og type.
	 *
	 * @return string The og type.
	 */
	public function generate_og_type() {
		return 'website';
	}

	/**
	 * Generates the open graph title.
	 *
	 * @return string The open graph title.
	 */
	public function generate_og_title() {
		if ( $this->model->og_title ) {
			return $this->model->og_title;
		}

		return $this->title;
	}

	/**
	 * Generates the open graph description.
	 *
	 * @return string The open graph description.
	 */
	public function generate_og_description() {
		if ( $this->model->og_description ) {
			return $this->model->og_description;
		}

		return $this->meta_description;
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( $this->context->open_graph_enabled === false ) {
			return [];
		}

		return $this->og_image_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_og_url() {
		return $this->canonical;
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_og_article_publisher() {
		return '';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_og_article_author() {
		return '';
	}

	/**
	 * Generates the open graph article published time.
	 *
	 * @return string The open graph article published time.
	 */
	public function generate_og_article_published_time() {
		return '';
	}

	/**
	 * Generates the open graph article modified time.
	 *
	 * @return string The open graph article modified time.
	 */
	public function generate_og_article_modified_time() {
		return '';
	}

	/**
	 * Generates the open graph locale.
	 *
	 * @return string The open graph locale.
	 */
	public function generate_og_locale() {
		return $this->og_locale_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph site name.
	 *
	 * @return string The open graph site name.
	 */
	public function generate_og_site_name() {
		return $this->context->wordpress_site_name;
	}

	/**
	 * Generates the Twitter card type.
	 *
	 * @return string The Twitter card type.
	 */
	public function generate_twitter_card() {
		return '';
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

		if ( $this->model->og_title && $this->context->open_graph_enabled === true ) {
			return $this->model->og_title;
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

		if ( $this->model->og_description && $this->context->open_graph_enabled === true ) {
			return $this->model->og_description;
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
		if ( empty( $images ) && $this->context->open_graph_enabled === true ) {
			$images = $this->og_images;
		}

		if ( empty( $images ) ) {
			return '';
		}

		$image = \reset( $images );

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
			case 'person' :
				$twitter = $this->user->get_the_author_meta( 'twitter', (int) $this->context->site_user_id );
				if ( empty( $twitter ) ) {
					$twitter = $this->options_helper->get( 'twitter_site' );
				}
				break;
			case 'company' :
			default:
				$twitter = $this->options_helper->get( 'twitter_site' );
				break;
		}

		return $twitter;
	}

	/**
	 * Generates the replace vars object.
	 *
	 * @return array The replace vars object.
	 */
	public function generate_replace_vars_object() {
		return [];
	}

	/**
	 * Generates the schema for the page.
	 *
	 * @return array The Schema object.
	 */
	public function generate_schema() {
		return $this->schema_generator->generate( $this->context );
	}
}
