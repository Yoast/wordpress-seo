<?php
/**
 * Presentation object for indexables.
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Models\Indexable;

/**
 * Class Indexable_Presentation
 *
 * @property string title
 * @property string meta_description
 * @property array  robots
 * @property string canonical
 * @property string og_type
 * @property string og_title
 * @property string og_description
 * @property array  og_images
 * @property string og_url
 * @property string og_article_publisher
 * @property string og_article_author
 * @property string og_article_publish_time
 * @property string og_article_modified_time
 * @property string twitter_card
 * @property string twitter_title
 * @property string twitter_description
 * @property string twitter_image
 * @property array  replace_vars_object
 */
class Indexable_Presentation extends Abstract_Presentation {

	/**
	 * @var Indexable
	 */
	protected $model;

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
		$robots = [
			'index'        => ( $this->model->is_robots_noindex === '1' ) ? 'noindex' : 'index',
			'follow'       => ( $this->model->is_robots_nofollow === '1' ) ? 'nofollow' : 'follow',
			'noimageindex' => ( $this->model->is_robots_noimageindex === '1' ) ? 'noimageindex' : null,
			'noarchive'    => ( $this->model->is_robots_noarchive === '1' ) ? 'noarchive' : null,
			'nosnippet'    => ( $this->model->is_robots_nosnippet === '1' ) ? 'nosnippet' : null,
		];

		// The option `blog_public` is set in Settings > Reading > Search Engine Visibility.
		if ( (string) \get_option( 'blog_public' ) === '0' ) {
			$robots['index'] = 'noindex';
		};

		// Remove null values.
		$robots = array_filter( $robots );

		// If robots index and follow are set, they can be excluded because they are default values.
		if ( $robots['index'] === 'index' && $robots['follow'] === 'follow' ) {
			unset( $robots['index'] );
			unset( $robots['follow'] );
		}

		return $robots;
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
		if ( $this->model->og_image ) {
			return [ $this->model->og_image ];
		}

		return [];
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
	 * Generates the open graph article publish time.
	 *
	 * @return string The open graph article publish time.
	 */
	public function generate_og_article_publish_time() {
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
	 * Generates the twitter card type.
	 *
	 * @return string The twitter card type.
	 */
	public function generate_twitter_card() {
		return '';
	}

	/**
	 * Generates the twitter title.
	 *
	 * @return string The twitter title.
	 */
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		return '';
	}

	/**
	 * Generates the twitter description.
	 *
	 * @return string The twitter description.
	 */
	public function generate_twitter_description() {
		if ( $this->model->twitter_description ) {
			return $this->model->twitter_description;
		}

		return '';
	}

	/**
	 * Generates the twitter image.
	 *
	 * @return string The twitter image.
	 */
	public function generate_twitter_image() {
		if ( $this->model->twitter_image ) {
			return $this->model->twitter_image;
		}

		return '';
	}

	/**
	 * Generates the replace vars object.
	 *
	 * @return array The replace vars object.
	 */
	public function generate_replace_vars_object() {
		return [];
	}
}
