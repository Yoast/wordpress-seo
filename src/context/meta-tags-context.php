<?php

namespace Yoast\WP\SEO\Context;

use WP_Block_Parser_Block;
use WP_Post;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Abstract_Presentation;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Values\Schema\Image;

/**
 * Class Meta_Tags_Context.
 *
 * Class that contains all relevant data for rendering the meta tags.
 *
 * @property string       $canonical
 * @property string       $permalink
 * @property string       $title
 * @property string       $description
 * @property string       $id
 * @property string       $site_name
 * @property string       $wordpress_site_name
 * @property string       $site_url
 * @property string       $company_name
 * @property int          $company_logo_id
 * @property array        $company_logo_meta
 * @property int          $person_logo_id
 * @property array        $person_logo_meta
 * @property int          $site_user_id
 * @property string       $site_represents
 * @property array|false  $site_represents_reference
 * @property string       schema_page_type
 * @property string       $main_schema_id
 * @property string|array $main_entity_of_page
 * @property bool         $open_graph_enabled
 * @property string       $open_graph_publisher
 * @property string       $twitter_card
 * @property string       $page_type
 * @property bool         $has_article
 * @property bool         $has_image
 * @property int          $main_image_id
 * @property string       $main_image_url
 * @property Image[]      $images
 * @property int|null     $home_page_id
 * @property int          $current_page
 * @property int          $posts_per_page
 */
class Meta_Tags_Context extends Abstract_Presentation {

	/**
	 * The indexable.
	 *
	 * @var Indexable
	 */
	public $indexable;

	/**
	 * The WP Block Parser Block.
	 *
	 * @var WP_Block_Parser_Block[]
	 */
	public $blocks;

	/**
	 * The WP Post.
	 *
	 * @var WP_Post
	 */
	public $post;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	public $presentation;

	/**
	 * Determines whether we have an Article piece. Set to true by the Article piece itself.
	 *
	 * @var bool
	 */
	public $has_article = false;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The site helper.
	 *
	 * @var Site_Helper
	 */
	private $site;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user;

	/**
	 * The permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	private $permalink_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The pagination helper.
	 *
	 * @var Pagination_Helper
	 */
	private $pagination_helper;

	/**
	 * Meta_Tags_Context constructor.
	 *
	 * @param Options_Helper       $options              The options helper.
	 * @param Url_Helper           $url                  The url helper.
	 * @param Image_Helper         $image                The image helper.
	 * @param ID_Helper            $id_helper            The schema id helper.
	 * @param WPSEO_Replace_Vars   $replace_vars         The replace vars helper.
	 * @param Site_Helper          $site                 The site helper.
	 * @param User_Helper          $user                 The user helper.
	 * @param Permalink_Helper     $permalink_helper     The permalink helper.
	 * @param Indexable_Helper     $indexable_helper     The indexable helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Pagination_Helper    $pagination_helper    The pagination helper.
	 */
	public function __construct(
		Options_Helper $options,
		Url_Helper $url,
		Image_Helper $image,
		ID_Helper $id_helper,
		WPSEO_Replace_Vars $replace_vars,
		Site_Helper $site,
		User_Helper $user,
		Permalink_Helper $permalink_helper,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository,
		Pagination_Helper $pagination_helper
	) {
		$this->options              = $options;
		$this->url                  = $url;
		$this->image                = $image;
		$this->id_helper            = $id_helper;
		$this->replace_vars         = $replace_vars;
		$this->site                 = $site;
		$this->user                 = $user;
		$this->permalink_helper     = $permalink_helper;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
		$this->pagination_helper    = $pagination_helper;
	}

	/**
	 * Generates the title.
	 *
	 * @return string the title
	 */
	public function generate_title() {
		return $this->replace_vars->replace( $this->presentation->title, $this->presentation->source );
	}

	/**
	 * Generates the description.
	 *
	 * @return string the description
	 */
	public function generate_description() {
		return $this->replace_vars->replace( $this->presentation->meta_description, $this->presentation->source );
	}

