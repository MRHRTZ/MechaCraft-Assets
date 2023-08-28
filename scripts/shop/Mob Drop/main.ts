/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { shopItem } from "../itemForm";

const itemData = [
    {
        textures: "textures/items/leather.png",
        name: "Leather",
        cost: 32,
        sell: 8,
        data: 0,
        item: "leather",
    },
    {
        textures: "textures/items/rabbit_hide.png",
        name: "Rabbit Hide",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rabbit_hide",
    },
    {
        textures: "textures/items/rabbit_foot.png",
        name: "Rabbit Foot",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rabbit_foot",
    },
    {
        textures: "textures/items/feather.png",
        name: "Feather",
        cost: 32,
        sell: 16,
        data: 0,
        item: "feather",
    },
    {
        textures: "textures/items/gunpowder.png",
        name: "Gunpowder",
        cost: 32,
        sell: 8,
        data: 0,
        item: "gunpowder",
    },
    {
        textures: "textures/items/string.png",
        name: "String",
        cost: 32,
        sell: 8,
        data: 0,
        item: "string",
    },
    {
        textures: "textures/items/rotten_flesh.png",
        name: "Rotten Flesh",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rotten_flesh",
    },
    {
        textures: "textures/items/bone.png",
        name: "Bone",
        cost: 64,
        sell: 8,
        data: 0,
        item: "bone",
    },
    {
        textures: "textures/items/ender_pearl.png",
        name: "Ender Pearl",
        cost: 64,
        sell: 8,
        data: 0,
        item: "ender_pearl",
    },
    {
        textures: "textures/items/slimeball.png",
        name: "Slimeball",
        cost: 64,
        sell: 16,
        data: 0,
        item: "slime_ball",
    },
    {
        textures: "textures/items/spider_eye.png",
        name: "Spider Eye",
        cost: 32,
        sell: 16,
        data: 0,
        item: "spider_eye",
    },
    {
        textures: "textures/items/spider_eye_fermented.png",
        name: "Fermented Spider Eye",
        cost: 32,
        sell: 16,
        data: 0,
        item: "fermented_spider_eye",
    },
    {
        textures: "textures/items/magma_cream.png",
        name: "Magma Cream",
        cost: 32,
        sell: 8,
        data: 0,
        item: "magma_cream",
    },
    {
        textures: "textures/items/blaze_rod.png",
        name: "Blaze Rod",
        cost: 64,
        sell: 8,
        data: 0,
        item: "blaze_rod",
    },
    {
        textures: "textures/items/dye_powder_glow.png",
        name: "Glow Ink Sac",
        cost: 64,
        sell: 16,
        data: 0,
        item: "glow_ink_sac",
    },
    {
        textures: "textures/items/shulker_shell.png",
        name: "Shulker Shell",
        cost: 128,
        sell: 32,
        data: 0,
        item: "shulker_shell",
    },
];

export function MobDrops(player) {
    shopItem(player, "Mob Drop Loot", itemData);
}
