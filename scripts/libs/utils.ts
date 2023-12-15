import { world } from "@minecraft/server";
import { faktaText } from "./fakta";

class Notes {
    note = "";
    constructor(note: string) {
        this.note = note;
    }
    set(note: string) {
        this.note = note;
    }
    get() {
        return this.note;
    }
}

const viewObj = (() => {
    const AsyncFunction = (async () => {}).constructor,
        GeneratorFunction = function* () {}.constructor,
        AsyncGeneratorFunction = async function* () {}.constructor,
        GeneratorObjCst = (function* () {})().constructor,
        AsyncGeneratorObjCst = (async function* () {})().constructor,
        ArrayIteratorObj = Object.getPrototypeOf(new Set().values()),
        SetIteratorObj = Object.getPrototypeOf(new Set().values()),
        MapIteratorObj = Object.getPrototypeOf(new Map().values());
    Object.defineProperty(GeneratorObjCst, "name", { value: "Generator" });
    Object.defineProperty(AsyncGeneratorObjCst, "name", { value: "AsyncGenerator" });
    const excludeProtoKeys = {
        oc: [GeneratorObjCst, AsyncGeneratorObjCst, Promise],
        op: [ArrayIteratorObj, SetIteratorObj, MapIteratorObj],
        o: [(o) => o instanceof Error],
    };
    const strFormatKeys = Object.setPrototypeOf(
            {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                f: 0,
                g: 0,
                r: 0,
                l: 0,
                o: 0,
            },
            null
        ),
        strEscDict = Object.setPrototypeOf(
            {
                "\t": "TAB",
                "\v": "VTAB",
                "\r": "CR",
                "\n": "LF",
                "\f": "FF",
                "\0": "NUL",
                "\ufffe": "U+FFFE",
                "\uffff": "U+FFFF",
            },
            null
        );
    const fnHead = (o, oc) => {
        const fName = o.name || "<anonymous>",
            fLoc = o.fileName ? `${o.fileName}:${o.lineNumber}` : "<native>",
            notClass = Object.getOwnPropertyDescriptor(o, "prototype")?.writable ?? true,
            asyncText = oc == AsyncFunction || oc == AsyncGeneratorFunction ? "Async" : "",
            generatorText = oc == GeneratorFunction || oc == AsyncGeneratorFunction ? "Generator" : "",
            prototypeOf = Object.getPrototypeOf(o),
            extendsClass = prototypeOf instanceof Function;
        return notClass
            ? `§e[${asyncText}${generatorText}Function: ${fName} (${fLoc})]§r`
            : `§b[Class: ${fName}${
                  extendsClass
                      ? ` (extends: ${fnHead(prototypeOf, prototypeOf.constructor).replace(/\u00a7./g, "")})`
                      : ""
              } (${fLoc})]§r`;
    };
    const getKeys = (o, op = Object.getPrototypeOf(o), getPrototypeKeys = true, excludeKeys: string[] = []) => {
        let keys = Reflect.ownKeys(o);
        if (getPrototypeKeys) keys = keys.concat(Reflect.ownKeys(op ?? {}));
        let keysSet = new Set(keys);
        for (const ek of excludeKeys) keysSet.delete(ek);
        return Array.from(keysSet, (k) => {
            const descriptor = Object.getOwnPropertyDescriptor(o, k) ?? Object.getOwnPropertyDescriptor(op, k),
                isGet = !!descriptor?.get,
                isSet = !!descriptor?.set;
            return {
                key: k,
                isGet,
                isSet,
            };
        });
    };
    const formatKey = (k, isGet = false, isSet = false) =>
        `${typeof k == "symbol" ? "§a" : k[0] == "_" ? "§7" : ""}${String(k)}${
            isGet && isSet ? " §b[Get/Set]§r " : isGet ? " §b[Get]§r " : isSet ? " §b[Set]§r " : ""
        }§r`;
    const exec = (o, stack, tab, tabLevel, tabSeparator) => {
        if (stack.includes(o)) return `§b[Circular]§r`;
        if (o == null) return `§8${o}§r`;
        const nStack = stack.concat([o]),
            cTab = tab.repeat(tabLevel),
            nTab = tab.repeat(tabLevel + 1),
            nTabLvl = tabLevel + 1,
            execNext = (k, obj) => {
                try {
                    return exec(obj ?? (k ? o[String(k)] : obj), nStack, tab, nTabLvl, tabSeparator);
                } catch (e) {
                    return `§c[Error]§r`;
                }
            };
        const op = Object.getPrototypeOf(o),
            oc = op?.constructor;
        switch (oc) {
            case String:
                return `§7"§r${o.replace(/[\t\r\n\v\f\0\ufffe\uffff]|§./g, ([v, a]) =>
                    v == "§"
                        ? a in strFormatKeys
                            ? `§a[S${a}]§r`
                            : `§7[S${a == "§" ? "S" : a}]§r`
                        : `§d[${strEscDict[v]}]§r`
                )}§7"§r`;
            case Number:
            case Boolean:
                return `§a${o}§r`;
            case RegExp:
                return `§c${o}§r`;
            case Symbol:
                return `§b${String(o)}§r`;
            case Function:
            case AsyncFunction:
            case GeneratorFunction:
            case AsyncGeneratorFunction: {
                const out = [fnHead(o, oc)];
                const keys = getKeys(o, op, false, ["length", "name", "prototype", "arguments", "caller"]);
                if (keys.length) {
                    out[0] += " {";
                    for (const { key, isGet, isSet } of keys)
                        out.push(`${nTab}${tabSeparator}${formatKey(key, isGet, isSet)}: ${execNext(key, null)}`);
                    out.push(`${cTab}${tabSeparator}}`);
                }
                return out.join("\n");
            }
            case Array: {
                if (!o.length) return `[] §7Array<${o.length}>§r`;
                const out = [`[ §7Array<${o.length}>§r`];
                let exclude = Object.create(null);
                for (const k in o) {
                    exclude[k] = 0;
                    out.push(`${nTab}${tabSeparator}${formatKey(k)}: ${execNext(k, null)}`);
                }
                for (let i = 0; i < o.length; i++)
                    if (i in o && !(i in exclude))
                        out.push(`${nTab}${tabSeparator}${i} §7[F]§r : ${execNext(i, null)}`);
                out.push(`${cTab}${tabSeparator}]`);
                return out.join("\n");
            }
            case Set: {
                if (!o.size) return `[] §7Set<${o.size}>§r`;
                const out = [`[ §7Set<${o.size}>§r`];
                for (const v of o) out.push(`${nTab}${tabSeparator}§l=>§r ${execNext(null, v)}`);
                out.push(`${cTab}${tabSeparator}]`);
                return out.join("\n");
            }
            case Map: {
                if (!o.size) return `{} §7Map<${o.size}>§r`;
                const out = [`{ §7Map<${o.size}>§r`];
                for (const [k, v] of o)
                    out.push(`${nTab}${tabSeparator}§l=>§r ${execNext(null, k)} -> ${execNext(null, v)}`);
                out.push(`${cTab}${tabSeparator}}`);
                return out.join("\n");
            }
            default: {
                let name =
                        oc == null
                            ? `[${o[String(Symbol.toStringTag)] ?? "Object"}: null prototype]`
                            : oc != Object
                            ? oc.name
                            : Symbol.toStringTag in o
                            ? `Object [${o[String(Symbol.toStringTag)]}]`
                            : "",
                    getPrototypeKeys = !(
                        oc == Object ||
                        excludeProtoKeys.o.some((fn) => fn(o)) ||
                        excludeProtoKeys.oc.some((v) => oc == v) ||
                        excludeProtoKeys.op.some((v) => op == v)
                    ),
                    excludeKeys = oc != Object ? ["constructor"] : [];
                const keys = getKeys(o, op, getPrototypeKeys, excludeKeys);
                if (!keys.length) return `{} §7${name}§r`;
                const out = [`{ §7${name}§r`];
                for (const { key, isGet, isSet } of keys)
                    out.push(`${nTab}${tabSeparator}${formatKey(key, isGet, isSet)}: ${execNext(key, null)}`);
                out.push(`${cTab}${tabSeparator}}`);
                return out.join("\n");
            }
        }
    };
    return (o, tab = " §8:§r ", tabSeparator = " ") => exec(o, [], tab, 0, tabSeparator);
})();