	/**
	 * Generates the images.
	 *
	 * @return Image[] the images.
	 */
	public function generate_images() {
		if ( $this->post instanceof WP_Post === false ) {
			return [];
		}

		return $this->image->get_images_from_post_content( $this->post->post_content );
	}

	/**
	 * Generates the canonical.
	 *
	 * @return string the canonical
	 */
	public function generate_canonical() {
		return $this->presentation->canonical;
	}

	/**
	 * Generates the permalink.
	 *
	 * @return string
	 */
	public function generate_permalink() {
		if ( ! \is_search() ) {
			return $this->presentation->permalink;
		}

		return \add_query_arg( 's', \get_search_query(), \trailingslashit( $this->site_url ) );
	}

	/**
	 * Generates the id.
	 *
	 * @return string the id
	 */
	public function generate_id() {
		return $this->indexable->object_id;
	}

	/**
	 * Generates the site name.
	 *
	 * @return string The site name.
	 */
	public function generate_site_name() {
		$site_name = $this->options->get( 'website_name', '' );
		if ( $site_name !== '' ) {
			return $site_name;
		}

		return \get_bloginfo( 'name' );
	}

	/**
	 * Generates the site name from the WordPress options.
	 *
	 * @return string The site name from the WordPress options.
	 */
	public function generate_wordpress_site_name() {
		return $this->site->get_site_name();
	}

	/**
	 * Generates the site url.
	 *
	 * @return string The site url.
	 */
	public function generate_site_url() {
		$home_page_indexable = $this->indexable_repository->find_for_home_page();

		if ( $this->indexable_helper->dynamic_permalinks_enabled() ) {
			return \trailingslashit( $this->permalink_helper->get_permalink_for_indexable( $home_page_indexable ) );
		}

		return \trailingslashit( $home_page_indexable->permalink );
	}

	/**
	 * Generates the company name.
	 *
	 * @return string The company name.
	 */
	public function generate_company_name() {
		/**
		 * Filter: 'wpseo_schema_company_name' - Allows filtering company name
		 *
		 * @api string $company_name.
		 */
		$company_name = \apply_filters( 'wpseo_schema_company_name', $this->options->get( 'company_name' ) );

		if ( empty( $company_name ) ) {
			$company_name = $this->site_name;
		}

		return $company_name;
	}

	/**
	 * Generates the person logo id.
	 *
	 * @return int|bool The company logo id.
	 */
	public function generate_person_logo_id() {
		$person_logo_id = $this->image->get_attachment_id_from_settings( 'person_logo' );

		if ( empty( $person_logo_id ) ) {
			$person_logo_id = $this->fallback_to_site_logo();
		}

		/**
		 * Filter: 'wpseo_schema_person_logo_id' - Allows filtering person logo id.
		 *
		 * @api integer $person_logo_id.
		 */
		return \apply_filters( 'wpseo_schema_person_logo_id', $person_logo_id );
	}

	/**
	 * Retrieve the person logo meta.
	 *
	 * @return array|bool
	 */
	public function generate_person_logo_meta() {
		$person_logo_meta = $this->image->get_attachment_meta_from_settings( 'person_logo' );

		if ( empty( $person_logo_meta ) ) {
			$person_logo_id   = $this->fallback_to_site_logo();
			$person_logo_meta = $this->image->get_best_attachment_variation( $person_logo_id );
		}

		/**
		 * Filter: 'wpseo_schema_person_logo_meta' - Allows filtering person logo meta.
		 *
		 * @api string $person_logo_meta.
		 */
		return \apply_filters( 'wpseo_schema_person_logo_meta', $person_logo_meta );
	}

