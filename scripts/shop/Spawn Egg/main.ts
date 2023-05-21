/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { AnimalMob } from "./mob_animal";
import { UndeadMob } from "./mob_undead";
import { SpawnerMob } from "./mob_spawner";

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
            AnimalMob(player);
        }
        if (result.selection == 1) {
            UndeadMob(player);
        }
        if (result.selection == 2) {
            SpawnerMob(player);
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
