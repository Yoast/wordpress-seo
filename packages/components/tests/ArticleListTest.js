import React from "react";
import renderer from "react-test-renderer";

import ArticleList from "../src/ArticleList";

test( "the ArticleList matches the snapshot", () => {
	const feed = {
		link: "https://www.yoast.com",
		title: "Feed title",
		items: [
			{
				title: "Wordpress SEO",
				link: "https://www.yoast.com/1",
				description: "Some arbitrary description any blog post could have",
			},
			{
				title: "Wordpress SEO",
				link: "https://www.yoast.com/2",
				description: "Some arbitrary description any blog post could have",
			},
		],
	};

	const component = renderer.create(
		<ArticleList
			feed={ feed }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
