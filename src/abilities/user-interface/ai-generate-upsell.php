<?php

namespace Yoast\WP\SEO\Abilities\User_Interface;

use WP_Error;
use Yoast\WP\SEO\Helpers\Product_Helper;

/**
 * Surfaces the Yoast AI Generate upsell on the abilities that write SEO titles and descriptions.
 */
class AI_Generate_Upsell {

	/**
	 * The input fields that Yoast AI Generate can also write.
	 *
	 * On the free plugin, writing one of these fields adds an upsell for AI Generate to the response.
	 *
	 * @var array<string>
	 */
	private const AI_GENERATE_FIELDS = [
		'seo_title',
		'meta_description',
		'open_graph_title',
		'open_graph_description',
		'twitter_title',
		'twitter_description',
	];

	/**
	 * The product name of Yoast AI Generate, kept out of the translatable strings.
	 *
	 * @var string
	 */
	private const AI_GENERATE_NAME = 'Yoast AI Generate';

	/**
	 * The shortlink of the AI Generate upsell placed in the response.
	 *
	 * @var string
	 */
	private const AI_GENERATE_RESPONSE_SHORTLINK = 'https://yoa.st/ai-generate-ability-response';

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructor.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct( Product_Helper $product_helper ) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Adds the AI Generate hint to the result when a field AI Generate can write was set on the free plugin.
	 *
	 * @param array<string, int|string|bool|null>|WP_Error $result The result of the write.
	 * @param array<string, int|string|bool|null>          $input  The ability input.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The result, with the hint when applicable.
	 */
	public function add_hint( $result, array $input ) {
		// Errors, and anything else that is not a data array, are passed through untouched for the Abilities API to handle.
		if ( ! \is_array( $result ) || ! $this->should_upsell( $input ) ) {
			return $result;
		}

		$result['ai_generate_hint'] = \sprintf(
			/* translators: %1$s expands to "Yoast AI Generate", %2$s expands to a URL. */
			\__( '%1$s can write SEO-optimised titles and descriptions, more details here: %2$s', 'wordpress-seo' ),
			self::AI_GENERATE_NAME,
			self::AI_GENERATE_RESPONSE_SHORTLINK,
		);

		return $result;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Adds the optional AI Generate hint to an output schema on the free plugin.
	 *
	 * @param array<string, mixed> $schema The output schema.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	public function add_to_schema( array $schema ): array {
		if ( $this->product_helper->is_premium() ) {
			return $schema;
		}

		$schema['properties']['ai_generate_hint'] = [
			'type'        => 'string',
			'description' => \sprintf(
				/* translators: %s expands to "Yoast AI Generate". */
				\__( 'A hint about %s to relay to the user. Only present when a title or description field was updated on a site without Yoast SEO Premium. Meant to be assisting users that seek SEO-optimised titles and descriptions.', 'wordpress-seo' ),
				self::AI_GENERATE_NAME,
			),
		];

		return $schema;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns whether the AI Generate upsell should be surfaced for the given input.
	 *
	 * Premium ships AI Generate, so the upsell is limited to the free plugin, and only to
	 * writes that touch a field AI Generate could have written.
	 *
	 * @param array<string, int|string|bool|null> $input The ability input.
	 *
	 * @return bool Whether to surface the upsell.
	 */
	private function should_upsell( array $input ): bool {
		if ( $this->product_helper->is_premium() ) {
			return false;
		}

		return \array_intersect_key( $input, \array_flip( self::AI_GENERATE_FIELDS ) ) !== [];
	}
}
