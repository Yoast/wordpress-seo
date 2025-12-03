<?php

namespace Yoast\WP\SEO\Presenters;

use WPSEO_Utils;
use Yoast\WP\SEO\Helpers\Schema_Helper;

/**
 * Presenter class for the schema object.
 */
class Schema_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Holds the Schema_Helper.
	 *
	 * @var Schema_Helper
	 */
	protected $schema_helper;
	/**
	 * Constructor.
	 *
	 * @param Schema_Helper $schema_helper The schema helper.
	 */
	public function __construct( Schema_Helper $schema_helper ) {
		$this->schema_helper = $schema_helper;
	}

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'schema';

	/**
	 * Returns the schema output.
	 *
	 * @return string The schema tag.
	 */
	public function present() {
		$return = $this->schema_helper->get_filtered_schema_output();
		if ( $return === [] || $return === false ) {
			return '';
		}

		/**
		 * Action: 'wpseo_json_ld' - Output Schema before the main schema from Yoast SEO is output.
		 */
		\do_action( 'wpseo_json_ld' );

		$schema = $this->get();
		if ( \is_array( $schema ) ) {
			$output = WPSEO_Utils::format_json_encode( $schema );
			$output = \str_replace( "\n", \PHP_EOL . "\t", $output );
			return '<script type="application/ld+json" class="yoast-schema-graph">' . $output . '</script>';
		}

		return '';
	}

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return array The raw value.
	 */
	public function get() {
		return $this->presentation->schema;
	}
}
