<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Main frontend class for Yoast SEO, responsible for the SEO output as well as removing
 * default WordPress output.
 */
class WPSEO_Frontend_Meta_Description implements WPSEO_WordPress_Integration {
	/**
	 * Holds the pages meta description.
	 *
	 * @var string
	 */
	private $metadesc = null;

	/**
	 * Holds the WooCommerce Shop page object.
	 *
	 * @var WPSEO_WooCommerce_Shop_Page
	 */
	private $woocommerce_shop_page;

	/**
	 * Holds the page type.
	 *
	 * @var WPSEO_Frontend_Page_Type
	 */
	private $frontend_page_type;

	/**
	 * WPSEO_Frontend_Meta_Description constructor.
	 */
	public function __construct() {
		$this->woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();
		$this->frontend_page_type    = new WPSEO_Frontend_Page_Type();

		$this->generate_metadesc();
	}

	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'write' ), 6 );
	}

	/**
	 * Returns the meta description text.
	 *
	 * @return string
	 */
	public function get() {
		return $this->metadesc;
	}

	/**
	 * Outputs the meta description element or returns the description text.
	 *
	 * @return void
	 */
	public function write() {
		if ( ! is_string( $this->metadesc ) || $this->metadesc === '' ) {
			if ( current_user_can( 'wpseo_manage_options' ) && is_singular() ) {
				echo '<!-- ', esc_html__( 'Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the SEO -> Search Appearance menu and set up a template.', 'wordpress-seo' ), ' -->', "\n";
			}
			return;
		}
		echo '<meta name="description" content="', esc_attr( wp_strip_all_tags( stripslashes( $this->metadesc ) ) ), '"/>', "\n";
	}

	/**
	 * Generates the meta description text.
	 */
	private function generate_metadesc() {
		global $post, $wp_query;

		$metadesc          = '';
		$metadesc_override = false;
		$post_type         = '';
		$template          = '';

		if ( is_object( $post ) && ( isset( $post->post_type ) && $post->post_type !== '' ) ) {
			$post_type = $post->post_type;
		}

		if ( $this->woocommerce_shop_page->is_shop_page() ) {
			$post      = get_post( $this->woocommerce_shop_page->get_shop_page_id() );
			$post_type = WPSEO_Utils::get_queried_post_type();

			if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type, '' ) !== '' ) {
				$template = WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type );
				$term     = $post;
			}
			$metadesc_override = WPSEO_Meta::get_value( 'metadesc', $post->ID );
		}
		elseif ( $this->frontend_page_type->is_simple_page() ) {
			$post      = get_post( $this->frontend_page_type->get_simple_page_id() );
			$post_type = $post->post_type;

			if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-' . $post_type, '' ) !== '' ) {
				$template = WPSEO_Options::get( 'metadesc-' . $post_type );
				$term     = $post;
			}
			$metadesc_override = WPSEO_Meta::get_value( 'metadesc', $post->ID );
		}
		else {
			if ( is_search() ) {
				$metadesc = '';
			}
			elseif ( WPSEO_Utils::is_home_posts_page() ) {
				$template = WPSEO_Options::get( 'metadesc-home-wpseo' );
				$term     = array();

				if ( empty( $template ) ) {
					$template = get_bloginfo( 'description' );
				}
			}
			elseif ( WPSEO_Utils::is_home_static_page() ) {
				$metadesc = WPSEO_Meta::get_value( 'metadesc' );
				if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-' . $post_type, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-' . $post_type );
				}
			}
			elseif ( is_category() || is_tag() || is_tax() ) {
				$term              = $wp_query->get_queried_object();
				$metadesc_override = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'desc' );
				if ( is_object( $term ) && isset( $term->taxonomy ) && WPSEO_Options::get( 'metadesc-tax-' . $term->taxonomy, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-tax-' . $term->taxonomy );
				}
			}
			elseif ( is_author() ) {
				$author_id = get_query_var( 'author' );
				$metadesc  = get_the_author_meta( 'wpseo_metadesc', $author_id );
				if ( ( ! is_string( $metadesc ) || $metadesc === '' ) && WPSEO_Options::get( 'metadesc-author-wpseo', '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-author-wpseo' );
				}
			}
			elseif ( is_post_type_archive() ) {
				$post_type = WPSEO_Utils::get_queried_post_type();
				if ( WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type );
				}
			}
			elseif ( is_archive() ) {
				$template = WPSEO_Options::get( 'metadesc-archive-wpseo' );
			}

			// If we're on a paginated page, and the template doesn't change for paginated pages, bail.
			if ( ( ! is_string( $metadesc ) || $metadesc === '' ) && get_query_var( 'paged' ) && get_query_var( 'paged' ) > 1 && $template !== '' ) {
				if ( strpos( $template, '%%page' ) === false ) {
					$metadesc = '';
				}
			}
		}

		$post_data = $post;

		if ( is_string( $metadesc_override ) && '' !== $metadesc_override ) {
			$metadesc = $metadesc_override;
			if ( isset( $term ) ) {
				$post_data = $term;
			}
		}
		elseif ( ( ! is_string( $metadesc ) || '' === $metadesc ) && '' !== $template ) {
			if ( ! isset( $term ) ) {
				$term = $wp_query->get_queried_object();
			}

			$metadesc  = $template;
			$post_data = $term;
		}

		$replacer = new WPSEO_Replace_Vars();

		$metadesc = $replacer->replace( $metadesc, $post_data );

		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO meta description sentence.
		 *
		 * @api string $metadesc The description sentence.
		 */
		$this->metadesc = apply_filters( 'wpseo_metadesc', trim( $metadesc ) );
	}
}