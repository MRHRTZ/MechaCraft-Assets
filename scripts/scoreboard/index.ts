import { world, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

import * as utils from "../libs/utils";

let runningTextGlobal: any = [];

export function runningTextGenerate(text, endOffset = 26) {
    let msgRun: any = [];
    for (let j = 0; j < endOffset; j++) {
        let firstText = text.slice(0, j).padStart(endOffset, " ");
        msgRun.push(firstText);
    }
    for (let i = 0; i < text.length; i++) {
        let runText = text.slice(i, endOffset);
        msgRun.push(runText);
        let isEnd = i + 1 == text.length;
        if (isEnd) {
            endOffset -= i;
        } else {
            endOffset += 1;
        }
    }

    return msgRun;
}

export function RunningTextForm(player, isMenu) {
    let runningText = new ModalFormData().title(`Running Text Sender`).textField(`§6Masukan text:`, "Your Text");
    runningText.show(player).then(async (res) => {
        let runText = res.formValues![0];
        runningTextGlobal.push(...runningTextGenerate(runText, 20));
    });
}

export function checkScoreboard(player: Player) {
    if (player.getTags().join("|").includes("scoreboard:")) {
        const rank = player.getTags().filter((v) => v.includes("scoreboard:"))[0];
        return rank.replace("scoreboard:", "") == "true";
    } else {
        return false;
    }
}

export function toggleScoreboard(player: Player, boolean: Boolean) {
    // Remove old scoreboard
    if (player.getTags().join("|").includes("scoreboard:")) {
        let tagListSB = player.getTags().filter((v) => v.includes("scoreboard:"));
        for (let playerTag of tagListSB) {
            player.removeTag(playerTag);
        }
    }
    // update scoreboard
    player.addTag("scoreboard:" + boolean);
}

export function ScoreboardManager(player, isMenu) {
    try {
        let chats = new ModalFormData()
            .title(`§l§aPapan §cinfo`)
            .toggle(`§6Perlihatkan papan info`, checkScoreboard(player));
        chats.show(player).then(async (res) => {
            let score = res.formValues![0];
            toggleScoreboard(player, score);
        });
    } catch (error) {
        player.sendMessage(utils.viewObj(error));
    }
}

export function showScoreboard(player: Player) {
    let money = utils.getScore(player, "money");
    let time = world.getTime();
    let isScoreShow = checkScoreboard(player);

    let screenDisplay = `
           §¶§l§cMecha§aCraft§r

 §fHari ke   §c: §6${Math.floor(world.getAbsoluteTime() / 24000) + 1}
 §fWaktu     §c: §d${utils.timeToDay(time)} §f[§7${time}§f]
 §fNama      §c: §e${player.nameTag}
 §fUang      §c: §a${money}
 §fKoor      §c: §7${Object.values(player.location)
     .map((v) => Math.ceil(v))
     .join(" ")}
 §fDimensi   §c: §b${utils.capitalizeLetter(player.dimension.id.replace("minecraft:", "").replace("_", " "))}
 §fTanggal   §c: §6${utils.getDateNow(utils.getRawDateNow())}

 §r§f> §7§ohttps://realms.gg/6yuEJVdTo7k

${runningTextGlobal.length > 0 ? "§r§6| §o§f" + runningTextGlobal[0] + "\n " : ""}`;
    if (runningTextGlobal.length > 0) {
        runningTextGlobal = runningTextGlobal.slice(1);
    }

    player.onScreenDisplay.setTitle(isScoreShow ? screenDisplay : "");
    if (!isScoreShow) player.onScreenDisplay.clearTitle();
}
