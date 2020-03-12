<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Generators\Generator_Interface;

/**
 * Class Abstract_Schema_Piece
 */
abstract class Abstract_Schema_Piece implements Generator_Interface {

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	protected $id;

	/**
	 * Sets the ID helper.
	 *
	 * @required
	 *
	 * @param ID_Helper $id A helper to retrieve Schema ID's.
	 */
	public function set_id_helper( ID_Helper $id ) {
		$this->id = $id;
	}

	/**
	 * Generates the schema piece.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return mixed
	 */
	abstract public function generate( Meta_Tags_Context $context );

	/**
	 * Determines whether the schema piece is needed.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	abstract public function is_needed( Meta_Tags_Context $context );
}
