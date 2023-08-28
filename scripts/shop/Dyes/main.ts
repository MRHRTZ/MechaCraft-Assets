/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { shopItem } from "../itemForm";

const itemData = [
    {
        textures: "textures/items/dye_powder_white.png",
        name: "White Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "white_dye",
    },
    {
        textures: "textures/items/dye_powder_orange.png",
        name: "Orange Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "orange_dye",
    },
    {
        textures: "textures/items/dye_powder_magenta.png",
        name: "Magenta Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "magenta_dye",
    },
    {
        textures: "textures/items/dye_powder_light_blue.png",
        name: "Light Blue Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "light_blue_dye",
    },
    {
        textures: "textures/items/dye_powder_yellow.png",
        name: "Yellow Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "yellow_dye",
    },
    {
        textures: "textures/items/dye_powder_lime.png",
        name: "Lime Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "lime_dye",
    },
    {
        textures: "textures/items/dye_powder_pink.png",
        name: "Pink Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "pink_dye",
    },
    {
        textures: "textures/items/dye_powder_gray.png",
        name: "Gray Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "gray_dye",
    },
    {
        textures: "textures/items/dye_powder_silver.png",
        name: "Light Gray Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "light_gray_dye",
    },
    {
        textures: "textures/items/dye_powder_cyan.png",
        name: "Cyan Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "cyan_dye",
    },
    {
        textures: "textures/items/dye_powder_purple.png",
        name: "Purple Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "purple_dye",
    },
    {
        textures: "textures/items/dye_powder_blue_new.png",
        name: "Blue Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "blue_dye",
    },
    {
        textures: "textures/items/dye_powder_brown_new.png",
        name: "Brown Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "brown_dye",
    },
    {
        textures: "textures/items/dye_powder_green.png",
        name: "Green Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "green_dye",
    },
    {
        textures: "textures/items/dye_powder_red.png",
        name: "Red Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "red_dye",
    },
    {
        textures: "textures/items/dye_powder_black_new.png",
        name: "Black Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "black_dye",
    },
];

export function Dyes(player) {
    shopItem(player, "Dyes", itemData);
}
