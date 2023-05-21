/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { AllPurpose } from "./all_purpose";
import { Armor } from "./armor";
import { MeleeWeapon } from "./melee_weapon";
import { RangedWeapon } from "./ranged_weapon";
import { Tool } from "./tool";

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
            AllPurpose(player);
        }
        if (result.selection == 1) {
            Armor(player);
        }
        if (result.selection == 2) {
            MeleeWeapon(player);
        }
        if (result.selection == 3) {
            RangedWeapon(player);
        }
        if (result.selection == 4) {
            Tool(player);
        }
    });
}

function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    } catch (error) {
        return 0;
    }
}
