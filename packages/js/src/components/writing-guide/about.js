import { useCallback } from "@wordpress/element";
import { Link, TextareaField, TextField, Title } from "@yoast/ui-library";

const About = ( { data, dispatch } ) => {
	const handleChange = useCallback( event => {
		dispatch( {
			type: "setData",
			payload: {
				...data,
				[ event.target.name ]: event.target.value,
			},
		} );
	}, [ data, dispatch ] );

	return (
		<div className="">
			<Title className="yst-mb-4">What is your post about?</Title>
			<p className="yst-mb-2 yst-text-base">
				It’s essential to know what to write about before you start! Ask yourself: What is the topic of your post? What do you want this page
				to rank for in the search results? This is your focus keyphrase! The more specific it is the higher your chances of ranking high.
			</p>
			<p className="yst-mb-4 yst-text-base">
				Read all about <Link href="https://yoast.com" rel="noopener noreferrer" target="_blank"><span className="yst-sr-only">(opens in a new tab)</span>picking
					the right focus keyphrase for your content</Link>
			</p>
			<TextField
				id="writingGuide/about/focusKeyphrase"
				className="yst-mb-4"
				name="focusKeyphrase"
				label="Focus keyphrase"
				description="What phrase describes your post the best?"
				value={ data?.focusKeyphrase }
				onChange={ handleChange }
			/>
			<TextareaField
				id="writingGuide/about/metaDescription"
				name="metaDescription"
				label="Short post description"
				description="Provide a short description of your post or page:"
				value={ data?.metaDescription }
				onChange={ handleChange }
			/>
		</div>
	);
};

export default About;
