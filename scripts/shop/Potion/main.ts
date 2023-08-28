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
            shopItem(player, "Bottle", item.bottleData);
        }
        if (result.selection == 1) {
            shopItem(player, "Splash", item.splashData);
        }
        if (result.selection == 2) {
            shopItem(player, "Lingering", item.lingeringData);
        }
    });
}
