import React from "react";
import renderer from "react-test-renderer";

import SEOScoreAssessments from "../components/SEOScoreAssessments";

test( "the SEOScoreAssessments matches the snapshot", () => {
	const items = [
		{
			color: '#F00',
			score: '20',
			html: '<a href="http://google.com">Posts with a <strong>bad</strong> SEO score</a>:'
		},
		{
			color: '#0F0',
			score: '50',
			html: '<a href="http://google.com">Posts with an <strong>OK</strong> SEO score</a>:'
		}
	];

	const component = renderer.create(
		<SEOScoreAssessments items={ items } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SEOScoreAssessments without scores matches the snapshot", () => {
	const items = [
		{
			color: '#F00',
			html: '<a href="http://google.com">Posts with a <strong>bad</strong> SEO score</a>:'
		},
		{
			color: '#0F0',
			html: '<a href="http://google.com">Posts with an <strong>OK</strong> SEO score</a>:'
		}
	];

	const component = renderer.create(
		<SEOScoreAssessments items={ items } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SEOScoreAssessments with some scores matches the snapshot", () => {
	const items = [
		{
			color: '#F00',
			score: '20',
			html: '<a href="http://google.com">Posts with a <strong>bad</strong> SEO score</a>:'
		},
		{
			color: '#0F0',
			html: '<a href="http://google.com">Posts with an <strong>OK</strong> SEO score</a>:'
		}
	];

	const component = renderer.create(
		<SEOScoreAssessments items={ items } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
