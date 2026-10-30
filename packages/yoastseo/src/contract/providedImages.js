import { z } from "zod";

/**
 * Serializable contract for a single provided image consumed by the image assessments
 * (Images, Image alt attributes, Keyphrase in image alt). It is the image slice of the {@link PaperDto}
 * input contract: a producer (WooCommerce, Shopify, or any headless consumer) maps the analyzed item's
 * own images — e.g. a product's featured, gallery and variation images — onto this shape, and the
 * assessments score from it without knowing the platform. Providing the `providedImages` array — even empty —
 * opts the image assessments into scoring it instead of the images in the text.
 *
 * Field semantics that are load-bearing:
 * - `alt` is the only field the researches read (via the mapped `img` pseudo-node); an empty string means
 *   the image has no alt text and is scored accordingly.
 * - `id` and `src` are producer-side conveniences (deduplication, UI affordances such as an AI button);
 *   `src` also keeps the mapped node shape faithful to a real `img` node.
 *
 * `.strict()` rejects unknown keys, catching typos.
 */
export const providedImageSchema = z.object( {
	id: z.number().optional().describe( "The attachment/media ID of the image." ),
	src: z.string().optional().describe( "The URL of the image." ),
	alt: z.string().describe( "The alt text of the image; an empty string means no alt text." ),
} ).strict();

/**
 * @typedef {import("zod").infer<typeof providedImageSchema>} ProvidedImage
 */
