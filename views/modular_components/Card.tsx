import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native'

const CardView = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    max-height: 80px;
    margin: 20px 32px; 
    border: 1px solid #CECCCC;
    padding: 10px;
    border-radius: 10px;
`;

export default function Card (props: {onPress?: Function, children: React.ReactNode}) {
  return (
    <TouchableOpacity onPress={()=>{props.onPress && props.onPress()}}>
      <CardView>
        {props.children}
      </CardView>
    </TouchableOpacity>
  );
}