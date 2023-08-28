/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import * as item from "./items";
import { getScore } from "../../libs/utils";
import { shopItem } from "../itemForm";

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
            shopItem(player, "Wood Blocks", item.woodData);
        }
        if (result.selection == 1) {
            shopItem(player, "Stone Blocks", item.stoneData);
        }
        if (result.selection == 2) {
            shopItem(player, "Glass Blocks", item.glassData);
        }
        if (result.selection == 3) {
            shopItem(player, "Wool Blocks", item.woolData);
        }
        if (result.selection == 4) {
            shopItem(player, "Concrete Blocks", item.concreteData);
        }
        if (result.selection == 5) {
            shopItem(player, "Terracotta Blocks", item.terracottaData);
        }
    });
}
