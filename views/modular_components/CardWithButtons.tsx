import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

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
export default function CardWithButtons(props: { children: React.ReactNode; func?: Function }) {
    return (
        <TouchableOpacity
            onLongPress={() => {
                props.func && props.func();
            }}
            delayLongPress={300}
        >
            <Card>{props.children}</Card>
        </TouchableOpacity>
    );
}
