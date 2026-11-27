import React from "react";
import { render } from "@testing-library/react";

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

	const { container } = render(
		<ArticleList
			feed={ feed }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