const capitalizeLetter = (str) => {
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
};

const letter2Id = (str) => {
    return "minecraft:" + str.toLowerCase().replace(/ /g, "_");
};

const getInventory = (nameTag, itemIdOnly = false) => {
    let container = getPlayer(nameTag)?.getComponent("inventory").container;
    let inventory = [
        ...Array.from(Array(container.size), (_a, i) => {
            const item = container.getItem(i);
            if (item) return item;
        }),
    ]
        .filter((v) => v != undefined)
        .map((v) => {
            if (itemIdOnly && v.typeId.includes("minecraft")) {
                return capitalizeLetter(v.typeId.replace(/minecraft:/g, "").replace(/_/g, " "));
            } else {
                return v;
            }
        });
    return inventory;
};

const getPlayer = (nameTag) => {
    let players: any = null;
    for (let player of world.getAllPlayers()) {
        if (player.nameTag == nameTag) players = player;
    }
    return players;
};

const getPlayers = (onlyNameTag = false) => {
    let players: any = [];
    for (let player of world.getAllPlayers()) {
        if (onlyNameTag) {
            players.push(player.nameTag);
        } else {
            players.push(player);
        }
    }
    return players;
};

const isPlayerExist = (nameTag) => {
    let players: any = [];
    for (let player of world.getAllPlayers()) {
        players.push(player.nameTag);
    }

    return players.includes(nameTag);
};

