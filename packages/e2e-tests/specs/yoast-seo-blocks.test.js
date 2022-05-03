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

	it( "shows correctly Yoast SEO FAQ block in a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await insertBlock( "Yoast FAQ" );
		const yoastSeoFaqBlock = await page.$x(
			`//div[contains( @data-type, "yoast/faq-block" )]`
		);
		expect( yoastSeoFaqBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast Breadcrumbs block in a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await insertBlock( "Yoast Breadcrumbs" );
		const yoastSeoBreadcrumbsBlock = await page.$x(
			`//div[contains( @data-type, "yoast-seo/breadcrumbs" )]`
		);
		expect( yoastSeoBreadcrumbsBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast How-to block in a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await insertBlock( "Yoast How-to" );
		const yoastSeoHowToBlock = await page.$x(
			`//div[contains( @data-type, "yoast/how-to-block" )]`
		);
		expect( yoastSeoHowToBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast SEO FAQ block in a page", async () => {
		await trashAllPosts( "page" );
		await createNewPost( { postType: "page" } );

		await insertBlock( "Yoast FAQ" );
		const yoastSeoFaqBlock = await page.$x(
			`//div[contains( @data-type, "yoast/faq-block" )]`
		);
		expect( yoastSeoFaqBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast Breadcrumbs block in a page", async () => {
		await trashAllPosts( "page" );
		await createNewPost( { postType: "page" } );

		await insertBlock( "Yoast Breadcrumbs" );
		const yoastSeoBreadcrumbsBlock = await page.$x(
			`//div[contains( @data-type, "yoast-seo/breadcrumbs" )]`
		);
		expect( yoastSeoBreadcrumbsBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast How-to block in a page", async () => {
		await trashAllPosts( "page" );
		await createNewPost( { postType: "page" } );

		await insertBlock( "Yoast How-to" );
		const yoastSeoHowToBlock = await page.$x(
			`//div[contains( @data-type, "yoast/how-to-block" )]`
		);
		expect( yoastSeoHowToBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast SEO FAQ block in a custom post", async () => {
		await trashAllPosts( "yoast_post_type" );
		await createNewPost( { postType: "yoast_post_type" } );

		await insertBlock( "Yoast FAQ" );
		const yoastSeoFaqBlock = await page.$x(
			`//div[contains( @data-type, "yoast/faq-block" )]`
		);
		expect( yoastSeoFaqBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast Breadcrumbs block in a custom post", async () => {
		await trashAllPosts( "yoast_post_type" );
		await createNewPost( { postType: "yoast_post_type" } );

		await insertBlock( "Yoast Breadcrumbs" );
		const yoastSeoBreadcrumbsBlock = await page.$x(
			`//div[contains( @data-type, "yoast-seo/breadcrumbs" )]`
		);
		expect( yoastSeoBreadcrumbsBlock.length ).toBe( 1 );
	} );

	it( "shows correctly Yoast How-to block in a custom post", async () => {
		await trashAllPosts( "yoast_post_type" );
		await createNewPost( { postType: "yoast_post_type" } );

		await insertBlock( "Yoast How-to" );
		const yoastSeoHowToBlock = await page.$x(
			`//div[contains( @data-type, "yoast/how-to-block" )]`
		);
		expect( yoastSeoHowToBlock.length ).toBe( 1 );
	} );

} );
