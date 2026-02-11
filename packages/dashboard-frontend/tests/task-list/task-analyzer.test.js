import React from "react";
import { render, screen } from "@testing-library/react";
import { TaskAnalyzer } from "../../src/task-list/components/TaskAnalyzer";

describe( "TaskAnalyzer", () => {
	const defaultProps = {
		type: "score",
		label: "SEO Analysis",
		score: "good",
		scoreLabel: "Good",
		details: "This post's SEO is looking good. Your content should perform well across search engines and AI systems.",
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

		const detailsElement = screen.getByText( defaultProps.details );
		expect( detailsElement ).toBeInTheDocument();
		expect( detailsElement ).toHaveClass( "yst-text-slate-600" );
	} );

	describe( "with different scores", () => {
		it( "renders with good score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					score="good"
					scoreLabel="Good"
				/>
			);

			expect( screen.getByText( "Good" ) ).toBeInTheDocument();
		} );

		it( "renders with ok score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					score="ok"
					scoreLabel="OK"
				/>
			);

			expect( screen.getByText( "OK" ) ).toBeInTheDocument();
		} );

		it( "renders with bad score", () => {
			render(
				<TaskAnalyzer
					{ ...defaultProps }
					score="bad"
					scoreLabel="Needs improvement"
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
					label="Readability"
					details="This post's readability is looking good. Your content should be easy for readers to understand."
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
		[ null, "No score" ],
	] )( "should match snapshot for score=%s", ( score, scoreLabel ) => {
		const { container } = render(
			<TaskAnalyzer
				{ ...defaultProps }
				type="score"
				score={ score }
				scoreLabel={ scoreLabel }
			/>
		);
		expect( container ).toMatchSnapshot();
	} );
} );
