import styled from 'styled-components';

const ItineraryItemHeader = styled.div`
    background-color: ${props =>
		props.day === 0 ? '#900' :
		props.day === 1 ? '#960' :
		props.day === 2 ? '#aa0' :
		props.day === 3 ? '#070' :
		props.day === 4 ? '#0aa' :
		props.day === 5 ? '#037' :
		'#607'
	};
    border: .1rem solid gray;
    border-right: none;
    border-radius: .5rem 0 0 .5rem;
    color: white;
    display: inline-block;
    font-weight: 700;
    padding-right: .5rem;
    text-align: right;
    width: 7rem;
`;

export default ItineraryItemHeader;