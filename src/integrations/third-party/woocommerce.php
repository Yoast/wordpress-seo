<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class WooCommerce
 */
class WooCommerce implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ WooCommerce_Conditional::class, Front_End_Conditional::class ];
	}

	/**
	 * WooCommerce constructor.
	 *
	 * @param Options_Helper             $options          The options helper.
	 * @param WPSEO_Replace_Vars         $replace_vars     The replace vars helper.
	 * @param Meta_Tags_Context_Memoizer $context_memoizer The meta tags context memoizer.
	 * @param Indexable_Repository       $repository       The indexable repository.
	 */
	public function __construct(
		Options_Helper $options,
		WPSEO_Replace_Vars $replace_vars,
		Meta_Tags_Context_Memoizer $context_memoizer,
		Indexable_Repository $repository
	) {
		$this->options          = $options;
		$this->replace_vars     = $replace_vars;
		$this->context_memoizer = $context_memoizer;
		$this->repository       = $repository;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_frontend_page_type_simple_page_id', [ $this, 'get_page_id' ] );
		\add_filter( 'wpseo_title', [ $this, 'title' ], 10, 2 );
		\add_filter( 'wpseo_metadesc', [ $this, 'description' ], 10, 2 );
		\add_filter( 'wpseo_breadcrumb_indexables', [ $this, 'add_shop_to_breadcrumbs' ] );
	}

	/**
	 * Adds a breadcrumb for the shop page.
	 *
	 * @param Indexable[] $indexables The array with indexables.
	 *
	 * @return Indexable[] The indexables to be shown in the breadcrumbs, with the shop page added.
	 */
	public function add_shop_to_breadcrumbs( $indexables ) {
		$shop_page_id = $this->get_shop_page_id();

		if ( $shop_page_id < 1 ) {
			return $indexables;
		}

		foreach ( $indexables as $index => $indexable ) {
			if ( $indexable->object_type === 'post-type-archive' && $indexable->object_sub_type === 'product' ) {
				$indexables[ $index ] = $this->repository->find_by_id_and_type( $shop_page_id, 'post' );
			}
		}

		return $indexables;
	}

	/**
	 * Returns the ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		if ( ! $this->is_shop_page() ) {
			return $page_id;
		}

		return $this->get_shop_page_id();
	}

	/**
	 * Handles the title.
	 *
	 * @param string                 $title        The title.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The title to use.
	 */
	public function title( $title, $presentation = null ) {
		$presentation = $this->ensure_presentation( $presentation );

		if ( $presentation->model->title ) {
			return $title;
		}

		if ( ! $this->is_shop_page() ) {
			return $title;
		}

		if ( ! \is_archive() ) {
			return $title;
		}

		$shop_page_id = $this->get_shop_page_id();
		if ( $shop_page_id < 1 ) {
			return $title;
		}

		$product_template_title = $this->get_product_template( 'title-product', $shop_page_id );
		if ( $product_template_title ) {
			return $product_template_title;
		}

		return $title;
	}

	/**
	 * Handles the meta description.
	 *
	 * @param string                 $description  The title.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The description to use.
	 */
	public function description( $description, $presentation = null ) {
		$presentation = $this->ensure_presentation( $presentation );

		if ( $presentation->model->description ) {
			return $description;
		}

		if ( ! $this->is_shop_page() ) {
			return $description;
		}

		if ( ! \is_archive() ) {
			return $description;
		}

		$shop_page_id = $this->get_shop_page_id();
		if ( $shop_page_id < 1 ) {
			return $description;
		}

		$product_template_description = $this->get_product_template( 'metadesc-product', $shop_page_id );
		if ( $product_template_description ) {
			return $product_template_description;
		}

		return $description;
	}

	/**
	 * Checks if the current page is a WooCommerce shop page.
	 *
	 * @return bool True when the page is a shop page.
	 */
	protected function is_shop_page() {
		if ( ! \is_shop() ) {
			return false;
		}

		if ( \is_search() ) {
			return false;
		}

		return true;
	}

	/**
	 * Uses template for the given option name and replace the replacement variables on it.
	 *
	 * @param string $option_name  The option name to get the template for.
	 * @param string $shop_page_id The page id to retrieve template for.
	 *
	 * @return string The rendered value.
	 */
	protected function get_product_template( $option_name, $shop_page_id ) {
		$template = $this->options->get( $option_name );
		$page     = \get_post( $shop_page_id );

		return $this->replace_vars->replace( $template, $page );
	}

	/**
	 * Returns the id of the set WooCommerce shop page.
	 *
	 * @return int The ID of the set page.
	 */
	protected function get_shop_page_id() {
		if ( ! \function_exists( 'wc_get_page_id' ) ) {
			return -1;
		}

		return \wc_get_page_id( 'shop' );
	}

	/**
	 * Ensures a presentation is available.
	 *
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return Indexable_Presentation The presentation, taken from the current page if the input was invalid.
	 */
	protected function ensure_presentation( $presentation ) {
		if ( \is_a( $presentation, Indexable_Presentation::class ) ) {
			return $presentation;
		}

		$context = $this->context_memoizer->for_current_page();

		return $context->presentation;
	}
}
