interface itemData {
    textures: string;
    name: string;
    cost: number;
    sell?: number;
    data: number;
    item: string;
}

interface enchantItemData {
    name: string;
    max_level: number;
    cost: number;
    enchant: string;
}

export interface listItemData extends Array<itemData> {}
export interface listEnchantItemData extends Array<enchantItemData> {}
