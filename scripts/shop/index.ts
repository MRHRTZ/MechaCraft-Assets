import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { getScore, getPlayers, isPlayerExist } from "../libs/utils";

import { BuildingBlocks } from "./Building Block/main";
import { NaturalBlocks } from "./Natural Block/main";
import { FunctionalBlocks } from "./Functional Block/main";
import { RedstoneTools } from "./Redstone Tool/main";
import { EquipmentsUtilities } from "./Equipment Utilities/main";
import { FoodsFarms } from "./Food Farm/main";
import { Dyes } from "./Dyes/main";
import { Ores } from "./Ores/main";
import { MobDrops } from "./Mob Drop/main";
import { SpawnEggs } from "./Spawn Egg/main";
import { Potions } from "./Potion/main";
import { Enchantments } from "./Enchantment/main";
import { EXP } from "./exp";

export function ShopUI(player) {
    const shopui = new ActionFormData()
        .title(`§l§cMecha §bOfficial §6Shop`)
        .body(
            `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
                player,
                "money"
            )}\n\n§b-------------------------------`
        )
        .button(`Transfer`, "textures/items/nether_star")
        .button(`Building Blocks`, "textures/blocks/brick")
        .button(`Natural Blocks`, "textures/blocks/grass_side_carried")
        .button(`Functional Blocks`, "textures/blocks/crafting_table_front")
        .button(`Redstone Tools`, "textures/items/redstone_dust")
        .button(`Equipments & Utilites`, "textures/items/diamond_axe")
        .button(`Foods & Farms`, "textures/items/apple_golden")
        .button(`Dyes`, "textures/items/dye_powder_red")
        .button(`Ores`, "textures/items/diamond")
        .button(`Mob Drops`, "textures/items/leather")
        .button(`Spawn Eggs`, "textures/items/egg_chicken")
        .button(`Potions`, "textures/items/potion_bottle_heal")
        .button(`Enchantment`, "textures/items/book_enchanted")
        .button(`EXP`, "textures/items/experience_bottle");
    shopui.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) {
            Transfer(player);
        }
        if (result.selection == 1) {
            BuildingBlocks(player);
        }
        if (result.selection == 2) {
            NaturalBlocks(player);
        }
        if (result.selection == 3) {
            FunctionalBlocks(player);
        }
        if (result.selection == 4) {
            RedstoneTools(player);
        }
        if (result.selection == 5) {
            EquipmentsUtilities(player);
        }
        if (result.selection == 6) {
            FoodsFarms(player);
        }
        if (result.selection == 7) {
            Dyes(player);
        }
        if (result.selection == 8) {
            Ores(player);
        }
        if (result.selection == 9) {
            MobDrops(player);
        }
        if (result.selection == 10) {
            SpawnEggs(player);
        }
        if (result.selection == 11) {
            Potions(player);
        }
        if (result.selection == 12) {
            Enchantments(player);
        }
        if (result.selection == 13) {
            EXP(player);
        }
    });
}

export function Transfer(player: Player | any) {
    var money = getScore(player, "money");
    let playersActive = getPlayers(true).join(" §c|§b ");
    let brick = new ModalFormData()
        .title(`Transfer Uang`)
        .textField(
            `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n§6List Player: §b${playersActive}\n\n§6-------------------------------\n\n§6Nama Player:`,
            `Masukan nama target untuk transfer`
        )
        .textField("§6Jumlah:", "Jumlah uang yang akan distransfer");
    brick.show(player).then(async (res) => {
        if (!res.formValues![0])
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cMasukan username tujuan!"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        if (!res.formValues![1])
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cMasukan jumlah uang yang akan ditransfer"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let qty = res.formValues![1] as number;
        if (isNaN(qty))
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cHanya bisa input angka!"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let amount = Number(res.formValues![1]);
        let playerName = res.formValues![0];
        if (isPlayerExist(playerName)) {
            try {
                await player.runCommandAsync(
                    `scoreboard players remove @s[scores={money=${amount}..}] money ${amount}`
                );
                player.runCommandAsync(`scoreboard players add "${playerName}" money ${amount}`);
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §aBerhasil transfer ke §e${playerName} §asebesar §e${amount}"}]}`
                );
                player.runCommandAsync(
                    `tellraw "${playerName}" {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §aAnda telah ditransfer oleh §e${player.nameTag} §asebesar §e${amount}"}]}`
                );
                player.runCommandAsync(`playsound random.toast @s`);
                player.runCommandAsync(`playsound random.toast "${playerName}"`);
            } catch (e) {
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cUang anda tidak mencukupi untuk transfer dengan jumlah §e${amount}"}]}`
                );
                player.runCommandAsync(`playsound note.bass @s`);
            }
        } else {
            player.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cTidak dapat menemukan player §b${playerName}"}]}`
            );
            player.runCommandAsync(`playsound note.bass @s`);
        }
    });
}
