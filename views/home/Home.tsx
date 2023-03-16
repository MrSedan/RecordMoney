
// импорт необходимых библиотек и компонентов


import { Text, View, StyleSheet,FlatList, useWindowDimensions,Image, Animated, ScrollView, Button, Modal, TouchableOpacity, Alert} from 'react-native';
import DonutChart from './CustomDonutChart';
import Header from '../modular_components/Header';
import styled from 'styled-components/native';
import Item from './Item';
import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { account, category, emptyCategories, emptyHistory, history} from '../../models/interfaces';
import { getData, setData } from '../tools/iosys';
import ModalWindowCategoryList from './ModalWindowCategory';
import Input from '../modular_components/Input';
import ModalWindow from '../modular_components/ModalWindow';
import ModalWindowHistory from './ModalWindowHistory';
import Circle from './smallCircle';
import InputDate from '../calendar/additionally/InputDate';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getCategory } from './category';
import ModalWindowOneButton from '../modular_components/ModalWindowOneButton';
import { addMoney, getAccounts } from '../tools/account';
//////////////////////////////////////////////////////////////////////

//   стили
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


const HeaderView = styled.View`
  border-width: 1px;
  border-style: solid;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-start: 0;
  width: 80%;
  border-radius: 5px;
  margin-left: 10%;
  marginBottom: 5%;
`;
const ButtonColor = styled.Button`
  
`
const CardZAD = styled.View`
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 10px 0px 2px 0px;
`;
const FlatListsss = styled.View`
display: flex;
flex-direction: column;
align-items: flex-start;
width: 100%;
height: 100%;
border: 1px solid #FAFAFA;
border-radius: 20px;
background-color: #FAFAFA;
padding: 10px;
margin: 5px;
`;

const PickerBlock = styled.View`
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 20px;
    flex-direction: row;
    margin-bottom: 20px;
`


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
    modalContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 20,
    },
    colorBlock: {
      width: 50,
      height: 50,
      borderRadius: 25,
      margin: 10,
    },
    
   
  })

  
  
  const newCategory = {
    category_icon: 1,
    category_type: '',
    value: 0,
    color: '',
    id: 1,
    name : '',
  };


//////////////////////////////// 


// render item  and category




    const renderItem = ({ item }: { item: {id : number
        name : string
        category_icon : number
        category_type : string
        color : string
        value : number
    } }) => (
        <Item
          category_id={item.id}
          category_name={item.name}
          category_icon = {item.category_icon}
          category_type = {item.category_type}
          color = {item.color}
          value = {item.value}
        />
      );


//////////////////////////////// 



// summation of transactions by category

  function calculateValues(categories: category , history: history): category {
    if (!categories.categories) return emptyCategories();
    if (categories.categories.length == 0) return emptyCategories(); 

    return {categories : [...categories.categories.map((categ) => {
        
        let sum = 0
        if (history.history.length > 0){
          history.history.forEach((item)=> {
       
            if (item.category === categ.id){
          
              sum += item.sum 
            }
              
          })
        }
        const cat ={
          id : categ.id,
          name: categ.name,
          category_icon: categ.category_icon,
          category_type: categ.category_type,
          color: categ.color,
          value: sum,
        }
        return cat
        })]
      }
    }


////////////////////////////////



