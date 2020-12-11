<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Registers the Schema replace variables.
 */
class Schema_Replace_Vars implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * The replace vars.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * The Schema ID helper.
	 *
	 * @var ID_Helper
	 */
	protected $id_helper;

	/**
	 * Schema_Replace_Vars constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
	 * @param WPSEO_Replace_Vars         $replace_vars               The replace vars.
	 * @param ID_Helper                  $id_helper                  The Schema ID helper.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $meta_tags_context_memoizer,
		WPSEO_Replace_Vars $replace_vars,
		ID_Helper $id_helper
	) {
		$this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
		$this->replace_vars               = $replace_vars;
		$this->id_helper                  = $id_helper;
	}

	/**
	 * Registers the appropriate hooks needed for this integration to work.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_json_ld', [ $this, 'register_replace_vars' ] );
	}

	/**
	 * Registers the Schema related replace vars.
	 *
	 * @return void
	 */
	public function register_replace_vars() {
		$context = $this->meta_tags_context_memoizer->for_current_page();

		$replace_vars = [
			'main_schema_id'   => $context->main_schema_id,
			'author_id'        => $this->id_helper->get_user_schema_id( $context->indexable->author_id, $context ),
			'person_id'        => $context->site_url . Schema_IDs::PERSON_HASH,
			'primary_image_id' => $context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH,
			'webpage_id'       => $context->canonical . Schema_IDs::WEBPAGE_HASH,
			'website_id'       => $context->site_url . Schema_IDs::WEBSITE_HASH,
		];

		foreach ( $replace_vars as $var => $replace_function ) {
			$this->maybe_register_replacement( $var, $replace_function );
		}
	}

	/**
	 * Registers a replace var and its replace function if it has not been registered yet.
	 *
	 * @param string $variable The replace variable, in the form of '%%variable%%'.
	 * @param string $value    The value that the variable should be replaced with.
	 */
	protected function maybe_register_replacement( $variable, $value ) {
		if ( ! $this->replace_vars->has_been_registered( $variable ) ) {
			WPSEO_Replace_Vars::register_replacement(
				$variable,
				static function() use ( $value ) {
					return $value;
				}
			);
		}
	}
}
