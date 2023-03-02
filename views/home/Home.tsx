import { Text, View, StyleSheet,FlatList, Dimensions, useWindowDimensions,TouchableOpacity , Image } from 'react-native';
import { DonutChart } from "react-native-circular-chart";
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import { Circle } from 'react-native-svg';



const ButtonText = styled.Text`
  text-align: center;
  font-family: 'Montserrat';
  font-size: 30px;
  font-weight: 400;
  color: #625E5E;
  margin-top: auto;
  margin-bottom: auto;
`;

const CardZAD = styled.View`
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 10px 0px 2px 0px;
`;

const FlatListsss = styled.View`
  display: flex;
  flex-direction: column;
  width: 170px;
  height: 90px;
  border: 1px solid #FAFAFA;
  border-radius: 20px;
  background-color: #FAFAFA;
  padding: 10px;
  margin: 5px;
`;
const ButtonView = styled.View`
  display: flex;
  margin: 0px 20px 0px;
  flex-direction: row;
  max-width: 100%;
  justify-content: space-between;
`;

const ButtonHeader = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: #FDFDFD;
  border-radius: 100px;
  border: 1px solid #ABA5A5;
`;

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  TextInDiagramsfirst: {
    fontSize: 25,
    color: '#7D8895',
    fontWeight: '400',
  },
  TextInDiagramsSecond: {
    fontSize:40,
    color: '#000000',
  },
  ViewInDiagrams:{
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
    height: 398,
    width: '100%',
    left: 0,
    position: 'absolute',
  },
 
})

const width = 100;
    const height = 100;
    const size = width < height ? width - 32 : height - 16;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circunference = radius * 2 * Math.PI;
const DATA = [
  {id:1,name: "красота", value: 250, color: "#faf3e0"},
  {id:2,name: "магазиг", value:250, color: "#faf121"},
  {id:3,name: "да", value:250, color: "#faa123"},
  {id:4,name: "gag", value:250, color: "#faf"}
];

/*function Categories( DATA: {id:number,name:string,value:string,color:string}) {
  const {color,name,value } = DATA;
  return (
    <div
      style={{
        boxShadow: "0 0 2px rgba(0,0,0, 0.3)",
        margin: "5px",
        padding: "10px 25px",
        fontSize: "1.2rem"
      }}
    >
      <Circle
        stroke= {color}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={`${circunference} ${circunference}`}
      />
      <Text>{name}</Text>
      <Text>{value} руб</Text>
      <Text>Прочее</Text>
    </div>
  );
}

const FlatListDemo = (props: { dataList:object , RenderComponent:object }) => {
  return (
    <View>
      <FlatList
        data={props.dataList}
        renderItem={(obj) => <RenderComponent data={obj.item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

*/



export default function Home() {
    const {width, height} =useWindowDimensions();
    const PADDING = 8;
    const size = width < height ? width - 32 : height - 16;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circunference = radius * 2 * Math.PI;
    return (
        <View style={{backgroundColor:'#fff', height: '100%', display: "flex", justifyContent: 'space-between' }}>
            <Header name="Home" style='2'/>

            <View style= {{display: 'flex',alignItems: 'center', justifyContent: 'center'}} >
                <DonutChart
                    data={DATA}
                    strokeWidth={15}
                    radius={150}
                    containerWidth={width+15 - PADDING * 2}
                    containerHeight={200 * 2}
                    type="butt"
                    startAngle={0}
                    endAngle={360}
                    animationType="slide"
                />
                <View style={styles.ViewInDiagrams}>
                  <Text style={styles.TextInDiagramsfirst}>
                      Текущий счет
                  </Text>
                  <Text style={styles.TextInDiagramsSecond}>
                      100,000 руб
                  </Text>
                </View>
            </View>
            <ButtonView>
                <ButtonHeader>
                  <View >
                  <Image
                  source={require('../../assets/icon/Sorting.png')}
                  style={styles.image} />
                  </View>
                </ButtonHeader>
                <ButtonHeader>
                <View >
                  <Image 
                  source={require('../../assets/icon/plus.png')}
                  style={styles.image}/>
                </View>
                </ButtonHeader>
             
            
            </ButtonView>

            <CardZAD>
              <FlatListsss>
                <Text>Покупки</Text>
                <Text>250 руб</Text>
                <Text>Прочее</Text>
              </FlatListsss>
              <FlatListsss>
              <Text>Транспорт</Text>
                <Text>250 руб</Text>
                <Text>Прочее</Text>
              </FlatListsss>
              <FlatListsss>
              <Text>красота</Text>
                <Text>250 руб</Text>
                <Text>Прочее</Text>
              </FlatListsss>
              <FlatListsss>
              <Text>Еда</Text>
                <Text>250 руб</Text>
                <Text>Прочее</Text>
              </FlatListsss>
            </CardZAD>

            
        </View>
    )
}
