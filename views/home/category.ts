import { category, emptyCategories } from "../../models/interfaces";
import { getData } from "../tools/iosys";

export async function getCategory(){
    let data: category = await getData({fileName: 'category'});
    if (data === null) {
        data = emptyCategories()
    }
    return data.categories
    
}