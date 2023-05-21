/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { RawMeatFood } from "./raw_meat_food";
import { CookedMeatFood } from "./cooked_meat_food";
import { MiscellaneousFood } from "./miscellaneous_food";
import { FarmSeed } from "./farm_seed";
import { FarmCrop } from "./farm_crop";
import { FarmSapling } from "./farm_sapling";

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
            RawMeatFood(player);
        }
        if (result.selection == 1) {
            CookedMeatFood(player);
        }
        if (result.selection == 2) {
            MiscellaneousFood(player);
        }
        if (result.selection == 3) {
            FarmSeed(player);
        }
        if (result.selection == 4) {
            FarmCrop(player);
        }
        if (result.selection == 5) {
            FarmSapling(player);
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
