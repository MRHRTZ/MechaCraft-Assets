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
            shopItem(player, "Overworld", item.overworldData);
        }
        if (result.selection == 1) {
            shopItem(player, "Nether", item.netherData);
        }
        if (result.selection == 2) {
            shopItem(player, "TheEnd", item.theEndData);
        }
    });
}
