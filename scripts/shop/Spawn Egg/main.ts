/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import * as item from "./items";
import { shopItem } from "../itemForm";
import { getScore } from "../../libs/utils";

export function SpawnEggs(player) {
    const gui = new ActionFormData()
        .title(`Spawn Eggs`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Animal Mob`, "textures/items/egg_chicken.png")
        .button(`Undead Mob`, "textures/items/egg_zombie.png")
        .button(`Spawner Mob`, "textures/blocks/mob_spawner.png");
    gui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            shopItem(player, "Animal Mob", item.animalData);
        }
        if (result.selection == 1) {
            shopItem(player, "Undead Mob", item.undeadData);
        }
        if (result.selection == 2) {
            shopItem(player, "Spawner Mob", item.spawnerData);
        }
    });
}
