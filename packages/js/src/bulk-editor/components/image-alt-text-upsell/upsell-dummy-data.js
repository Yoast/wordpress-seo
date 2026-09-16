/**
 * The decorative content behind the Yoast WooCommerce SEO upsell: a faded, non-interactive impression of the
 * Woo-SEO add-on's image alt text tab. Product and file names are made up and deliberately not translated.
 */

/**
 * @typedef {Object} DummyProduct
 * @property {string} title The product title.
 * @property {number} imageCount The number of product images.
 */

/**
 * @typedef {Object} DummyImage
 * @property {string} fileName The image file name.
 * @property {string} path The upload path of the image.
 * @property {string} alt The alt text, empty when missing.
 */

/** @type {DummyProduct[]} */
export const DUMMY_PRODUCTS = [
	{ title: "Classic Athletic Sneaker", imageCount: 4 },
	{ title: "Retro Basketball Shoe", imageCount: 5 },
	{ title: "Lightweight Running Shoe", imageCount: 3 },
	{ title: "Casual Slip-On Sneaker", imageCount: 2 },
	{ title: "Trail Running Shoe", imageCount: 5 },
	{ title: "Fashionable High-Top Sneaker", imageCount: 7 },
];

export const DUMMY_ACTIVE_PRODUCT = {
	title: "Classic athletic sneaker",
	imageCount: 4,
	missingAltCount: 2,
	focusKeyphrase: "Athletic sneaker",
};

/** @type {DummyImage[]} */
export const DUMMY_IMAGES = [
	{
		fileName: "sneakers-featured-main.jpg",
		path: "wp-content/uploads/2026/03/sneakers-featured-main.jpg",
		alt: "A stylish sneaker with a modern design and vibrant colors.",
	},
	{
		fileName: "sneakers-sixty-se7en.jpg",
		path: "wp-content/uploads/2026/03/sneakers-sixty-se7en.jpg",
		alt: "Sixty Se7en side view.",
	},
	{
		fileName: "sneakers-iconic-on-feet.jpg",
		path: "wp-content/uploads/2026/03/sneakers-iconic-on-feet.jpg",
		alt: "",
	},
	{
		fileName: "sneakers-black-and-grey-look.jpg",
		path: "wp-content/uploads/2026/03/sneakers-black-and-grey-look.jpg",
		alt: "",
	},
];
