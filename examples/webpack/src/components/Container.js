import styled from "styled-components";

export default styled.div`
	margin-top: ${ props => props.marginTop ? props.marginTop : "16px" };
	margin-right: ${ props => props.marginRight ? props.marginRight : "0" };
	margin-bottom: ${ props => props.marginBottom ? props.marginBottom : "0" };
	margin-left: ${ props => props.marginLeft ? props.marginLeft : "0" };
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-content: space-between;

	button {
		flex: 1;
		
		&:not(:first-of-type) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
		&:not(:last-of-type) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
`;