	/**
	 * Generates the company logo id.
	 *
	 * @return int|bool The company logo id.
	 */
	public function generate_company_logo_id() {
		$company_logo_id = $this->image->get_attachment_id_from_settings( 'company_logo' );

		if ( empty( $company_logo_id ) ) {
			$company_logo_id = $this->fallback_to_site_logo();
		}

		/**
		 * Filter: 'wpseo_schema_company_logo_id' - Allows filtering company logo id.
		 *
		 * @api integer $company_logo_id.
		 */
		return \apply_filters( 'wpseo_schema_company_logo_id', $company_logo_id );
	}

	/**
	 * Retrieve the company logo meta.
	 *
	 * @return array|bool
	 */
	public function generate_company_logo_meta() {
		$company_logo_meta = $this->image->get_attachment_meta_from_settings( 'company_logo' );

		/**
		 * Filter: 'wpseo_schema_company_logo_meta' - Allows filtering company logo meta.
		 *
		 * @api string $company_logo_meta.
		 */
		return \apply_filters( 'wpseo_schema_company_logo_meta', $company_logo_meta );
	}

	/**
	 * Generates the site user id.
	 *
	 * @return int The site user id.
	 */
	public function generate_site_user_id() {
		return (int) $this->options->get( 'company_or_person_user_id', false );
	}

	/**
	 * Determines what our site represents, and grabs their values.
	 *
	 * @return string|false Person or company. False if invalid value.
	 */
	public function generate_site_represents() {
		switch ( $this->options->get( 'company_or_person', false ) ) {
			case 'company':
				// Do not use a non-named company.
				if ( empty( $this->company_name ) ) {
					return false;
				}

				/*
				 * Do not use a company without a logo.
				 * The logic check is on `< 1` instead of `false` due to how `get_attachment_id_from_settings` works.
				 */
				if ( $this->company_logo_id < 1 ) {
					return false;
				}

				return 'company';
			case 'person':
				// Do not use a non-existing user.
				if ( $this->site_user_id !== false && \get_user_by( 'id', $this->site_user_id ) === false ) {
					return false;
				}

				return 'person';
		}

		return false;
	}

	/**
	 * Returns the site represents reference.
	 *
	 * @return array|bool The site represents reference. False if none.
	 */
	public function generate_site_represents_reference() {
		if ( $this->site_represents === 'person' ) {
			return [ '@id' => $this->id_helper->get_user_schema_id( $this->site_user_id, $this ) ];
		}
		if ( $this->site_represents === 'company' ) {
			return [ '@id' => $this->site_url . Schema_IDs::ORGANIZATION_HASH ];
		}

		return false;
	}

	/**
	 * Returns whether or not open graph is enabled.
	 *
	 * @return bool Whether or not open graph is enabled.
	 */
	public function generate_open_graph_enabled() {
		return $this->options->get( 'opengraph' ) === true;
	}

	/**
	 * Returns the open graph publisher.
	 *
	 * @return string The open graph publisher.
	 */
	public function generate_open_graph_publisher() {
		if ( $this->site_represents === 'company' ) {
			return $this->options->get( 'facebook_site', '' );
		}
		if ( $this->site_represents === 'person' ) {
			return $this->user->get_the_author_meta( 'facebook', $this->site_user_id );
		}

		return $this->options->get( 'facebook_site', '' );
	}

	/**
	 * Returns the twitter card type.
	 *
	 * @return string The twitter card type.
	 */
	public function generate_twitter_card() {
		return 'summary_large_image';
	}

