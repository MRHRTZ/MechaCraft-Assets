import { world, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

import {
    viewObj,
    getScore,
    timeToDay,
    capitalizeLetter,
    getDateNow,
    getRandomColor,
    getRandomFakta,
    getRawDateNow,
    addScore,
    Notes,
} from "../libs/utils";

export let note = new Notes("Join Server | bit.ly/MechaCraft");
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

export function RunningTextForm(player) {
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

export function ScoreboardManager(player) {
    try {
        let chats = new ModalFormData()
            .title(`§l§aPapan §cinfo`)
            .toggle(`§6Perlihatkan papan info`, checkScoreboard(player));
        chats.show(player).then(async (res) => {
            let score = res.formValues![0] as boolean;
            toggleScoreboard(player, score);
        });
    } catch (error) {
        player.sendMessage(viewObj(error));
    }
}

export function showScoreboard(player: Player, time: number) {
    let money = getScore(player, "money");
    let isScoreShow = checkScoreboard(player);

    let screenDisplay = `
        §¶§l§cMecha§aCraft§r

 §fHari ke   §c: §6${Math.floor(world.getAbsoluteTime() / 24000) + 1}
 §fWaktu     §c: §d${timeToDay(time)}
 §fNama      §c: §e${player.nameTag}
 §fUang      §c: §a${money}
 §fKoor      §c: §7${Object.values(player.location)
     .map((v) => Math.ceil(v))
     .join(" ")}
 §fDimensi   §c: §b${capitalizeLetter(player.dimension.id.replace("minecraft:", "").replace("_", " "))}
 §fTanggal   §c: §6${getDateNow(getRawDateNow())}

 §r§f> §7§o${note.get()}

${runningTextGlobal.length > 0 ? "§r§6| §o§f" + runningTextGlobal[0] + "\n " : ""}`;
    if (runningTextGlobal.length > 0) {
        runningTextGlobal = runningTextGlobal.slice(1);
    }

    player.runCommandAsync(`title @s actionbar ${isScoreShow ? screenDisplay : ""}`);
    // player.onScreenDisplay.setTitle(isScoreShow ? screenDisplay : "");
    if (!isScoreShow) player.onScreenDisplay.setTitle("");
}

export function messageInfo(player: Player) {
    let message = [
        "§r§l§c[§eMecha Info§c]§r §a Untuk perintah server silahkan ketik §b.help",
        "§r§l§c[§eMecha Info§c]§r §a Setiap pergantian hari anda akan mendapatkan uang 50-200",
        "§r§l§c[§eMecha Info§c]§r §6 Jgn lupa follow instagram admin §a@hanif_az.sq.61 §6& §a@sgt_prstyo",
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
        `§r§l§c[§eMecha Facts§c]§r ${getRandomColor()} ${getRandomFakta()}`,
    ];
    player.sendMessage(`${message[Math.floor(Math.random() * message.length)]}`);
}

export async function giftPlayer(player: Player) {
    let randomAmount = Math.floor(Math.random() * 200) + 50;
    addScore(player, "money", randomAmount);
    player.sendMessage(`§r§l§c[§bGIFT§c]§r §cSelamat Pagi §aKamu mendapatkan §eUang §asebesar §e${randomAmount}`);
    player.playSound("random.toast");
}

export function NotesManager(player) {
    try {
        let textmgr = new ModalFormData().title(`§l§aNotes §cmanager`).textField(`§6Masukan teks`, "Teks...");
        textmgr.show(player).then(async (res) => {
            let text = res.formValues![0] as string;
            note.set(text);
        });
    } catch (error) {
        player.sendMessage(viewObj(error));
    }
}
