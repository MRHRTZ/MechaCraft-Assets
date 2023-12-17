import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { getPlayerByName } from "../libs/utils";

// import { BuildingBlocks } from "./Building Block/main";
// import { NaturalBlocks } from "./Natural Block/main";
// import { FunctionalBlocks } from "./Functional Block/main";
// import { RedstoneTools } from "./Redstone Tool/main";
// import { EquipmentsUtilities } from "./Equipment Utilities/main";
// import { FoodsFarms } from "./Food Farm/main";
// import { Dyes } from "./Dyes/main";
// import { Ores } from "./Ores/main";
// import { MobDrops } from "./Mob Drop/main";
// import { SpawnEggs } from "./Spawn Egg/main";
// import { Potions } from "./Potion/main";
// import { Enchantments } from "./Enchantment/main";
// import { EXP } from "./exp";
import MechAPI from "../libs/mechapi";
import { enchantCatalog, itemCatalog } from "./itemForm";
import { MechaPlayer } from "../libs/types";

export async function ShopUI(player) {
    const shopui = new ActionFormData();
    shopui.title(`§l§cMecha §bOfficial §6Shop`);
    // .button(`Transfer`, "textures/ui/trade_icon")
    // .button(`Building Blocks`, "textures/blocks/brick")
    // .button(`Natural Blocks`, "textures/blocks/grass_side_carried")
    // .button(`Functional Blocks`, "textures/blocks/crafting_table_front")
    // .button(`Redstone Tools`, "textures/items/redstone_dust")
    // .button(`Equipments & Utilites`, "textures/items/diamond_axe")
    // .button(`Foods & Farms`, "textures/items/apple_golden")
    // .button(`Dyes`, "textures/items/dye_powder_red")
    // .button(`Ores`, "textures/items/diamond")
    // .button(`Mob Drops`, "textures/items/leather")
    // .button(`Spawn Eggs`, "textures/items/egg_chicken")
    // .button(`Potions`, "textures/items/potion_bottle_heal")
    // .button(`Enchantment`, "textures/items/book_enchanted")
    // .button(`EXP`, "textures/items/experience_bottle");
    const resp = await MechAPI.getShopCategory(player);
    if (!resp.status) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp.message}`);
        player.playSound("note.bass");
    }

    const categories = resp.result;

    if (categories.length == 0) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §6Toko ini belum mempunyai barang yang dijual, silahkan hubungi admin.`);
        player.playSound("note.bass");
    }

    for (const category of categories) {
        shopui.button(category.name, category.texture);
    }
    shopui.show(player).then((result) => {
        if (result.canceled) return;
        const category = categories[result.selection!];
        if (["ITEM", "ENCHANT"].includes(category.type)) {
            shopItem(player, category.categoryID);
        } else if (category.type == "TRANSFER") {
            Transfer(player);
        }
        // if (result.selection == 0) {
        //     Transfer(player);
        // }
        // if (result.selection == 1) {
        //     BuildingBlocks(player);
        // }
        // if (result.selection == 2) {
        //     NaturalBlocks(player);
        // }
        // if (result.selection == 3) {
        //     FunctionalBlocks(player);
        // }
        // if (result.selection == 4) {
        //     RedstoneTools(player);
        // }
        // if (result.selection == 5) {
        //     EquipmentsUtilities(player);
        // }
        // if (result.selection == 6) {
        //     FoodsFarms(player);
        // }
        // if (result.selection == 7) {
        //     Dyes(player);
        // }
        // if (result.selection == 8) {
        //     Ores(player);
        // }
        // if (result.selection == 9) {
        //     MobDrops(player);
        // }
        // if (result.selection == 10) {
        //     SpawnEggs(player);
        // }
        // if (result.selection == 11) {
        //     Potions(player);
        // }
        // if (result.selection == 12) {
        //     Enchantments(player);
        // }
        // if (result.selection == 13) {
        //     EXP(player);
        // }
    });
}

