import styled from 'styled-components';

import CONSTANTS from '../constants';

const ItineraryItem = styled.div`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.object :
        CONSTANTS.colors.light.object};
    border: .2em solid ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.heavy :
        CONSTANTS.colors.light.heavy};
    color: black;
    border-radius: .75rem;
    display: inline-block;
    margin: .5rem 0 0;
    padding: .25rem .5rem;
    text-align: left;
    width: 80%;
`;

export default ItineraryItem;