/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { Overworld } from "./overworld";
import { Nether } from "./nether";
import { TheEnd } from "./the_end";

export function NaturalBlocks(player) {
    const gui = new ActionFormData()
        .title(`Select Blocks Type`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Overworld`, `textures/blocks/grass_side_carried`)
        .button(`Nether`, `textures/blocks/netherrack`)
        .button(`The End`, `textures/blocks/end_stone`);
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            Overworld(player);
        }
        if (result.selection == 1) {
            Nether(player);
        }
        if (result.selection == 2) {
            TheEnd(player);
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
