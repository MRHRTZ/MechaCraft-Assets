import { world } from '@minecraft/server'
import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { SpawnEggs } from './main';

const itemData = [
    {
        textures: 'textures/items/egg_glow_squid.png',
        name: 'Allay',
        cost: 75000,
        data: 0,
        item: 'allay_spawn_egg'
    },
    {
        textures: 'textures/items/egg_cat.png',
        name: 'Cat',
        cost: 75000,
        data: 0,
        item: 'cat_spawn_egg'
    },
    {
        textures: 'textures/items/egg_clownfish.png',
        name: 'Clownfish',
        cost: 75000,
        data: 0,
        item: 'tropical_fish_spawn_egg'
    },
    {
        textures: 'textures/items/egg_chicken.png',
        name: 'Chicken',
        cost: 75000,
        data: 0,
        item: 'chicken_spawn_egg'
    },
    {
        textures: 'textures/items/egg_sheep.png',
        name: 'Sheep',
        cost: 75000,
        data: 0,
        item: 'sheep_spawn_egg'
    },
    {
        textures: 'textures/items/egg_cow.png',
        name: 'Cow',
        cost: 75000,
        data: 0,
        item: 'cow_spawn_egg'
    },
    {
        textures: 'textures/items/egg_pig.png',
        name: 'Pig',
        cost: 75000,
        data: 0,
        item: 'pig_spawn_egg'
    },
    {
        textures: 'textures/items/egg_mushroomcow.png',
        name: 'Mooshroom',
        cost: 100000,
        data: 0,
        item: 'mooshroom_spawn_egg'
    },
    {
        textures: 'textures/items/egg_horse.png',
        name: 'Horse',
        cost: 75000,
        data: 0,
        item: 'horse_spawn_egg'
    },
    {
        textures: 'textures/items/egg_parrot.png',
        name: 'Parrot',
        cost: 75000,
        data: 0,
        item: 'parrot_spawn_egg'
    },
    {
        textures: 'textures/items/egg_rabbit.png',
        name: 'Rabbit',
        cost: 75000,
        data: 0,
        item: 'rabbit_spawn_egg'
    },
    {
        textures: 'textures/items/egg_wolf.png',
        name: 'Wolf',
        cost: 75000,
        data: 0,
        item: 'wolf_spawn_egg'
    },
    {
        textures: 'textures/items/egg_panda.png',
        name: 'Panda',
        cost: 75000,
        data: 0,
        item: 'panda_spawn_egg'
    },
    {
        textures: 'textures/items/egg_bee.png',
        name: 'Bee',
        cost: 75000,
        data: 0,
        item: 'bee_spawn_egg'
    },
    {
        textures: 'textures/items/egg_fox.png',
        name: 'Fox',
        cost: 75000,
        data: 0,
        item: 'fox_spawn_egg'
    },
    {
        textures: 'textures/items/egg_polarbear.png',
        name: 'Polar Bear',
        cost: 75000,
        data: 0,
        item: 'polar_bear_spawn_egg'
    },
    {
        textures: 'textures/items/egg_villager.png',
        name: 'Villager',
        cost: 150000,
        data: 0,
        item: 'villager_spawn_egg'
    }
]

export function AnimalMob(player) {
    const shop = new ActionFormData();
    shop.title(`Animal Mob`);
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