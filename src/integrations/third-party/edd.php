<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * EDD integration.
 */
class EDD implements Integration_Interface {

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, EDD_Conditional::class ];
	}

	/**
	 * EDD constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 *
	 * @param Meta_Surface $meta The meta surface.
	 */
	public function __construct( Meta_Surface $meta ) {
		$this->meta = $meta;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'edd_generate_download_structured_data', [ $this, 'filter_download_schema' ] );
		\add_filter( 'wpseo_schema_organization', [ $this, 'filter_organization_schema' ] );
		\add_filter( 'wpseo_schema_webpage', [ $this, 'filter_webpage_schema' ], 10, 2 );
	}

	/**
	 * Make sure the Organization is classified as a Brand too.
	 *
	 * @param array $data The organization schema.
	 *
	 * @return array
	 */
	public function filter_organization_schema( $data ) {
		if ( \is_singular( 'download' ) ) {
			$data['@type'] = [ 'Organization', 'Brand' ];
		}

		return $data;
	}

	/**
	 * Make sure the WebPage schema contains reference to the product.
	 *
	 * @param array                 $data    The schema Webpage data.
	 * @param \WPSEO_Schema_Context $context Context object.
	 *
	 * @return array
	 */
	public function filter_webpage_schema( $data, $context ) {
		if ( \is_singular( [ 'download' ] ) ) {
			$data['about']      = [ '@id' => $context->canonical . '#/schema/edd-product/' . \get_the_ID() ];
			$data['mainEntity'] = [ '@id' => $context->canonical . '#/schema/edd-product/' . \get_the_ID() ];
		}

		return $data;
	}

	/**
	 * Filter the structured data output for a download to tie into Yoast SEO's output.
	 *
	 * @param array $data Structured data for a download.
	 *
	 * @return array
	 */
	public function filter_download_schema( $data ) {
		$data['@id']    = $this->meta->for_current_page()->canonical . '#/schema/edd-product/' . \get_the_ID();
		$data['sku']    = (string) $data['sku'];
		$data['brand']  = $this->return_organization_node();
		$data['offers'] = $this->clean_up_offer( $data['offers'] );

		if ( ! isset( $data['description'] ) ) {
			$data['description'] = $this->meta->for_current_page()->open_graph_description;
		}

		return $data;
	}

	/**
	 * Cleans up EDD generated Offers.
	 *
	 * @param array $offer The schema array.
	 *
	 * @return array
	 */
	private function clean_up_offer( $offer ) {
		if ( array_key_exists( 'priceValidUntil', $offer ) && $offer['priceValidUntil'] === null ) {
			unset( $offer['priceValidUntil'] );
		}
		$offer['seller'] = $this->return_organization_node();

		return $offer;
	}

	/**
	 * Returns a Schema node for the current site's Organization.
	 *
	 * @return string[]
	 */
	private function return_organization_node() {
		return [
			'@type' => [ 'Organization', 'Brand' ],
			'@id'   => $this->meta->for_home_page()->canonical . '#organization',
		];
	}
}