	/**
	 * Returns the schema page type.
	 *
	 * @return string|array The schema page type.
	 */
	public function generate_schema_page_type() {
		switch ( $this->indexable->object_type ) {
			case 'system-page':
				switch ( $this->indexable->object_sub_type ) {
					case 'search-result':
						$type = [ 'CollectionPage', 'SearchResultsPage' ];
						break;
					default:
						$type = 'WebPage';
				}
				break;
			case 'user':
				$type = 'ProfilePage';
				break;
			case 'home-page':
			case 'date-archive':
			case 'term':
			case 'post-type-archive':
				$type = 'CollectionPage';
				break;
			default:
				$additional_type = $this->indexable->schema_page_type;
				if ( \is_null( $additional_type ) ) {
					$additional_type = $this->options->get( 'schema-page-type-' . $this->indexable->object_sub_type );
				}

				$type = [ 'WebPage', $additional_type ];

				// Is this indexable set as a page for posts, e.g. in the WordPress reading settings as a static homepage?
				if ( (int) \get_option( 'page_for_posts' ) === $this->indexable->object_id ) {
					$type[] = 'CollectionPage';
				}

				// Ensure we get only unique values, and remove any null values and the index.
				$type = \array_filter( \array_values( \array_unique( $type ) ) );
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string|array $type The WebPage type.
		 */
		return \apply_filters( 'wpseo_schema_webpage_type', $type );
	}

	/**
	 * Returns the schema article type.
	 *
	 * @return string|array The schema article type.
	 */
	public function generate_schema_article_type() {
		$additional_type = $this->indexable->schema_article_type;
		if ( \is_null( $additional_type ) ) {
			$additional_type = $this->options->get( 'schema-article-type-' . $this->indexable->object_sub_type );
		}

		/** This filter is documented in inc/options/class-wpseo-option-titles.php */
		$allowed_article_types = \apply_filters( 'wpseo_schema_article_types', Schema_Types::ARTICLE_TYPES );

		if ( ! \array_key_exists( $additional_type, $allowed_article_types ) ) {
			$additional_type = $this->options->get_title_default( 'schema-article-type-' . $this->indexable->object_sub_type );
		}

		// If the additional type is a subtype of Article, we're fine, and we can bail here.
		if ( \stripos( $additional_type, 'Article' ) !== false ) {
			/**
			 * Filter: 'wpseo_schema_article_type' - Allow changing the Article type.
			 *
			 * @param string|string[] $type      The Article type.
			 * @param Indexable       $indexable The indexable.
			 */
			return \apply_filters( 'wpseo_schema_article_type', $additional_type, $this->indexable );
		}

		$type = 'Article';

		/*
		 * If `None` is set (either on the indexable or as a default), set type to 'None'.
		 * This simplifies is_needed checks downstream.
		 */
		if ( $additional_type === 'None' ) {
			$type = $additional_type;
		}

		if ( $additional_type !== $type ) {
			$type = [ $type, $additional_type ];
		}

		// Filter documented on line 499 above.
		return \apply_filters( 'wpseo_schema_article_type', $type, $this->indexable );
	}

	/**
	 * Returns the main schema id.
	 *
	 * The main schema id.
	 *
	 * @return string
	 */
	public function generate_main_schema_id() {
		return $this->permalink;
	}

	/**
	 * Retrieves the main image URL. This is the featured image by default.
	 *
	 * @return string|null The main image URL.
	 */
	public function generate_main_image_url() {
		if ( $this->main_image_id !== null ) {
			return $this->image->get_attachment_image_url( $this->main_image_id, 'full' );
		}

		if ( ! \is_singular() ) {
			return null;
		}

		if ( count( $this->images ) === 0 ) {
			return null;
		}

		return $this->images[0]->get_src();
	}

	/**
	 * Generate the ID of the home page.
	 *
	 * @return int The post ID of the post set as home page, 0 when the setting is not set (the home page shows the last messages).
	 */
	public function generate_home_page_id() {
		return \intval( \get_option( 'page_on_front' ) );
	}

	/**
	 * Generate the amount of blog posts per page set.
	 *
	 * @return int The amount of blog posts per page set.
	 */
	public function generate_posts_per_page() {
		return \intval( \get_option( 'posts_per_page' ) );
	}

	/**
	 * Generate the index of the page that is being rendered.
	 *
	 * When no page (or the first page) is being rendered, 1 is returned. This function is useful for determining which page is being rendered for archive pages.
	 *
	 * @return int The index of the page being rendered, 1 when no page is being rendered or the first page is being rendered.
	 */
	public function generate_current_page() {
		return $this->pagination_helper->get_current_page_number();
	}

	/**
	 * Get the image for the first post that has an image in the current archive.
	 *
	 * @param array $args Arguments for get_posts.
	 *
	 * @return int|null The post ID of the first attachment found in the archive of posts, null if no attachment was found.
	 */
	private function get_image_for_first_post_in_archive( $args = [] ) {
		$default = [
			'paged'          => $this->current_page,
			'posts_per_page' => $this->posts_per_page,
		];

		$args  = \array_merge( $default, $args );
		$posts = \get_posts( $args );

		foreach ( $posts as $post ) {
			$image_for_post = $this->get_main_image_for_post( $post->ID );
			if ( ! \is_null( $image_for_post ) ) {
				return $image_for_post;
			}
		}
		return null;
	}

	/**
	 * Get the main image for the home page.
	 *
	 * Uses the main image from the post when a static homepage is set, otherwise used the first image of the post found in the post archive.
	 *
	 * @return int|null The post ID of the main image for the home page, null otherwise.
	 */
	private function get_main_image_for_home_page() {
		if ( $this->home_page_id !== 0 ) {
			return $this->get_main_image_for_post( $this->home_page_id );
		}

		return $this->get_image_for_first_post_in_archive();
	}

	/**
	 * Get the main image for a post.
	 *
	 * @param int $post_id The post id of the post for which to get the main image.
	 *
	 * @return int|null The main image ID for a post when it exists, null otherwise.
	 */
	private function get_main_image_for_post( $post_id ) {
		if ( \has_post_thumbnail( $post_id ) ) {
			$thumbnail_id = \get_post_thumbnail_id( $post_id );
			// Prevent returning something else than an int or null.
			if ( \is_int( $thumbnail_id ) && $thumbnail_id > 0 ) {
				return $thumbnail_id;
			}
		}

		$post = \get_post( $post_id );
		if ( ! \is_null( $post ) ) {
			$post_images = $this->image->get_images_from_post_content( $post->post_content );
			foreach ( $post_images as $post_image ) {
				if ( $post_image->has_id() ) {
					return $post_image->get_id();
				}
			}
		}
		return null;
	}

	/**
	 * Get the main image ID for a post or an attachment (depending on object_sub_type).
	 *
	 * @return int|null The main image ID for a post or attachment when it exists, null otherwise.
	 */
	private function get_main_image_for_post_or_attachment() {
		if ( $this->indexable->object_sub_type === 'attachment' ) {
			return $this->id;
		}

		return $this->get_main_image_for_post( $this->id );
	}

	/**
	 * Get the main image ID for a system page.
	 *
	 * When object_type = 'system-page', object_sub_type is either search-result or 404.
	 *
	 * @return int|null The main image ID for the system page that is being loaded.
	 */
	private function get_main_image_for_system_page() {
		if ( $this->indexable->object_sub_type !== 'search-result' ) {
			return null;
		}

		$search_query = \get_search_query();

		if ( $search_query !== '' ) {
			return $this->get_image_for_first_post_in_archive(
				[
					's' => $search_query,
				]
			);
		}

		return null;
	}

	/**
	 * Get the main image ID for a term archive page.
	 *
	 * @return int|null The main image ID for the first post found on the term archive page, null if no such image exists.
	 */
	private function get_main_image_for_term() {
		$args = [
			'tax_query' => [
				[
					'taxonomy'         => $this->indexable->object_sub_type,
					'field'            => 'term_id',
					'terms'            => $this->id,
					'include_children' => true,
				],
			],
			'post_type' => 'any',
		];
		return $this->get_image_for_first_post_in_archive( $args );
	}

	/**
	 * Get the main image for the post type archive.
	 *
	 * @return int|null The ID of the main image for the archive, null if no image for the archive exists.
	 */
	private function get_main_image_for_post_type_archive() {
		$args = [
			'post_type' => $this->indexable->object_sub_type,
		];
		return $this->get_image_for_first_post_in_archive( $args );
	}

	/**
	 * Get the main image for a date archive page.
	 *
	 * @return int|null The ID of the main image of a date archive, null if no image for the archive exists.
	 */
	private function get_main_image_for_date_archive() {
		$year = \get_query_var( 'year' );

		if ( $year === 0 ) {
			return null;
		}

		$monthnum = \get_query_var( 'monthnum' );
		$day      = \get_query_var( 'day' );
		$value    = $this->get_image_for_first_post_in_archive(
			[
				'year'     => $year,
				'monthnum' => ( $monthnum !== 0 ) ? $monthnum : null,
				'day'      => ( $day !== 0 ) ? $day : null,
			]
		);
		return $value;
	}

	/**
	 * Get the main image for an author archive page.
	 *
	 * @return int|null The ID of the main image of an author archive, null if no image for the archive exists.
	 */
	private function get_main_image_for_author_archive() {
		$author = \get_query_var( 'author' );

		if ( $author === 0 ) {
			return null;
		}

		return $this->get_image_for_first_post_in_archive(
			[
				'author' => $author,
			]
		);
	}

	/**
	 * Gets the main image ID.
	 *
	 * @return int|null The main image ID.
	 */
	public function generate_main_image_id() {
		switch ( $this->indexable->object_type ) {
			case 'post':
				return $this->get_main_image_for_post_or_attachment();
			case 'system-page':
				return $this->get_main_image_for_system_page();
			case 'home-page':
				return $this->get_main_image_for_home_page();
			case 'term':
				return $this->get_main_image_for_term();
			case 'post-type-archive':
				return $this->get_main_image_for_post_type_archive();
			case 'date-archive':
				return $this->get_main_image_for_date_archive();
			case 'user':
				return $this->get_main_image_for_author_archive();
			default:
				return null;
		}
	}

	/**
	 * Determines whether the current indexable has an image.
	 *
	 * @return bool Whether the current indexable has an image.
	 */
	public function generate_has_image() {
		return $this->main_image_url !== null;
	}

	/**
	 * Strips all nested dependencies from the debug info.
	 *
	 * @return array
	 */
	public function __debugInfo() {
		return [
			'indexable'    => $this->indexable,
			'presentation' => $this->presentation,
		];
	}

	/**
	 * Retrieve the site logo ID from WordPress settings.
	 *
	 * @return false|int
	 */
	public function fallback_to_site_logo() {
		$logo_id = \get_option( 'site_logo' );
		if ( ! $logo_id ) {
			$logo_id = \get_theme_mod( 'custom_logo', false );
		}

		return $logo_id;
	}

	/**
	 * Get the ID for a post's featured image.
	 *
	 * @param int $id Post ID.
	 *
	 * @return int|null
	 */
	private function get_singular_post_image( $id ) {
		if ( \has_post_thumbnail( $id ) ) {
			$thumbnail_id = \get_post_thumbnail_id( $id );
			// Prevent returning something else than an int or null.
			if ( \is_int( $thumbnail_id ) && $thumbnail_id > 0 ) {
				return $thumbnail_id;
			}
		}

		if ( \is_singular( 'attachment' ) ) {
			return \get_query_var( 'attachment_id' );
		}

		return null;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Generates whether or not breadcrumbs are enabled.
	 *
	 * @deprecated 15.8
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not breadcrumbs are enabled.
	 */
	public function generate_breadcrumbs_enabled() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.8' );
		$breadcrumbs_enabled = \current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$breadcrumbs_enabled = $this->options->get( 'breadcrumbs-enable', false );
		}

		if ( ! empty( $this->blocks['yoast-seo/breadcrumbs'] ) ) {
			$breadcrumbs_enabled = true;
		}

		return $breadcrumbs_enabled;
	}
}

\class_alias( Meta_Tags_Context::class, 'WPSEO_Schema_Context' );
