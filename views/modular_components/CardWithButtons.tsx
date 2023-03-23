import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useState } from 'react';
 
import Edit from '../../assets/icon/Edit.svg';
import Trash from '../../assets/icon/Trash.svg';
 
const Card = styled.View`
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    max-height: 80px;
    margin: 20px 32px 0;
    border: 1px solid #cecccc;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
`;
 
const EditBtn = styled.TouchableOpacity`
    position: absolute;
    left: 50px;
    top: 21px;
    width: 30%;
    border-radius: 10px;
    height: 100px;
    background-color: #ffb660;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
 
`;
 
const DelBtn = styled.TouchableOpacity`
    position: absolute;
    right: 50px;
    top: 21px;
    width: 30%;
    border-radius: 10px;
    height: 100px;
    background-color: #ff8484;
`;
 
/**
 * Элемент карточки, который имеет кнопки редактирования и удаления, появляющиеся при нажатии на эту карточку.
 *
 * Через 1 секунду кнопки пропадают
 * @param editModal - функция, что открывает модальное окно изменения
 * @param del - функция, что производит удаление элемента
 * @example ```ts
 * <CardWithButtons editModal={() => openEditModal(index)} del={() => del(index)}>
 *  <Text>Example</Text>
 *  ...
 * </CardWithButtons>
 * ```
 */
export default function CardWithButtons(props: {
    children: React.ReactNode;
    editModal: Function;
    del: Function;
}) {
    const [pressed, setPressed] = useState(false);
    return (
        <View style={{ height: 135 }}>
            {pressed && (
                <View>
                    <EditBtn
                        onPress={() => {
                            props.editModal();
                            setPressed(false);
                        }}
                    >
 
                        <Edit
                            width={20}
                            style={{
                                position: 'absolute',
                                bottom: -10,
                                left: '50%',
                                marginStart: -12.5,
 
 
                            }}
                        />
 
                    </EditBtn>
 
                    <DelBtn
                        onPress={() => {
                            props.del();
                            setPressed(false);
                        }}
                    >
                        <Trash
                            width={23}
                            style={{
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                marginStart: -12.5,
                            }}
                        />
                    </DelBtn>
                </View>
            )}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setPressed(!pressed);
                    if (!pressed) {
                        setTimeout(() => setPressed(false), 2500);
                    }
                }}
            >
                <Card>{props.children}</Card>
            </TouchableOpacity>
 
        </View>
    );
}