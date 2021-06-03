/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	trashAllPosts,
	insertBlock,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO blocks", () => {

	const title = "Test Post";

	beforeEach( async () => {
		await trashAllPosts();
	} );

	it( "shows correctly Yoast SEO FAQ block", async () => {
		await createNewPost();
		await insertBlock( "Yoast FAQ" );
		const yoastSeoFaqBlock = await page.$x(
			`//div[contains( @data-type, "yoast/faq-block" )]`
		);
		expect( yoastSeoFaqBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast Breadcrumbs block", async () => {
		await createNewPost();
		await insertBlock( "Yoast Breadcrumbs" );
		const yoastSeoBreadcrumbsBlock = await page.$x(
			`//div[contains( @data-type, "yoast-seo/breadcrumbs" )]`
		);
		expect( yoastSeoBreadcrumbsBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast How-to block", async () => {
		await createNewPost();
		await insertBlock( "Yoast How-to" );
		const yoastSeoHowToBlock = await page.$x(
			`//div[contains( @data-type, "yoast-seo/how-to-block" )]`
		);
		expect( yoastSeoHowToBlock.length ).toBe( 1 );
	} );

} );
