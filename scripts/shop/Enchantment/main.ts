/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { ActionFormData } from "@minecraft/server-ui";

import * as item from "./items";
import { enchantShopItem } from "../itemForm";
import { getScore } from "../../libs/utils";

export function Enchantments(player) {
    const gui = new ActionFormData()
        .title(`Enchantments`)
        .body(
            `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b$${getScore(
                player,
                "money"
            )}\n\nNote:\n§6Pastikan anda telah memegang item, gunakan perintah §c.vshop\n\n§6-------------------------------`
        )
        .button(`All Purpose`, "textures/items/book_enchanted.png")
        .button(`Armor`, "textures/items/iron_chestplate.png")
        .button(`Melee Weapon`, "textures/items/iron_sword.png")
        .button(`Ranged Weapon`, "textures/items/bow_pulling_2.png")
        .button(`Tool`, "textures/items/iron_pickaxe.png");
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            enchantShopItem(player, "All Purpose", item.allPurposeData);
        }
        if (result.selection == 1) {
            enchantShopItem(player, "Armor", item.armorData);
        }
        if (result.selection == 2) {
            enchantShopItem(player, "Melee Weapon", item.meleeWeaponData);
        }
        if (result.selection == 3) {
            enchantShopItem(player, "Ranged Weapon", item.rangedWeaponData);
        }
        if (result.selection == 4) {
            enchantShopItem(player, "Tool", item.toolData);
        }
    });
}
