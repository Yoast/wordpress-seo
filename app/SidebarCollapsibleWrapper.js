import React from "react";
import styled from "styled-components";

import Collapsible, { StyledIconsButton } from "../composites/Plugin/Shared/components/Collapsible";
import colors from "../style-guide/colors.json";

const FullWidthContaniner = styled.div`
	max-width: 1024px;
	margin: 1em auto 5em;
	// Emulate WordPress font metrics.
	font-size: 13px;
	line-height: 1.4em;

	p {
		line-height: 1.5;
	}

	// Switch everything to border-box as in Gutenberg.
	* {
		box-sizing: border-box;
	}
`;

const SortableContainer = styled.div`
	min-width: 255px;
	width: 280px;
	border-left: 1px solid #e5e5e5; // Gutenberg color
	min-height: 250px;
	margin: 0 0 0 auto;
`;

const WidgetContainer = styled.div`
	position: relative;
	background: ${ colors.$color_white };
	box-shadow: 0 1px 1px rgba(0,0,0,.04);
`;

const StyledCollapsible = styled( Collapsible )`
	border-top: 1px solid ${ colors.$color_grey };
	border-bottom: 1px solid ${ colors.$color_grey };
	margin-top: -1px;

	${ StyledIconsButton } {
		color: ${ colors.$color_black }
	}
`;


const StyledContent = styled.div`
	padding: 16px;

	& > :first-child {
		margin-top: 0;
	}

	& > :last-child {
		margin-bottom: 0;
	}
`;

/**
 * Returns the SidebarCollapsibleWrapper component.
 *
 * @returns {ReactElement} The SidebarCollapsibleWrapper component.
 */
export default function SidebarCollapsibleWrapper() {
	return (
		<FullWidthContaniner>
			<SortableContainer>
				<WidgetContainer>
					<StyledCollapsible
						title="Insert some collapsible title here"
						initialIsOpen={ true }
						prefixIcon={ { icon: "circle", color: "red" } }
						prefixIconCollapsed={ { icon: "circle", color: "red" } }
					>
						<StyledContent>
							<h3>Some content</h3>
							<p>With some text under it of course. Otherwise this would not make much sense, right?</p>
							<h3>Some other content</h3>
							<p>I should start using lorem ipsum here to write my material.</p>
						</StyledContent>
					</StyledCollapsible>
					<StyledCollapsible
						title="Collapsible initially closed"
						initialIsOpen={ false }
					>
						<StyledContent>
							<h3>Some content</h3>
							<p>With some text under it of course. Otherwise this would not make much sense, right?</p>
							<h3>Some other content</h3>
							<p>I should start using lorem ipsum here to write my material.</p>
						</StyledContent>
					</StyledCollapsible>
					<StyledCollapsible
						title="No content"
					/>
					<StyledCollapsible
						title="Focus keyword analysis"
						titleScreenReaderText="good SEO score"
						subTitle="Mountaineering in the catskills during high season"
						prefixIcon={ { icon: "seo-score-good", color: colors.$color_green_medium } }
						prefixIconCollapsed={ { icon: "seo-score-good", color: colors.$color_green_medium } }
					>
						<StyledContent>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
						</StyledContent>
					</StyledCollapsible>
					<StyledCollapsible
						title="Additional awesome focus keyword analysis"
						titleScreenReaderText="good SEO score"
						subTitle="kittens"
						prefixIcon={ { icon: "seo-score-good", color: colors.$color_green_medium } }
						prefixIconCollapsed={ { icon: "seo-score-good", color: colors.$color_green_medium } }
					>
						<StyledContent>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
						</StyledContent>
					</StyledCollapsible>
					<StyledCollapsible
						title="Help"
						suffixIcon={ { icon: "question-circle", color: colors.$color_purple } }
						suffixIconCollapsed={ { icon: "question-circle", color: colors.$color_purple } }
					>
						<StyledContent>
							<p>Maybe some help text here with a link <a target="_blank" rel="noopener noreferrer" href="https://yoast.com">Go to Yoast</a></p>
						</StyledContent>
					</StyledCollapsible>
					<StyledCollapsible
						title="Different icons size"
						prefixIcon={ { icon: "gear", color: colors.$color_purple } }
						prefixIconCollapsed={ { icon: "gear", color: colors.$color_purple } }
						suffixIcon={ { icon: "plus-circle", color: colors.$color_red, size: "30px" } }
						suffixIconCollapsed={ { icon: "plus-circle", color: colors.$color_red, size: "30px" } }
					>
						<StyledContent>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
						</StyledContent>
					</StyledCollapsible>
				</WidgetContainer>
			</SortableContainer>
			<br />
			<StyledCollapsible
				title="Good!"
				subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
				titleScreenReaderText="Good SEO score"
				prefixIcon={ { icon: "seo-score-good", color: colors.$color_green_medium } }
				prefixIconCollapsed={ { icon: "seo-score-good", color: colors.$color_green_medium } }
			>
				<StyledContent>
					<p>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
					The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.
					“What’s happened to me?” he thought. It wasn’t a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table — Samsa was a travelling salesman — and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer.</p>
				</StyledContent>
			</StyledCollapsible>
			<StyledCollapsible
				title="Meh"
				subTitle="Mountaineering in the catskills during high season"
				titleScreenReaderText="OK SEO score"
				prefixIcon={ { icon: "seo-score-ok", color: colors.$color_yellow_score } }
				prefixIconCollapsed={ { icon: "seo-score-ok", color: colors.$color_yellow_score } }
			>
				<StyledContent>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</StyledContent>
			</StyledCollapsible>
			<StyledCollapsible
				title="Bad"
				subTitle="kittens"
				titleScreenReaderText="Bad SEO score"
				prefixIcon={ { icon: "seo-score-bad", color: colors.$color_red } }
				prefixIconCollapsed={ { icon: "seo-score-bad", color: colors.$color_red } }
			>
				<StyledContent>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</StyledContent>
			</StyledCollapsible>
			<StyledCollapsible
				title="None"
				subTitle="Enter your focus keyword"
				prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey_disabled } }
				prefixIconCollapsed={ { icon: "seo-score-none", color: colors.$color_grey_disabled } }
			>
				<StyledContent>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</StyledContent>
			</StyledCollapsible>
		</FullWidthContaniner>
	);
}