// basic function 
export default function Home() {
    const [numColumns, setNumColumns] = useState(2);
    const [dataItems, setDataItems] = useState(emptyCategories());
    const [datahistory, setDatahistory] = useState(emptyHistory())
    const [totalValue, setTotalValue] = useState(0)
    const [activeModalButton, setActiveModalButton] = useState(true)
    const [text, setText] = useState(['','','',''])
    const [texthistory, settexthistory] = useState(['','','',''])
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [VisibleAddCategory, setVisibleAddCategory] = useState(false)
    const [activeModalButtonAddCategory, setActiveModalButtonAddCategory] = useState(true)
    const [visibleHistory, setVisibleHistory] = useState(false)
    const [visibleAddHistory, setVisibleAddHistory] = useState(false)
    const [activeModalButtonHistory, setactiveModalButtonHistory] = useState(true)
    const [isDatePickerVisible, setDatePickerVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const [openPicker, setOpenPicker] = useState(false)
    const [pickerValue, setPickerValue] = useState('')
    const EXPENSE_CATEGORY_TYPE = 'Расход';
    const category_type= '';
    const [openPickerAccounts, setOpenPickerAccounts] = useState(false);
    const [pickerValueAccounts, setPickerValueAccounts] = useState('');
    const [items, setItems] = useState<{label: string, value: string}[]>([])
    const [itemsAccounts, setitemsAccounts] = useState<{label: string, value: string}[]>([])
    const monthNames = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
  ];

        function getItems(accounts: category["categories"]){
          let data: {label: string, value: string}[] = []
          accounts.map((item)=>{
              data.push({label: item.name, value: item.id.toString()})
          })        
          setItems(data)
      }

      function getAccount(accounts: account['accounts']) {
        let data: { label: string; value: string }[] = [];
        accounts.map((item) => {
            data.push({ label: `${item.name} ${item.sum}`, value: item.id.toString() });
        });
        setitemsAccounts(data);
    }


    // при загрузге раздела 
    useFocusEffect(
        useCallback(()=>{
            const onStart = async () => {
                let dataC: category = await getData({fileName: 'category'});
                let dataH: history = await getData({fileName: 'history'}); 
                
                Animated.timing(animateContainerOpacity, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }).start();
                if (dataC === null) {
                    dataC = emptyCategories()
                   
                    await setData({fileName: 'category', data: dataC})
                }
                await getItems(await getCategory());
                await getAccount(await await getAccounts());
                if (dataH === null) {
                    dataH = emptyHistory()
                   
                    await setData({fileName: 'history', data: dataH})
                }
                setDataItems(calculateValues((JSON.parse(JSON.stringify(dataC))),(JSON.parse(JSON.stringify(dataH)))));
                setDatahistory(JSON.parse(JSON.stringify(dataH)))              
                let sum = 0
                dataH.history.forEach((item) => {
                  if (dataC.categories[item.category].category_type === 'Доход') {
                    sum += item.sum;
                    } else {
                    sum -= item.sum;
                    }
                    });
                    setTotalValue(sum);


            }
            onStart()
            
        },[])
      )
////////////////////////////////


