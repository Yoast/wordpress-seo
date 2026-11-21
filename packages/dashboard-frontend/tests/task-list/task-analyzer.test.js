import React from "react";
import { render, screen } from "@testing-library/react";
import { TaskAnalyzer } from "../../src/task-list/components/task-analyzer";

describe( "TaskAnalyzer", () => {
	const defaultProps = {
		type: "score",
		title: "SEO Analysis",
		result: "good",
		resultLabel: "Good",
		resultDescription: "This post's SEO is looking good. Your content should perform well across search engines and AI systems.",
	};

	it( "renders the analyzer with all props", () => {
		render( <TaskAnalyzer { ...defaultProps } /> );

		expect( screen.getByText( "SEO Analysis" ) ).toBeInTheDocument();
		expect( screen.getByText( "Good" ) ).toBeInTheDocument();
		expect( screen.getByText( "This post's SEO is looking good. Your content should perform well across search engines and AI systems." ) ).toBeInTheDocument();
	} );

	it( "renders the label and score label correctly", () => {
		render( <TaskAnalyzer { ...defaultProps } /> );

		const labelElement = screen.getByText( "SEO Analysis" );
		const scoreLabelElement = screen.getByText( "Good" );

		expect( labelElement ).toBeInTheDocument();
		expect( scoreLabelElement ).toBeInTheDocument();
		expect( scoreLabelElement ).toHaveClass( "yst-font-semibold" );
	} );

	it( "renders the details text", () => {
		render( <TaskAnalyzer { ...defaultProps } /> );

		const detailsElement = screen.getByText( defaultProps.resultDescription );
		expect( detailsElement ).toBeInTheDocument();
		expect( detailsElement ).toHaveClass( "yst-text-slate-600" );
	} );

	describe( "with different scores", () => {
		it( "renders with good score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					result="good"
					resultLabel="Good"
				/>
			);

			expect( screen.getByText( "Good" ) ).toBeInTheDocument();
		} );

		it( "renders with ok score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					result="ok"
					resultLabel="OK"
				/>
			);

			expect( screen.getByText( "OK" ) ).toBeInTheDocument();
		} );

		it( "renders with bad score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					result="bad"
					resultLabel="Needs improvement"
				/>
			);

			expect( screen.getByText( "Needs improvement" ) ).toBeInTheDocument();
		} );
	} );

	describe( "with different analyzer types", () => {
		it( "renders readability analyzer", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					title="Readability"
					resultDescription="This post's readability is looking good. Your content should be easy for readers to understand."
				/>
			);

			expect( screen.getByText( "Readability" ) ).toBeInTheDocument();
			expect( screen.getByText( "This post's readability is looking good. Your content should be easy for readers to understand." ) ).toBeInTheDocument();
		} );

		it( "renders SEO analyzer", () => {
			render( <TaskAnalyzer { ...defaultProps } /> );

			expect( screen.getByText( "SEO Analysis" ) ).toBeInTheDocument();
		} );
	} );
	it.each( [
		[ "good", "Good" ],
		[ "ok", "OK" ],
		[ "bad", "Needs improvement" ],
		[ "invalid score", "No score" ],
	] )( "should match snapshot for score=%s", ( result, resultLabel ) => {
		const { container } = render(
			<TaskAnalyzer
				{ ...defaultProps }
				type="score"
				result={ result }
				resultLabel={ resultLabel }
			/>
		);
		expect( container ).toMatchSnapshot();
	} );
	describe( "resultDescription with HTML elements", () => {
		it( "renders HTML with strong tags", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription="This post's SEO is <strong>looking good</strong>."
				/>
			);
			expect( screen.getByText( "looking good" ) ).toBeInTheDocument();
			expect( container.querySelector( "strong" ) ).toBeInTheDocument();
		} );

		it( "renders HTML with em tags", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription="This post's SEO is <em>looking good</em>."
				/>
			);
			expect( screen.getByText( "looking good" ) ).toBeInTheDocument();
			expect( container.querySelector( "em" ) ).toBeInTheDocument();
		} );

		it( "renders HTML with anchor links", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription='Read more about <a href="https://example.com">SEO best practices</a>.'
				/>
			);
			const link = container.querySelector( "a" );
			expect( link ).toBeInTheDocument();
			expect( link ).toHaveAttribute( "href", "https://example.com" );
			expect( screen.getByText( "SEO best practices" ) ).toBeInTheDocument();
		} );

		it( "renders HTML with multiple elements", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription='Your <strong>SEO score</strong> is <em>excellent</em>. <a href="https://example.com">Learn more</a>.'
				/>
			);
			expect( container.querySelector( "strong" ) ).toBeInTheDocument();
			expect( container.querySelector( "em" ) ).toBeInTheDocument();
			expect( container.querySelector( "a" ) ).toBeInTheDocument();
			expect( screen.getByText( "SEO score" ) ).toBeInTheDocument();
			expect( screen.getByText( "excellent" ) ).toBeInTheDocument();
			expect( screen.getByText( "Learn more" ) ).toBeInTheDocument();
		} );

		it( "sanitizes dangerous HTML (script tags)", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription='This is safe text. <script>alert("xss")</script>'
				/>
			);
			expect( container.querySelector( "script" ) ).not.toBeInTheDocument();
			expect( screen.getByText( /This is safe text/i ) ).toBeInTheDocument();
		} );

		it( "sanitizes dangerous HTML (onclick attributes)", () => {
			const { container } = render(
				<TaskAnalyzer
					{ ...defaultProps }
					resultDescription='<a href="#" onclick="alert()">Click me</a>'
				/>
			);
			const link = container.querySelector( "a" );
			expect( link ).toBeInTheDocument();
			expect( link ).not.toHaveAttribute( "onclick" );
		} );
	} );
} );
