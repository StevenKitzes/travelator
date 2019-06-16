import styled from 'styled-components';

import CONSTANTS from '../constants';

const ItineraryItem = styled.div`
    background-color: ${props => props.theme === CONSTANTS.dark ?
        CONSTANTS.colors.dark.object :
        CONSTANTS.colors.light.object};
    color: black;
    border-radius: .2em;
    display: inline-block;
    height: 1.5em;
    margin: .5em 0 0;
    padding: .25em;
    text-align: left;
    width: 90%;
`;

export default ItineraryItem;