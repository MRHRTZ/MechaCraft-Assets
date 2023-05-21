/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { Bottle } from "./potion_bottle";
import { Splash } from "./potion_splash";
import { Lingering } from "./potion_lingering";

export function Potions(player) {
    const gui = new ActionFormData()
        .title(`Potions`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Bottle Potion`, "textures/items/potion_bottle_heal")
        .button(`Splash Potion`, "textures/items/potion_bottle_splash_heal")
        .button(`Lingering Potion`, "textures/items/potion_bottle_lingering_heal");
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            Bottle(player);
        }
        if (result.selection == 1) {
            Splash(player);
        }
        if (result.selection == 2) {
            Lingering(player);
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
