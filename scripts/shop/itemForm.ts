import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { listItemData, listEnchantItemData, MechaPlayer } from "../libs/types";
import { getInventory, getPlayerInventory, getScore, viewObj } from "../libs/utils";
import MechAPI from "../libs/mechapi";

export async function itemCatalog(player: Player, itemID: number) {
    const resp_user = await MechAPI.getUser(player);
    if (!resp_user.status) {
        player.sendMessage(`§r§l§e[§MECHA§e]§r §c${resp_user.message}`);
        player.playSound("note.bass");
        return;
    }
    const resp_item = await MechAPI.getShopItem(player, itemID);
    if (!resp_item.status) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp_item.message}`);
        player.playSound("note.bass");
        return;
    }

    const user: MechaPlayer = resp_user.result;
    const item = resp_item.result;
    const isSellExist = item.sell > 0;
    let modal = new ModalFormData();
    modal.title(`${item.name}`);
    modal.textField(
        `§a-------------------------------\n\n§6Informasi Pemain:\n§fNama: §b${player.nameTag}\n§fUang: §b${user.money}\n\n§6Informasi barang:\n§fBeli  x1 §b${item.name} §f= §a${item.cost}\n§fJual x1 §b${item.name} §f= §a${item.sell}\n\n§a-------------------------------\n\n§fJumlah:`,
        `Jumlah yang ingin dibeli ${isSellExist ? "atau dijual" : ""}`
    );
    if (isSellExist) {
        modal.toggle("§f(§cJual§f/§aBeli§f)", true);
    }
    modal.show(player).then(async (res) => {
        if (res.canceled) return;
        if (!res.formValues![0])
            return (
                (await player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§cMasukan jumlah item yang akan dibeli ${
                        isSellExist ? "atau dijual" : ""
                    }"}]}`
                )) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let qty = res.formValues![0] as number;
        if (isNaN(qty))
            return (
                (await player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§cKamu hanya bisa memasukan jumlah item memakai angka"}]}`
                )) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let dataCost = item.cost * qty;
        if ((isSellExist && res.formValues![1]) || !isSellExist) {
            const resp_buy = await MechAPI.buyItem(player, item.itemId, qty);
            if (!resp_buy.status) {
                if (resp_buy.not_enough_money) {
                    player.sendMessage(
                        `§r§l§c[§bM-SHOP§c]§r §cUang kamu saat ini §e${user.money} tidak cukup untuk membeli, butuh §e${dataCost}`
                    );
                } else {
                    player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp_buy.message}`);
                }
                player.playSound("note.bass");
                return;
            }

            player.runCommandAsync(`give @s ${item.item} ${qty} ${item.data}`);
            player.sendMessage(
                `§r§l§c[§bM-SHOP§c]§r §aKamu berhasil membeli §cx${qty} §b${item.name} §aDengan total: §e${dataCost}`
            );
            player.playSound("random.levelup");
        } else {
            const resp_sell = await MechAPI.sellItem(player, item.itemId, qty);
            if (!resp_sell.status) {
                if (resp_sell.not_sell) {
                    player.sendMessage(`§r§l§c[§bM-SHOP§c]§r §cBarang ini tidak untuk dijual`);
                } else {
                    player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp_sell.message}`);
                }
                player.playSound("note.bass");
                return;
            }

            let dataSell = item.sell! * qty;
            player.sendMessage(
                `§r§l§c[§bM-SHOP§c]§r §aKamu berhasil menjual §cx${qty} §b${item.name} §aDengan total: §e${dataSell}`
            );
            player.playSound(`random.levelup`);
        }
    });
}

export async function enchantCatalog(player: Player, itemID: number) {
    const resp_user = await MechAPI.getUser(player);
    if (!resp_user.status) {
        player.sendMessage(`§r§l§e[§MECHA§e]§r §c${resp_user.message}`);
        player.playSound("note.bass");
        return;
    }
    const resp_item = await MechAPI.getShopItem(player, itemID);
    if (!resp_item.status) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp_item.message}`);
        player.playSound("note.bass");
        return;
    }

    const user: MechaPlayer = resp_user.result;
    const item = resp_item.result;
    let modal = new ModalFormData();
    modal.title(`${item.name}`);
    modal.textField(
        `§a-------------------------------\n\n§6Informasi Pemain:\n§fNama: §b${player.nameTag}\n§fUang: §b${user.money}\n\nNote:\n§6Pastikan anda telah memegang item\n\n§a-------------------------------\n\n§fLevel (max: ${item.maxLevel})`,
        `Masukan level enchant`
    );
    modal.show(player).then(async (res) => {
        if (res.canceled) return;

        // const inven = getPlayerInventory(player);
        // player.sendMessage(viewObj(inven));
        // return;
        if (!res.formValues![0]) {
            player.sendMessage(`§r§l§c[§bSHOP§c]§r  §cMasukan level enchant`);
            player.playSound(`note.bass`);
            return;
        }

        let level = res.formValues![0] as number;
        if (isNaN(level)) {
            player.sendMessage(`§r§l§c[§bSHOP§c]§r §cKamu hanya bisa memasukan level memakai angka`);
            player.playSound(`note.bass`);
            return;
        }

        if (level > item.maxLevel) {
            player.sendMessage(`§r§l§c[§bSHOP§c]§r §cLevel maksimal adalah §a${item.maxLevel}.`);
            player.playSound(`note.bass`);
            return;
        }

        let dataCost = item.cost * level;
        const resp_buy = await MechAPI.buyItem(player, item.itemId, level);
        if (!resp_buy.status) {
            if (resp_buy.not_enough_money) {
                player.sendMessage(
                    `§r§l§c[§bSHOP§c]§r §cUang kamu saat ini §e${user.money} tidak cukup untuk membeli, butuh §e${dataCost}`
                );
            } else {
                player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp_buy.message}`);
            }
            player.playSound("note.bass");
            return;
        }

        // Enchant Code
        const result = await player.runCommandAsync(`enchant @s ${item.enchant} ${level}`);
        player.sendMessage(viewObj(result));
        player.sendMessage(
            `§r§l§c[§bSHOP§c]§r §aKamu berhasil membeli enchant §b${item.name} §alevel §c${level} §aDengan total: §e${dataCost}`
        );
        player.playSound("random.levelup");
    });
}

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