// кнопки для присвоения       
      const handleAddCategory = async() => {
        const maxid = 10
        let mama: category = JSON.parse(JSON.stringify(dataItems));
        let dat = newCategory;

        if (dat.id > maxid) {
          alert(`Cannot add category with ID greater than 11`);
          return;
        }
        if (text[0] === '' || text[1] === '') {
          alert('Неправильный ввод название или выбор цвета')
          return;
        }
        if (mama.categories.length !==0) {
            dat.id = mama.categories[mama.categories.length - 1].id + 1;
            dat.color = text[0];
            dat.name = text[1];
            dat.category_type = activeModalButtonAddCategory ? 'Доход' : 'Расход';
            dat.category_icon = 1;
            dat.value = 0;
            
            mama.categories.push(dat)

            await setData({fileName: "category", data: mama})
            setText(['', '', '', ''])
            setDataItems(mama)
        }
        else {
            dat.id = 0;
            dat.color = text[0];
            dat.name = text[1];
            dat.category_type = activeModalButtonAddCategory ? 'Доход' : 'Расход';
            dat.category_icon = 1;
            dat.value = 0;
            mama.categories = [dat]
            await setData({fileName: "category", data: mama})
            setText(['', '', '', ''])
            setDataItems(mama)
            
        } 
        await getItems(await getCategory())
        setVisibleAddCategory(false)
        
        }; 

        const handleADDHistory = async() => {
          
          if (texthistory[2] === '' || texthistory[3] === ''|| pickerValue === ''){
            Alert.alert('Ошибка','Введите корректные данные')
          }
          let mama: history = JSON.parse(JSON.stringify(datahistory));
          let dateS: string = ''
          let dateP: string = ''
          
          if (selectedDate == '') {
            dateS = ''
          } else {
            const [year, month, day] = texthistory[4].split("-").map(Number);
            const date = new Date(year, month, day);    
            dateS = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
            dateP = `${date.getDate()}  ${monthNames[date.getMonth()]}  ${date.getFullYear()}`
          }
          let dat = {
            id: 0,
            id_account: 0,
            category: 0,
            date: dateS,
            sum: Number(texthistory[2]),
            comment: texthistory[3]
          }

          
          
          if (mama.history.length !==0) {
              dat.id = mama.history[mama.history.length - 1].id + 1;
              dat.category = Number(pickerValue)
              dat.id_account = Number(pickerValueAccounts)
              let sumAccounts=0;
              console.log(dat.sum);
              
              dataItems.categories.map((item) => {
                console.log(item.category_type);
                if (item.id === dat.id_account) {
                  if (item.category_type) {
                    sumAccounts = (dat.sum * (-1));
                    
                    
                  } else {
                    sumAccounts = dat.sum;
                  }
                  console.log(sumAccounts);
                }
              });
              const res = await addMoney(sumAccounts, dat.id_account)
              if (res === 'not-found') Alert.alert('ошибка', 'счет не найден') 
              if (res === 'no-money') Alert.alert('ошибка', 'недостаточно средств') 
              mama.history.push(dat)
              await addMoney(sumAccounts, dat.id_account)
              await setData({fileName: "history", data: mama})
              setDatahistory(mama)
              setPickerValue('')
              setSelectedDate('')
              settexthistory(['','','','',''])
              setPickerValueAccounts('')
              

  
          }
          else {
              dat.id = 1;
              dat.category = Number(pickerValue)
              dat.id_account = Number(pickerValueAccounts)
              let sumAccounts = 0
              dataItems.categories.map((item) => {
                console.log(item.category_type);
                if (item.id === dat.id_account) {
                  if (item.category_type === 'Расход') {
                    sumAccounts = dat.sum * -1;
                  } else {
                    sumAccounts = dat.sum;
                  }
                  console.log(sumAccounts);
                }
              });
              const res = await addMoney(sumAccounts, dat.id_account)
              if (res === 'not-found') Alert.alert('ошибка', 'счет не найден') 
              if (res === 'no-money') Alert.alert('ошибка', 'недостаточно средств') 
              mama.history.push(dat)
              
              await setData({fileName: "history", data: mama})
              setDatahistory(mama)
              setPickerValue('')
              setSelectedDate('')
              settexthistory(['','','','',''])
          } 
          
          console.log(datahistory, dataItems);
          
          setDataItems(calculateValues(dataItems,mama), )
          let sum = 0
              
            mama.history.forEach((item) => {
              if (dataItems.categories[item.category].category_type === 'Доход') {
                sum += item.sum;
                } else {
                sum -= item.sum;
                }
                });
                setTotalValue(sum);
          setVisibleAddHistory(false);
          };

            
            // распределение по расходом и категориям 
              const incomeItems = dataItems.categories.filter(
                item => item.category_type !== EXPENSE_CATEGORY_TYPE
              );
              const expenseItems = dataItems.categories.filter(
                item => item.category_type === EXPENSE_CATEGORY_TYPE
              );
            ////////////////////////////////////////////
            const animateContainerOpacity = useRef(new Animated.Value(0)).current;
            const colors = ['#FF0000','#FFA500','#FFFF00','#008000','#0000FF','#800080','#FFC0CB','#A52A2A','#808080',];
            const [selectedColor, setSelectedColor] = useState('');
            const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);
            
            const handleColorSelect = (color: string, index: number) => {
              setSelectedColor(color);
              
              setSelectedBlockIndex(index);
              
            };

            const handleAddColor = () => {
              text[0]= selectedColor.toString()
              setVisible2(false);
             
              setSelectedBlockIndex(-1);
            };
            
            
            return (
      
                <View style={{backgroundColor:'#fff', height: '100%', display: "flex", justifyContent: 'space-between' }}>

                  <Modal visible={visible2} animationType="slide">
                          <View style={styles.modalContainer}>
                            {colors.map((color, index) => (
                              <TouchableOpacity key={color} style={[styles.colorBlock, { backgroundColor: color }, selectedBlockIndex === index && { borderColor: 'black', borderWidth: 3 }]} onPress={() => handleColorSelect(color,  index)} onPressOut={() => setSelectedBlockIndex(-1)}/>
                            ))}
                          </View>
                          <Button title="Добавить цвет" onPress={handleAddColor} />
                  </Modal>


                <ModalWindow functionCancelButton={() => {setText(['','','',''])}} functionSaveButton={() => {handleAddCategory ()}} visible={VisibleAddCategory} setVisible={setVisibleAddCategory} buttonTextLeft='Доход' buttonTextRight='Расход' activeModalButton={activeModalButtonAddCategory} setActiveModalButton={setActiveModalButtonAddCategory} colorActiveLeft='#3EA2FF' colorActiveRight='#FF6E6E'>
                  <PickerBlock>
                    <Text style={{fontSize: 15, textAlign: 'center', width: 'auto', marginLeft: 40, textAlignVertical: 'center'}}>Цвет</Text>
                      <View style={{ marginRight : "37%"}}>
                        <ButtonColor title='выбери цвет' onPress={() =>setVisible2(true)}  ></ButtonColor>
                     </View>
                  </PickerBlock>
                  <Input textName='Название' value={text[1].toString()} setItems={setText} index={1} placeholder='Введите название категории' keyboardType="default" colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'}/>
                </ModalWindow>
                

                <ModalWindowHistory visible={visibleHistory} setVisible={setVisibleHistory}  type={false} >
                        {datahistory.history.map((item) => (
                            <CardZAD key={item.id}>
                              <FlatListsss>
                                <Circle radius={10} color={dataItems.categories[item.category].color}/>
                                <View style={{position: 'absolute', marginTop: '3%' }}>
                                  <Text style= {{color: "#303841", marginLeft: '30%'}}>{dataItems.categories[item.category].name}</Text>
                                  <Text style= {{color: "#7D8895", marginTop: "20%", marginLeft: '8%'}}>{item.date}</Text>
                                </View>
                                <Text style= {{color: "#94C3F6", marginTop: "4%", marginLeft: '60%' , fontSize: 20 }} >{item.sum} руб</Text>
                              </FlatListsss>
                            </CardZAD>
                          
                        ))}
                    
                
                </ModalWindowHistory>
                <ModalWindowOneButton functionCancelButton={() => {settexthistory(['','','',''])}} functionSaveButton={handleADDHistory} visible={visibleAddHistory} setVisible={setVisibleAddHistory} windowName='Добавление Расхода'>
                  <InputDate functionDate={()=>{setDatePickerVisible(true)}} textName='Дата' value={selectedDate.toString()} setValue={() => {setSelectedDate}} placeholder='Введите дату' keyboardType="default"  colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'}/>
                  <PickerBlock>
                    <Text style={{fontSize: 15, textAlign: 'center', width: 'auto', marginLeft: 20, textAlignVertical: 'center'}}>Категория</Text>
                    <DropDownPicker open={openPicker} value={pickerValue} setOpen={setOpenPicker} setValue={setPickerValue} items={items} setItems={setItems} containerStyle={{width: '66%', alignSelf: 'flex-end' , zIndex: 9999}} placeholder="Выберите категорию" dropDownDirection='DEFAULT'/>
                  </PickerBlock>
                  {isDatePickerVisible && (
                      <DateTimePicker style={{flex: 1, position: 'relative'}} isVisible={isDatePickerVisible} mode='date' onConfirm={(date: Date) => {
                          setSelectedDate(`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`);
                          const newText = [...texthistory]
                          newText[4] = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
                          settexthistory(newText)
                          setDatePickerVisible(false)
                      }} onCancel={()=>{setDatePickerVisible(false)}}/>

                  )}
                  <Input textName='Сумма' value={texthistory[2].toString()} setItems={settexthistory}  index={2} placeholder='Введите сумму ' keyboardType='numeric' colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'}/>
                  <Input textName='Комментарий' value={texthistory[3].toString()} setItems={settexthistory} index={3} placeholder='Введите комментарий' keyboardType='default' colorActiveInput={(activeModalButtonAddCategory) ? '#3EA2FF' : '#FF6E6E'} />
                  <PickerBlock>
                    <Text style={{fontSize: 15, textAlign: 'center', width: 'auto', marginLeft: 20, textAlignVertical: 'center'}}>Счет</Text>
                    <DropDownPicker open={openPickerAccounts} value={pickerValueAccounts} setOpen={setOpenPickerAccounts} setValue={setPickerValueAccounts} items={itemsAccounts} setItems={setitemsAccounts} containerStyle={{width: '66%', alignSelf: 'flex-end'}} placeholder="Выберите аккаунт" dropDownDirection='TOP'/>
                  </PickerBlock>
                 </ModalWindowOneButton>
                
               



                    <ModalWindowCategoryList  functionRightPlus={() => {setVisibleAddCategory(true); setActiveModalButtonAddCategory(true)}} visible={visible} setVisible={setVisible} buttonTextLeft='Доход' buttonTextRight='Расход' activeModalButton={activeModalButton} setActiveModalButton={setActiveModalButton} colorActiveLeft='#3EA2FF' colorActiveRight='#FF6E6E'>
                    {activeModalButton ? (
                      // Вкладка "Доход"
                      <View>
                        <FlatList
                          data={incomeItems}
                          renderItem={({item}) => <HeaderView><Text>{item.name}</Text></HeaderView>}
                        />
                      </View>
                    ) : (
                      // Вкладка "Расход"
                      <View>
                        {expenseItems.map((category) => (
                          <View key={category.id}>
                            <HeaderView>
                            <Text>{category.name}</Text>
                            </HeaderView>
                          </View>
                        ))}
                      </View>
                    )}
                    </ModalWindowCategoryList>




                    <Header name="Home" style='2' functionLeft={() => {}} functionRight={() => {setVisibleHistory(true)}}/>
        
                    <View style= {{display: 'flex',alignItems: 'center', justifyContent: 'center'}} >
                     
                    <Animated.View style={{ opacity: animateContainerOpacity }}>
                      <DonutChart
                        data={dataItems.categories.filter((item)=>{
                          return item.value > 0
                        })}
                        size={350}
                      />
                      </Animated.View>
                      
                        <View style={styles.ViewInDiagrams}>
                          <Text style={styles.TextInDiagramsfirst}>
                              Текущий счет
                          </Text>
                            <Text style={styles.TextInDiagramsSecond}>
                              {totalValue.toFixed(2)} руб
                          </Text> 
                        </View>
                    </View>
                    <ButtonView>
                        <ButtonHeader onPress={() => {setVisible(true); setActiveModalButton(true)}}>
                          <View >
                          <Image
                          source={require('../../assets/icon/Sorting.png')}
                          style={styles.image} />
                          </View>
                        </ButtonHeader>
                        <ButtonHeader onPress={() => {setVisibleAddHistory(true); setactiveModalButtonHistory(true)}} >
                        <View >
                          <Image 
                          source={require('../../assets/icon/plus.png')}
                          style={styles.image}/>
                        </View>
                        </ButtonHeader>
                    </ButtonView>
        
                    <FlatList style={{display: 'flex', alignContent: 'flex-start'}}
                     data={dataItems.categories}
                     renderItem={renderItem}
                     numColumns={numColumns}
                     keyExtractor={(item)=>{return item.id.toString()}}
                
                    />
                    
                </View>
            )
}

