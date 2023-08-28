/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import * as item from "./items";
import { shopItem } from "../itemForm";
import { getScore } from "../../libs/utils";

export function FoodsFarms(player) {
    const gui = new ActionFormData()
        .title(`Foods & Farms`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Raw Meat Food`, "textures/items/beef_raw")
        .button(`Cooked Meat Food`, "textures/items/beef_cooked")
        .button(`Miscellaneous Food`, "textures/items/cake")
        .button(`Farm Seed`, "textures/items/seeds_wheat")
        .button(`Farm Crop`, "textures/items/wheat")
        .button(`Farm Sapling`, "textures/blocks/sapling_oak");
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            shopItem(player, "RawMeatFood", item.rawMeatData);
        }
        if (result.selection == 1) {
            shopItem(player, "CookedMeatFood", item.cookedMeatData);
        }
        if (result.selection == 2) {
            shopItem(player, "MiscellaneousFood", item.miscellaneousData);
        }
        if (result.selection == 3) {
            shopItem(player, "FarmSeed", item.farmSeedData);
        }
        if (result.selection == 4) {
            shopItem(player, "FarmCrop", item.farmCropData);
        }
        if (result.selection == 5) {
            shopItem(player, "FarmSapling", item.farmSaplingData);
        }
    });
}
