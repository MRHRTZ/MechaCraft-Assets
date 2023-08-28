import { Player, world } from "@minecraft/server";

export const GUILD_ROLE: string[] = ["LEADER", "MODERATOR", "MEMBER"];

export function checkGuild(player: Player) {
    if (player.getTags().join("|").includes("guild:")) {
        const guild = player.getTags().filter((v) => v.includes("guild:"))[0];
        return guild.replace("guild:", ""); // Format: ROLE|NAME
    } else {
        return false;
    }
}

export function createGuild(player: Player) {
    if (player.getTags().join("|").includes("guild:")) {
        const guild = player.getTags().filter((v) => v.includes("guild:"))[0];
        const guild_obj = guild.replace("guild:", "");
        if (!guild_obj) {
        } else {
            player.sendMessage(`§l§6[GUILD] §r§cPlayer tidak valid!`);
        }
    } else {
        return false;
    }
}

export function changeGuild(player: Player) {
    if (player.getTags().join("|").includes("guild:")) {
        const guild = player.getTags().filter((v) => v.includes("guild:"))[0];
        return guild.replace("guild:", "");
    } else {
        return false;
    }
}
