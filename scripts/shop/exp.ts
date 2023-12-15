import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

export function EXP(player) {
    var money = getScore(player, "money");
    let sell = 500;
    let brick = new ModalFormData()
        .title(`Buy EXP`)
        .textField(
            `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Item Information:\n§6Buy x1 §bEXP Level §6= §c${sell}\n\n§6-------------------------------\n\n§6Jumlah EXP:`,
            `Masukan jumlah Exp Level`
        );
    // .toggle('§6Sell / Buy', true);
    brick.show(player).then(async (res) => {
        if (!res.formValues![0])
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cMasukan username tujuan!"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        if (!res.formValues![0])
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cMasukan jumlah uang yang akan ditransfer"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let qty = res.formValues![0] as number;
        if (isNaN(qty))
            return (
                player.runCommandAsync(
                    `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cHanya bisa input angka!"}]}`
                ) && player.runCommandAsync(`playsound note.bass @s`)
            );
        let level = Number(res.formValues![0]);
        let dataCost = level * sell;
        try {
            await player.runCommandAsync(
                `scoreboard players remove @s[scores={money=${dataCost}..}] money ${dataCost}`
            );
            player.runCommandAsync(`xp ${level}L @s`);
            player.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aKamu berhasil membeli §eEXP Level §aDengan total: §e${dataCost}"}]}`
            );
            player.runCommandAsync(`playsound random.levelup @s`);
        } catch (e) {
            player.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cUang anda tidak mencukupi untuk membeli dengan jumlah §e${dataCost}"}]}`
            );
            player.runCommandAsync(`playsound note.bass @s`);
        }
    });
}

function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective)!.getScore(entity);
    } catch (error) {
        return 0;
    }
}
