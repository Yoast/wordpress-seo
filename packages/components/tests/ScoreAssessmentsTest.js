import React from "react";
import { render } from "@testing-library/react";

import ScoreAssessments from "../src/ScoreAssessments";

test( "the ScoreAssessments matches the snapshot", () => {
	const items = [
		{
			color: "#F00",
			score: "20",
			html: "<a href=\"http://google.com\">Posts with a <strong>bad</strong> SEO score</a>:",
		},
		{
			color: "#0F0",
			score: "50",
			html: "<a href=\"http://google.com\">Posts with an <strong>OK</strong> SEO score</a>:",
		},
	];

	const { container } = render(
		<ScoreAssessments items={ items } />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the ScoreAssessments without scores matches the snapshot", () => {
	const items = [
		{
			color: "#F00",
			html: "<a href=\"http://google.com\">Posts with a <strong>bad</strong> SEO score</a>:",
		},
		{
			color: "#0F0",
			html: "<a href=\"http://google.com\">Posts with an <strong>OK</strong> SEO score</a>:",
		},
	];

	const { container } = render(
		<ScoreAssessments items={ items } />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the ScoreAssessments with some scores matches the snapshot", () => {
	const items = [
		{
			color: "#F00",
			score: "20",
			html: "<a href=\"http://google.com\">Posts with a <strong>bad</strong> SEO score</a>:",
		},
		{
			color: "#0F0",
			html: "<a href=\"http://google.com\">Posts with an <strong>OK</strong> SEO score</a>:",
		},
	];

	const { container } = render(
		<ScoreAssessments items={ items } />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
