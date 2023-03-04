export interface category {
    categories: 
        {
            category_id: Number,
            category_name: String,
            category_icon: Number,
            category_type: String
        }[]
    ,
    history: 
        {
            id: Number,
            id_account: Number,
            category: Number,
            date: String,
            sum: Number,
            comment: String
        }[]
    
}

export function emptyCategories():category {
    let newData: category = {categories:[], history:[]};
    return newData
}



export interface account {
    accounts: 
        {
            id: Number,
            name: String,
            sum: Number
        }[]
}

export function emptyAccount(): account {
    let newData: account = {accounts: []};
    return newData
}



export interface piggyBank {
    piggyBanks: 
        {
            id: Number,
            id_account: Number,
            name: String,
            sum_max: Number,
            sum_cur: Number,
            status: Boolean
        }[]
}

export function emptyPiggyBank(): piggyBank {
    let newData: piggyBank = {piggyBanks: []};
    return newData
}




export interface debt {
    debts: 
        {
            id: Number,
            id_account: Number,
            name: String,
            contact: String,
            type: String,
            sum: Number,
            date: String,
            comment: String
        }[]
}

export function emptyDebt(): debt {
    let newData: debt = {debts: []};
    return newData
}




export interface calendar {
    cards: 
        {
        id: number,
        id_account: number,
        date: string,
        name: string,
        type: string,
        sum: number,
        comment: string
        }[]
}

export function emptyCalendar():calendar {
    let newData: calendar = {cards: []};
    return newData
}
