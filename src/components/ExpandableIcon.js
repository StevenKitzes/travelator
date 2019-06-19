import styled from 'styled-components';

const ExpandableIcon = styled.img`
    display: inline-block;
    height: 1rem;
    margin: -.3rem ${props => props.gap ? '.5rem' : '0'} 0 0;
    width: 1rem;
`;

export default ExpandableIcon;