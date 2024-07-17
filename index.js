

const config = require("./config")
const { verifyKey, InteractionType, InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//FUNCTİONS
if (!config.token) throw new Error("TOKEN BELİRTİLMEMİŞ")
if (!config.publicKEY) throw new Error("publicKEY BELİRTİLMEMİŞ")
function VerifyDiscordRequest(clientKey = config.publicKEY) {
    return function (req, res, buf) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');
        console.log(signature, timestamp, clientKey);

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            
            throw new Error('Bad request signature');
        }
    };
}

async function DiscordRequest(endpoint, options) {

    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);

    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${config.token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent':
                'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
        ...options,
    });
    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }
    // return original response
    return res;


}
const { REST } = require("@discordjs/rest");
const {
    Routes,
} = require('discord-api-types/v10');
async function InstallGlobalCommands(appId, commands) {
    const rest = new REST().setToken(config.token);
    const data = await rest.put(
        Routes.applicationCommands(appId),
        { body: commands }
    );
    console.log(data)
    /*
    // API endpoint to overwrite global commands
    const endpoint = `applications/${config.appID}/commands`;

    try {
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
    */
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
//EXPRESS
const express = require("express");
const app = express()
app.use(express.json({ verify: VerifyDiscordRequest(config.publicKEY) }));

app.post('/interactions', async function (req, res) {
    // Interaction type and data
    const { type, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    // Log request bodies
    //console.log(JSON.stringify(req.body, null, 2));

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        if (name == "ben") {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "🎲 **OwO Gamble** 🎲\n\nMerhaba! Sizi Discord sunucumuzda eğlence dolu bir kumarhane deneyimi yaşamaya davet ediyoruz! Burada, şansınızı denemek ve büyük ödüller kazanmak için birçok farklı oyun oynayabilirsiniz.\n\n💰 Neler Sunuyoruz? 💰\n\n**Rulet**: Şansınızı döndürün ve büyük ödüller kazanın!\n**Mayın Tarlası**: Stratejinizi kullanarak mayınlardan kaçının ve kazanın!\n**Crash**: Roket patlamadan paranızı çekin ve kazancınızı katlayın!\n**Zar**: Basit ve eğlenceli zar oyunumuz  ile şansınızı deneyin!\n\n**🎁 Ödüller ve Bonuslar: 🎁**\nKumarhanemizde, her gün farklı çekilişler ile karşınızda!\n\n🔗 Katılmak İçin: \n\nAşağıdaki davet kodunu kullanarak sunucumuza katılabilirsiniz:\n## s7WnEdYvUF\n\n\nHemen katılın ve şansınızı deneyin! 🎉\n-# Çekilişleri kaçırmamak için sunucumuza gelebilirsiniz." // "i am you\nhttps://media1.tenor.com/m/UfSOAygXKN4AAAAC/kurdistan-astolfo-astolfo.gif",
                },
            });
        } else if (name == "kurtce") {
            const data = req.body?.data?.options?.find(x => x?.name == "yazi")?.value;
            if (!data) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Yazı yazmamışsın",
                    },
                });
            }
            if (detect3y3(data)) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Zaten şifreli bu",
                    },
                });
            } else {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: encode3y3(data),
                        embeds: [{ title: "MESAJI KOPYALA ( kopyalayamıyorsan banane )", descripton: encode3y3(data) }]
                    },
                });
            }

        } else if (name == "kkurtce") {
            const data = req.body?.data?.options?.find(x => x?.name == "yazi")?.value;
            if (!data) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Yazı yazmamışsın",
                    },
                });
            }
            if (detect3y3(data)) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Zaten şifreli bu",
                    },
                });
            } else {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: encode3y3(data),
                    },
                });
            }

        } else if (name == "tturkce") {
            const data = req.body?.data?.options?.find(x => x?.name == "yazi")?.value;
            if (!data) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Yazı yazmamışsın",
                    },
                });
            }
            if (!detect3y3(data)) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Zaten deşifreli bu",
                    },
                });
            } else {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: decode3y3(data),
                    },
                });
            }

        } else if (name == "turkce") {
            const data = req.body?.data?.options?.find(x => x?.name == "yazi")?.value;
            if (!data) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Yazı yazmamışsın",
                    },
                });
            }
            if (!detect3y3(data)) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: "Zaten deşifreli bu",
                    },
                });
            } else {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: InteractionResponseFlags.EPHEMERAL,
                        content: decode3y3(data),
                        embeds: [{ title: "MESAJI KOPYALA ( kopyalayamıyorsan banane )", descripton: encode3y3(data) }]
                    },
                });
            }

        }
        /*
                // "leaderboard" command
                if (name === 'leaderboard') {
                    // Send a message into the channel where command was triggered from
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: await getServerLeaderboard(req.body.guild.id),
                        },
                    });
                }
                // "profile" command
                if (name === 'profile') {
                    const profile = getFakeProfile(0);
                    const profileEmbed = createPlayerEmbed(profile);
        
                    // Use interaction context that the interaction was triggered from
                    const interactionContext = req.body.context;
        
                    // Construct `data` for our interaction response. The profile embed will be included regardless of interaction context
                    let profilePayloadData = {
                        embeds: [profileEmbed],
                    };
        
                    // If profile isn't run in a DM with the app, we'll make the response ephemeral and add a share button
                    if (interactionContext !== 1) {
                        // Make message ephemeral
                        profilePayloadData['flags'] = 64;
                        // Add button to components
                        profilePayloadData['components'] = [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: 'Share Profile',
                                        custom_id: 'share_profile',
                                        style: 2,
                                    },
                                ],
                            },
                        ];
                    }
        
                    // Send response
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: profilePayloadData,
                    });
                }
                // "link" command
                if (name === 'link') {
                    // Send a message into the channel where command was triggered from
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content:
                                'Authorize your Quests of Wumpus account with your Discord profile.',
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: 'Link Account',
                                            style: 5,
                                            // If you were building this functionality, you could guide the user through authorizing via your game/site
                                            url: 'https://discord.com/developers/docs/intro',
                                        },
                                    ],
                                },
                            ],
                        },
                    });
                }
                // "wiki" command
                if (name === 'wiki') {
                    const option = data.options[0];
                    const selectedItem = getWikiItem(option.value);
                    // Send a message into the channel where command was triggered from
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: `${selectedItem.emoji} **${selectedItem.name}**: ${selectedItem.description}`,
                        },
                    });
                }
                */
    }

    // handle button interaction
    if (type === InteractionType.MESSAGE_COMPONENT) {
        /*
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [profileEmbed],
            },
        });
        */
    }
});

app.listen(config.PORT, () => {
    console.log('Listening on port', config.PORT);
});


//3y3
function encode3y3(text) {
    const codePoints = [...text].map((c) => c.codePointAt(0));

    const output = [];
    for (const char of codePoints) {
        output.push(
            String.fromCodePoint(
                char + (0x00 < char && char < 0x7f ? 0xe0000 : 0)
            ).toString()
        );
    }

    return output.join("");
};
function decode3y3(text) {
    const codePoints = [...text].map((c) => c.codePointAt(0));

    const output = [];
    for (const char of codePoints) {
        output.push(
            String.fromCodePoint(
                char - (0xe0000 < char && char < 0xe007f ? 0xe0000 : 0)
            ).toString()
        );
    }

    return output.join("");
};

function detect3y3(text) {
    const codePoints = [...text].map((c) => c.codePointAt(0));
    return codePoints.some((c) => 0xe0000 < c && c < 0xe007f);
};
