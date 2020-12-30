<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presenters\Url_List_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Siblings block class
 */
class Breadcrumbs_Block extends Dynamic_Block {

	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'breadcrumbs';

	/**
	 * The editor script for the block.
	 *
	 * @var string
	 */
	protected $script = 'yoast-seo-dynamic-blocks';

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Siblings_Block constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Presents the block output.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string The block output.
	 */
	public function present( $attributes ) {
		return '<div>hello world</div>';
	}
}
