import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity ,Text, View, } from 'react-native';
import Circle from './smallCircle';

type ItemProps = {
  category_id: number,
  category_name: string,
  category_icon: Number,
  category_type: string,
  color: string,
  value: number,
}

const CardZAD = styled.View`
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 10px 0px 2px 0px;
`;

const FlatListsss = styled.View`
display: flex;
flex-direction: column;
align-items: flex-start;
width: 170px;
height: 90px;
border: 1px solid #FAFAFA;
border-radius: 20px;
background-color: #FAFAFA;
padding: 10px;
margin: 5px;
`;



const Item = ({ category_id, category_name,value, color}: ItemProps) => {
  return (
    <TouchableOpacity onPress={() => console.log(category_id)}>
    <CardZAD>
       <FlatListsss>
        <Circle radius={10} color={color}/>
        <View style={{position: 'absolute', marginTop: '6%' }}>
          <Text style= {{color: "#303841", marginLeft: '30%'}}>{category_name}, {category_id}</Text>
          <Text style= {{color: "#94C3F6", marginTop: "8%", marginLeft: '11%'}} >{value-0.1} руб</Text>
          <Text style= {{color: "#7D8895", marginTop: "5%", marginLeft: '8%'}}> Прочее</Text>
        </View>
      </FlatListsss>
    </CardZAD>
    </TouchableOpacity>
  );
};



export default Item;