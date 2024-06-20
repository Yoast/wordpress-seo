<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
?>

<div class="schema-faq"
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="yoast-faq"
	<?php echo wp_interactivity_data_wp_context(); ?>
	data-wp-watch="callbacks.logIsOpen"
>
	<div class="schema-faq-section" id="aaa" data-key="aaa">
		<p>
			Question

			<button
				data-wp-on--click="actions.toggle"
				data-wp-bind--aria-expanded="context.isOpen"
				aria-controls="<?php echo esc_attr( $unique_id ); ?>"
			>
				Click
			</button>
		</p>
		<p
			id="<?php echo esc_attr( $unique_id ); ?>"
			data-wp-class--hidden="!context.isOpen"
		>
			Answer
		</p>
	</div>
	<div class="schema-faq-section" id="aaa" data-key="aaa">
		<p>
			Question 2
		</p>
		<p>
			Answer 2
		</p>
	</div>
</div>