const getScore = (entity, objective) => {
    try {
        return world.scoreboard.getObjective(objective)!.getScore(entity) ?? 0;
    } catch (error) {
        return 0;
    }
};

function setScore(entity, objective, score) {
    return world.scoreboard.getObjective(objective)!.setScore(entity, score);
}

function addScore(entity, objective, score) {
    let scoreOld = getScore(entity, objective);
    return world.scoreboard.getObjective(objective)!.setScore(entity, scoreOld + score);
}

function removeScore(entity, objective, score) {
    let scoreOld = getScore(entity, objective);
    return world.scoreboard.getObjective(objective)!.setScore(entity, scoreOld - score);
}

const shopBodyInfo = (player) => {
    return `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
        player,
        "money"
    )}\n\n§b-------------------------------`;
};

const colorOptions = [
    "§0Black",
    "§1Dark Blue",
    "§2Dark Green",
    "§3Dark Aqua",
    "§4Dark Red",
    "§5Dark Purple",
    "§6Gold",
    "§7Gray",
    "§8Dark Gray",
    "§9Blue",
    "§aGreen",
    "§bAqua",
    "§cRed",
    "§dLight Purple",
    "§eYellow",
    "§fWhite",
];

const formatOptions = [
    "§rPlain",
    "§kObfuscated",
    "§lBold",
    // '§mStrikeTrough',
    // '§nUnderline',
    "§oItalic",
];

const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return [hrs, mins, secs, ms];
}

function timeToDay(gametime) {
    let gameday = {
        Day: 1000,
        Noon: 6000,
        Sunset: 12000,
        Night: 13000,
        Midnight: 18000,
        Sunrise: 23000,
    };

    if (gametime <= gameday.Day) {
        return "Pagi";
    } else if (gametime > gameday.Day && gametime <= gameday.Noon) {
        return "Pagi hari";
    } else if (gametime > gameday.Noon && gametime <= gameday.Sunset) {
        return "Siang";
    } else if (gametime > gameday.Sunset && gametime <= gameday.Night) {
        return "Sore - Terbenam";
    } else if (gametime > gameday.Night && gametime <= gameday.Midnight) {
        return "Malam";
    } else if (gametime > gameday.Midnight && gametime <= gameday.Sunrise) {
        return "Dinihari";
    } else if (gametime >= gameday.Sunrise) {
        return "Pagi - terbit";
    }
}

function getRandomFakta() {
    return faktaText[Math.floor(Math.random() * faktaText.length)];
}

function getRandomColor() {
    let colors = ["§a", "§b", "§2", "§f"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRawDateNow(gmtOffset = 7) {
    // Indonesia date format
    var now = new Date();
    return new Date(now.setUTCHours(now.getHours() + gmtOffset));
}

function getTimeNow(date) {
    return `${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date
        .getSeconds()
        .toString()
        .padStart(2, 0)}`;
}

function getDateNow(date) {
    return `${date.getDate().toString().padStart(2, 0)} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

function showErrorToOP(e: Error | any) {
    for (let player of world.getPlayers()) {
        if (player.isOp() || player.hasTag("admin")) {
            player.sendMessage("Error: " + viewObj(e));
        }
    }
}

function isEmptyOrSpaces(str) {
    return !str || str.match(/^ *$/) !== null;
}

export {
    Notes,
    viewObj,
    isPlayerExist,
    getPlayer,
    getInventory,
    capitalizeLetter,
    letter2Id,
    getPlayers,
    getScore,
    setScore,
    addScore,
    removeScore,
    shopBodyInfo,
    msToTime,
    timeToDay,
    colorOptions,
    formatOptions,
    hari,
    bulan,
    getRandomColor,
    getRandomFakta,
    getRawDateNow,
    getTimeNow,
    getDateNow,
    showErrorToOP,
    isEmptyOrSpaces,
};
