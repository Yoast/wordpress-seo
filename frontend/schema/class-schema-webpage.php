<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema WebPage data.
 *
 * @since 10.2
 */
class WPSEO_Schema_WebPage implements WPSEO_Graph_Piece {

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
		$this->date    = new WPSEO_Date_Helper();
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( is_404() ) {
			return false;
		}

		return true;
	}

	/**
	 * Returns WebPage schema data.
	 *
	 * @return array WebPage schema data.
	 */
	public function generate() {
		$data = [
			'@type'    => $this->determine_page_type(),
			'@id'      => $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH,
			'url'      => $this->context->canonical,
			'name'     => $this->context->title,
			'isPartOf' => [
				'@id' => $this->context->site_url . WPSEO_Schema_IDs::WEBSITE_HASH,
			],
		];

		$data = WPSEO_Schema_Utils::add_piece_language( $data );

		if ( is_front_page() ) {
			if ( $this->context->site_represents_reference ) {
				$data['about'] = $this->context->site_represents_reference;
			}
		}

		if ( is_singular() ) {
			$this->add_image( $data );

			$post                  = get_post( $this->context->id );
			$data['datePublished'] = $this->date->format( $post->post_date_gmt );
			$data['dateModified']  = $this->date->format( $post->post_modified_gmt );

			if ( get_post_type( $post ) === 'post' ) {
				$data = $this->add_author( $data, $post );
			}
		}

		if ( ! empty( $this->context->description ) ) {
			$data['description'] = strip_tags( $this->context->description, '<h1><h2><h3><h4><h5><h6><br><ol><ul><li><a><p><b><strong><i><em>' );
		}

		if ( $this->add_breadcrumbs() ) {
			$data['breadcrumb'] = [
				'@id' => $this->context->canonical . WPSEO_Schema_IDs::BREADCRUMB_HASH,
			];
		}

		$data = $this->add_potential_action( $data );

		return $data;
	}

	/**
	 * Adds an author property to the $data if the WebPage is not represented.
	 *
	 * @param array   $data The WebPage schema.
	 * @param WP_Post $post The post the context is representing.
	 *
	 * @return array The WebPage schema.
	 */
	public function add_author( $data, $post ) {
		if ( $this->context->site_represents === false ) {
			$data['author'] = [ '@id' => WPSEO_Schema_Utils::get_user_schema_id( $post->post_author, $this->context ) ];
		}
		return $data;
	}

	/**
	 * If we have an image, make it the primary image of the page.
	 *
	 * @param array $data WebPage schema data.
	 */
	public function add_image( &$data ) {
		if ( $this->context->has_image ) {
			$data['primaryImageOfPage'] = [ '@id' => $this->context->canonical . WPSEO_Schema_IDs::PRIMARY_IMAGE_HASH ];
		}
	}

	/**
	 * Determine if we should add a breadcrumb attribute.
	 *
	 * @return bool
	 */
	private function add_breadcrumbs() {
		if ( is_front_page() ) {
			return false;
		}

		if ( $this->context->breadcrumbs_enabled ) {
			return true;
		}

		return false;
	}

	/**
	 * Determine the page type for the current page.
	 *
	 * @return string
	 */
	private function determine_page_type() {
		switch ( true ) {
			case is_search():
				$type = 'SearchResultsPage';
				break;
			case is_author():
				$type = 'ProfilePage';
				break;
			case WPSEO_Frontend_Page_Type::is_posts_page():
			case WPSEO_Frontend_Page_Type::is_home_posts_page():
			case is_archive():
				$type = 'CollectionPage';
				break;
			default:
				$type = 'WebPage';
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string $type The WebPage type.
		 */
		return apply_filters( 'wpseo_schema_webpage_type', $type );
	}

	/**
	 * Adds the potential action JSON LD code to a WebPage Schema piece.
	 *
	 * @param array $data The WebPage data array.
	 *
	 * @return array $data
	 */
	private function add_potential_action( $data ) {
		if ( $this->determine_page_type() !== 'WebPage' ) {
			return $data;
		}

		/**
		 * Filter: 'wpseo_schema_webpage_potential_action_target' - Allows filtering of the schema WebPage potentialAction target.
		 *
		 * @api array $targets The URLs for the WebPage potentialAction target.
		 */
		$targets = apply_filters( 'wpseo_schema_webpage_potential_action_target', [ $this->context->canonical ] );

		$data['potentialAction'][] = [
			'@type'  => 'ReadAction',
			'target' => $targets,
		];

		return $data;
	}
}
