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
<<<<<<< HEAD
    height: 1.5rem;
    margin: .5rem 0 0;
    padding: .5rem;
=======
    /*height: 1.5em;*/
    margin: .5em 0 0;
    padding: .25em .5em;
>>>>>>> 9921cfae9dbbfe49823e30a245c0e5a784b029ac
    text-align: left;
    width: 90%;
`;

export default ItineraryItem;