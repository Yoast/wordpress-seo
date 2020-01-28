<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Generators\Generator_Interface;

/**
 * Class Abstract_Schema_Piece
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */
abstract class Abstract_Schema_Piece implements Generator_Interface {

	/**
	 * @var ID_Helper
	 */
	protected $id_helper;

	/**
	 * @required
	 *
	 * Sets the ID helper.
	 *
	 * @param ID_Helper $id_helper A helper to retrieve Schema ID's.
	 */
	public function set_id_helper( ID_Helper $id_helper ) {
		$this->id_helper = $id_helper;
	}

	/**
	 * Generate the schema piece.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return mixed
	 */
	abstract public function generate( Meta_Tags_Context $context );

	/**
	 * Determine whether the schema piece is needed.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	abstract public function is_needed( Meta_Tags_Context $context );
}
