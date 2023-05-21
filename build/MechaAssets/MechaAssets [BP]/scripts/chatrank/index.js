import * as utils from "../libs/utils";
import * as menu from "../menu";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
export function checkRank(player) {
    if (player.getTags().join("|").includes("rank:")) {
        const rank = player.getTags().filter((v) => v.includes("rank:"))[0];
        return rank.replace("rank:", "");
    }
    else {
        return "MEMBER|§6|§l";
    }
}
export function changeRank(player, text, color, format) {
    // Remove old rank
    if (player.getTags().join("|").includes("rank:")) {
        let tagRank = player.getTags().filter((v) => v.includes("rank:"))[0];
        player.removeTag(tagRank);
    }
    // Add new rank
    player.addTag(`rank:${text}|${color}|${format}`);
    player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"§r§l§e[§bCHATRANKS§e]§r §aTampilan chat §c${player.nameTag}§a telah diubah menjadi ${color}${format}[${text}]"}]}`);
}
export function ChatRankPlayerManager(player, admin) {
    try {
        let playerRank = checkRank(player).split("|");
        let rankName = playerRank[0];
        let rankColor = playerRank[1];
        let rankFormat = playerRank[2];
        const chatFormat = `${rankColor}${rankFormat}[${rankName}]`;
        let chats = new ModalFormData()
            .title(`Ubah Chat Text ${player.nameTag}`)
            .dropdown(`§6-------------------------------\n\nInfomasi Pengguna:\n§fNama §c: §a${player.nameTag}\n§fFormat §c: §b${chatFormat}\n\n§6-------------------------------\n\n§6Color:`, utils.colorOptions)
            .dropdown(`§6Format:`, utils.formatOptions)
            .textField(`§6Chat Text:`, "Input Text");
        chats.show(admin).then(async (res) => {
            let color = utils.colorOptions[res.formValues[0]].slice(0, 2);
            let format = utils.formatOptions[res.formValues[1]].slice(0, 2);
            let text = res.formValues[2];
            changeRank(player, text, color, format);
        });
    }
    catch (error) {
        admin.sendMessage(utils.viewObj(error));
    }
}
export function ChatManageForm(player, isMenu) {
    try {
        let form = new ActionFormData();
        form.title(`§l§cChatRank §2Manager`);
        form.body(`§6Pilih player untuk mengedit tampilan chat`);
        let players = utils.getPlayers();
        for (let targetPlayer of players) {
            const isOp = targetPlayer.isOp() ||
                targetPlayer.hasTag("paradoxOpped") ||
                targetPlayer.hasTag("admin") ||
                targetPlayer.hasTag("worldedit");
            form.button(targetPlayer.nameTag, isOp ? "textures/ui/op" : "textures/ui/permissions_member_star");
        }
        form.show(player).then((result) => {
            if (isMenu && result.canceled)
                return menu.MenuForm(player);
            if (!result.canceled) {
                if (result.selection < players.length) {
                    ChatRankPlayerManager(players[result.selection], player);
                }
                else {
                    player.sendMessage("§l§6[TPA] §r§cPlayer tidak valid!");
                }
            }
        });
    }
    catch (error) {
        player.sendMessage(utils.viewObj(error));
    }
}
//# sourceMappingURL=index.js.map