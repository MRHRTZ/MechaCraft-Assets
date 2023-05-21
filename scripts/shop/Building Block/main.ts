/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { Wood } from "./wood";
import { Stone } from "./stone";
import { Glass } from "./glass";
import { Wool } from "./wool";
import { Concrete } from "./concrete";
import { Terracotta } from "./terracotta";

export function BuildingBlocks(player: Player | any) {
    const gui = new ActionFormData()
        .title(`Pilih Tipe Blok`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Wood Blocks`, `textures/blocks/log_oak`)
        .button(`Stone Blocks`, `textures/blocks/stone`)
        .button(`Glass Blocks`, `textures/blocks/glass`)
        .button(`Wool Blocks`, `textures/blocks/wool_colored_red`)
        .button(`Concrete Blocks`, `textures/blocks/concrete_white`)
        .button(`Terracotta Blocks`, `textures/blocks/hardened_clay`);
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            Wood(player);
        }
        if (result.selection == 1) {
            Stone(player);
        }
        if (result.selection == 2) {
            Glass(player);
        }
        if (result.selection == 3) {
            Wool(player);
        }
        if (result.selection == 4) {
            Concrete(player);
        }
        if (result.selection == 5) {
            Terracotta(player);
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
