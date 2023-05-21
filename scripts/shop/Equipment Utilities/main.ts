/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { Helmet } from "./helmet";
import { Chestplate } from "./chestplate";
import { Leggings } from "./leggings";
import { Boots } from "./boots";
import { Sword } from "./sword";
import { Axe } from "./axe";
import { Pickaxe } from "./pickaxe";
import { Shovel } from "./shovel";
import { Hoe } from "./hoe";
import { Utilities } from "./utilities";

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
            Helmet(player);
        }
        if (result.selection == 1) {
            Chestplate(player);
        }
        if (result.selection == 2) {
            Leggings(player);
        }
        if (result.selection == 3) {
            Boots(player);
        }
        if (result.selection == 4) {
            Sword(player);
        }
        if (result.selection == 5) {
            Axe(player);
        }
        if (result.selection == 6) {
            Pickaxe(player);
        }
        if (result.selection == 7) {
            Shovel(player);
        }
        if (result.selection == 8) {
            Hoe(player);
        }
        if (result.selection == 9) {
            Utilities(player);
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
