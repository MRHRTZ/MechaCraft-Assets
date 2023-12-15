/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import * as item from "./items";
import { shopItem } from "../itemForm";

export function EquipmentsUtilities(player) {
    const gui = new ActionFormData()
        .title(`Equipments & Utitilities`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Helmet`, "textures/items/iron_helmet")
        .button(`Chestplate`, "textures/items/diamond_chestplate")
        .button(`Leggings`, "textures/items/netherite_leggings")
        .button(`Boots`, "textures/items/gold_boots")
        .button(`Sword`, "textures/items/iron_sword")
        .button(`Axe`, "textures/items/diamond_axe")
        .button(`Pickaxe`, "textures/items/netherite_pickaxe")
        .button(`Shovel`, "textures/items/gold_shovel")
        .button(`Hoe`, "textures/items/stone_hoe")
        .button(`Utilities`, "textures/items/elytra");
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            shopItem(player, "Helmet", item.helmetData);
        }
        if (result.selection == 1) {
            shopItem(player, "Chestplate", item.chestplateData);
        }
        if (result.selection == 2) {
            shopItem(player, "Leggings", item.leggingsData);
        }
        if (result.selection == 3) {
            shopItem(player, "Boots", item.bootsData);
        }
        if (result.selection == 4) {
            shopItem(player, "Sword", item.swordData);
        }
        if (result.selection == 5) {
            shopItem(player, "Axe", item.axeData);
        }
        if (result.selection == 6) {
            shopItem(player, "Pickaxe", item.pickaxeData);
        }
        if (result.selection == 7) {
            shopItem(player, "Shovel", item.shovelData);
        }
        if (result.selection == 8) {
            shopItem(player, "Hoe", item.hoeData);
        }
        if (result.selection == 9) {
            shopItem(player, "Utilities", item.utilitiesData);
        }
    });
}

function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective)!.getScore(entity);
    } catch (error) {
        return 0;
    }
}
