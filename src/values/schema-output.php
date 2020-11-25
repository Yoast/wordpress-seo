<?php

namespace Yoast\WP\SEO\Values;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Schema_Output
 */
class Schema_Output {

	/**
	 * Represents the replace vars instance.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * Schema_Output constructor.
	 *
	 * @param WPSEO_Replace_Vars $replace_vars The replace vars.
	 */
	public function __construct( WPSEO_Replace_Vars $replace_vars ) {
		$this->replace_vars = $replace_vars;
	}

	/**
	 * Registers the schema related replace vars.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 */
	public function register_replace_vars( Meta_Tags_Context $context ) {
		WPSEO_Replace_Vars::register_replacement(
			'%%main_schema_id%%',
			static function() use ( $context ) {
				return $context->main_schema_id;
			}
		);

		WPSEO_Replace_Vars::register_replacement(
			'%%author_id%%',
			static function() use ( $context ) {
				return $context->indexable->author_id;
			}
		);
	}

	/**
	 * Replaces the variables.
	 *
	 * @param array                  $schema_data  The schema data.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return mixed
	 */
	public function replace( array $schema_data, Indexable_Presentation $presentation ) {
		foreach ( $schema_data as $key => $value ) {
			if ( \is_array( $value ) ) {
				$schema_data[ $key ] = $this->replace( $value, $presentation );

				continue;
			}

			$schema_data[ $key ] = $this->replace_vars->replace( $value, $presentation->source );
		}

		return $schema_data;
	}
}
