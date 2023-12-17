import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { listItemData, listEnchantItemData, MechaPlayer } from "../libs/types";
import { getInventory, getPlayerInventory, getScore, viewObj } from "../libs/utils";
import MechAPI from "../libs/mechapi";

export function shopItem(player: Player, item, item2) {}

export function enchantShopItem(player: Player, shopTitle: string, itemData: listEnchantItemData) {
    const shop = new ActionFormData();
    shop.title(shopTitle);
    shop.body(
        `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b$${getScore(
            player,
            "money"
        )}\n\nNote:\n§6Pastikan anda telah memegang item, gunakan perintah §c.vshop\n\n§6-------------------------------`
    );
    for (const enchant of itemData) shop.button(`${enchant.name}\n§b$${enchant.cost}`);
    shop.show(player).then((result) => {
        if (result.canceled) return;
        const enchant = itemData[result.selection!];
        var money = getScore(player, "money");
        let brick = new ModalFormData()
            .title(`${enchant.name}`)
            .slider(
                `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Enchant Information:\n§6Buy x1 Level §b${enchant.name} §6= §b$${enchant.cost}\n\nNote:\n§6Pastikan anda telah memegang item, gunakan perintah §c.vshop\n\n§6-------------------------------\n\n§6Level`,
                1,
                enchant.max_level,
                1
            );
        brick.show(player).then(async (res) => {
            let qty = res.formValues![0] as number;
            if (isNaN(qty))
                return (
                    (await player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§cKamu hanya bisa memasukan jumlah item memakai angka"}]}`
                    )) && player.runCommandAsync(`playsound note.bass @s`)
                );
            let dataCost = enchant.cost * qty;
            if (res.formValues![0]) {
                let action = await player.runCommandAsync(
                    `scoreboard players remove @s[scores={money=${dataCost}..}] money ${dataCost}`
                );
                if (action.successCount) {
                    player.runCommandAsync(`enchant @s ${enchant.enchant} ${res.formValues![0]}`);
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aSukses membeli enchant §b${
                            enchant.name
                        } ${res.formValues![0]} §aDengan total: §e${dataCost}"}]}`
                    );
                    player.runCommandAsync(`playsound random.levelup @s`);
                } else {
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cUang kamu tidak cukup, butuh §e${dataCost}"}]}`
                    );
                    player.runCommandAsync(`playsound note.bass @s`);
                }
            }
        });
    });
}