export async function shopItem(player: Player, categoryID: number) {
    const itemui = new ActionFormData();
    itemui.title(`§l§cMecha §bOfficial §6Shop`);
    const resp = await MechAPI.getShopItems(player, categoryID);
    if (!resp.status) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §c${resp.message}`);
        player.playSound("note.bass");
    }
    const items = resp.result;
    if (items.length == 0) {
        player.sendMessage(`§r§l§e[§SHOP§e]§r §6Barang untuk kategori ini tidak tersedia`);
        player.playSound("note.bass");
    }

    for (const item of items) {
        itemui.button(item.name, item.texture);
    }
    itemui.show(player).then((result) => {
        if (result.canceled) return;
        const item = items[result.selection!];
        if (!item.enchant) {
            itemCatalog(player, item.itemId);
        } else {
            enchantCatalog(player, item.itemId);
        }
    });
}

export async function Transfer(player: Player) {
    const resp_user = await MechAPI.getUser(player);
    if (!resp_user.status) {
        player.sendMessage(`§r§l§e[§MECHA§e]§r §c${resp_user.message}`);
        player.playSound("note.bass");
        return;
    }

    const resp_users = await MechAPI.getUsers(player);
    if (!resp_user.status) {
        player.sendMessage(`§r§l§e[§MECHA§e]§r §c${resp_user.message}`);
        player.playSound("note.bass");
        return;
    }

    const user: MechaPlayer = resp_user.result;
    const users: MechaPlayer[] = resp_users.result;

    let playersActive = users
        .map((v) => v.name)
        .filter((v) => v != user.name)
        .join(" §c|§b ");
    let brick = new ModalFormData()
        .title(`Transfer Uang`)
        .textField(
            `§a-------------------------------\n\n§6Informasi Pemain:\n§fNama: §b${player.nameTag}\n§fUang: §a${user.money}\n§fDaftar Pemain: §b${playersActive}\n\n§a-------------------------------\n\n§6Nama Pemain:`,
            `Masukan tujuan nama transfer`
        )
        .textField("§6Jumlah:", "Jumlah uang yang akan di transfer");
    brick.show(player).then(async (res) => {
        if (res.canceled) return;
        if (!res.formValues![0])
            return (
                (await player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cMasukan nama tujuan!"}]}`
                )) && player.runCommandAsync(`playsound note.bass @s`)
            );
        if (!res.formValues![1])
            return (
                (await player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cMasukan jumlah uang yang akan ditransfer"}]}`
                )) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let amount = res.formValues![1] as number;
        if (isNaN(amount))
            return (
                (await player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bTRANSFER§c]§r §cHanya bisa input angka!"}]}`
                )) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let playerName = res.formValues![0];

        const targetUser = users.filter((v) => v.name == playerName)[0];
        if (!targetUser) {
            player.sendMessage(`§r§l§c[§bTRANSFER§c]§r §cPemain dengan nama §e${playerName} §ctidak ditemukan.`);
            player.playSound("note.bass");
            return;
        }

        const resp_sell = await MechAPI.transfer(player, targetUser.name, amount);
        if (!resp_sell.status) {
            if (resp_sell.not_enough_money) {
                player.sendMessage(
                    `§r§l§c[§bTRANSFER§c]§r §cUang kamu saat ini §e${user.money} tidak cukup untuk transfer.`
                );
            } else {
                player.sendMessage(`§r§l§e[§TRANSFER§e]§r §c${resp_sell.message}`);
            }
            player.playSound("note.bass");
            return;
        }

        player.sendMessage(`§r§l§c[§bTRANSFER§c]§r §aBerhasil transfer ke §e${playerName} §asebanyak §e${amount}`);
        player.playSound(`random.toast`);

        const targetPlayer = getPlayerByName(targetUser.name);
        if (targetPlayer) {
            targetPlayer.sendMessage(
                `§r§l§c[§bTRANSFER§c]§r §aAnda telah ditransfer oleh §e${player.nameTag} §asebanyak §e${amount}`
            );
            targetPlayer.playSound(`random.toast`);
        }
    });
}
