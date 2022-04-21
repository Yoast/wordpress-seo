import { Fragment, useCallback } from "@wordpress/element";
import { TextField, Title } from "@yoast/ui-library";

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
		<Fragment>
			<Title>What is your post about?</Title>
			<TextField
				id="writingGuide/about/focusKeyphrase"
				name="focusKeyphrase"
				label="Focus keyphrase"
				description="What phrase describes your post the best?"
				value={ data?.focusKeyphrase || "" }
				onChange={ handleChange }
			/>
		</Fragment>
	);
};

export default About;
