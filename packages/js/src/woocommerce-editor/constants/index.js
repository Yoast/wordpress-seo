export const STORES = {
	editor: "yoast-seo/editor",
	wc: {
		// Can also be found on window Object: wc.data.getProduct.
		// I failed to find the script handle for this, if it is exposed at all. Therefore, this is hardcoded here.
		products: "wc/admin/products",
	},
};

export const SLOTS = {
	// Alternative is using WooHeaderItem from "@woocommerce/adminLayout".
	headerItem: "woocommerce_header_item/product",

	focusKeyphrase: "yoast-seo/woocommerce-product/focusKeyphrase",
	seo: "yoast-seo/woocommerce-product/seo",
};

export const SYNC_TIME = {
	wait: 1500,
	max: 3000,
};
