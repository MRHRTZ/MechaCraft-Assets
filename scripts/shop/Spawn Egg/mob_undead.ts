import { world } from '@minecraft/server'
import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { SpawnEggs } from './main';

const itemData = [
    {
        textures: 'textures/items/egg_zombie.png',
        name: 'Zombie',
        cost: 85000,
        data: 0,
        item: 'zombie_spawn_egg'
    },
    {
        textures: 'textures/items/egg_zombievillager.png',
        name: 'Zombie Villager',
        cost: 85000,
        data: 0,
        item: 'zombie_villager_spawn_egg'
    },
    {
        textures: 'textures/items/egg_pigzombie.png',
        name: 'Zombie Pigman',
        cost: 85000,
        data: 0,
        item: 'zombie_pigman_spawn_egg'
    },
    {
        textures: 'textures/items/egg_skeleton.png',
        name: 'Skeleton',
        cost: 85000,
        data: 0,
        item: 'skeleton_spawn_egg'
    },
    {
        textures: 'textures/items/egg_creeper.png',
        name: 'Creeper',
        cost: 85000,
        data: 0,
        item: 'creeper_spawn_egg'
    },
    {
        textures: 'textures/items/egg_spider.png',
        name: 'Spider',
        cost: 85000,
        data: 0,
        item: 'spider_spawn_egg'
    },
    {
        textures: 'textures/items/egg_cave_spider.png',
        name: 'Cave Spider',
        cost: 85000,
        data: 0,
        item: 'cave_spider_spawn_egg'
    },
    {
        textures: 'textures/items/egg_slime.png',
        name: 'Slime',
        cost: 85000,
        data: 0,
        item: 'slime_spawn_egg'
    },
    {
        textures: 'textures/items/egg_enderman.png',
        name: 'Enderman',
        cost: 85000,
        data: 0,
        item: 'enderman_spawn_egg'
    },
    {
        textures: 'textures/items/egg_vindicator.png',
        name: 'Vindicator',
        cost: 85000,
        data: 0,
        item: 'vindicator_spawn_egg'
    },
    {
        textures: 'textures/items/egg_evoker.png',
        name: 'Evoker',
        cost: 85000,
        data: 0,
        item: 'evoker_spawn_egg'
    },
    {
        textures: 'textures/items/egg_pillager.png',
        name: 'Pillager',
        cost: 85000,
        data: 0,
        item: 'pillager_spawn_egg'
    },
    {
        textures: 'textures/items/egg_ravager.png',
        name: 'Ravager',
        cost: 85000,
        data: 0,
        item: 'ravager_spawn_egg'
    },
    {
        textures: 'textures/items/egg_wither.png',
        name: 'Wither Skeleton',
        cost: 85000,
        data: 0,
        item: 'wither_skeleton_spawn_egg'
    }
]

export function UndeadMob(player) {
    const shop = new ActionFormData();
    shop.title(`Undead Mob`);
    shop.body(`§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(player, 'money')}\n\n§b-------------------------------`)
    for (const item of itemData)
        shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then(result => {
        if (result.canceled) return SpawnEggs(player);
        const item = itemData[result.selection!];
        var money = getScore(player, "money")
        let brick = new ModalFormData()
            .title(`${item.name}`)
            .textField(`§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Item Information:\n§6Buy x1 §b${item.name} §6= §c${item.cost}\n\n§6-------------------------------\n\n§6Amount:`, `The Amount you want to Buy`)
        brick.show(player).then(async res => {
            let dataCost = item.cost * res.formValues![0];
            if (!res.formValues![0]) return player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cMasukan jumlah item yang akan dibeli"}]}`) && player.runCommandAsync(`playsound note.bass @s`)
            if (isNaN(res.formValues![0])) return player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cKamu hanya bisa memasukan jumlah item memakai angka"}]}`) && player.runCommandAsync(`playsound note.bass @s`)
            if (!isNaN(res.formValues![0])) {
                let action = await player.runCommandAsync(`scoreboard players remove @s[scores={money=${dataCost}..}] money ${dataCost}`);
                if (action.successCount) {
                    player.runCommandAsync(`give @s ${item.item} ${res.formValues![0]} ${item.data}`);
                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aKamu berhasil membeli §cx${res.formValues![0]} §b${item.name} §aDengan total: §e${dataCost}"}]}`);
                    player.runCommandAsync(`playsound random.levelup @s`)
                } else {
                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cUang kamu tidak cukup, butuh §e${dataCost}"}]}`);
                    player.runCommandAsync(`playsound note.bass @s`)
                }
            }
        })
    }
    )
}

function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    } catch (error) {
        return 0;
    }
}