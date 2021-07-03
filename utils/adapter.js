"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiscordJSAdapter = void 0;
var discord_js_1 = require("discord.js");
var adapters = new Map();
var trackedClients = new Set();
/**
 * Tracks a Discord.js client, listening to VOICE_SERVER_UPDATE and VOICE_STATE_UPDATE events.
 * @param client - The Discord.js Client to track
 */
function trackClient(client) {
    if (trackedClients.has(client))
        return;
    trackedClients.add(client);
    client.ws.on(discord_js_1.Constants.WSEvents.VOICE_SERVER_UPDATE, function (payload) {
        var _a;
        (_a = adapters.get(payload.guild_id)) === null || _a === void 0 ? void 0 : _a.onVoiceServerUpdate(payload);
    });
    client.ws.on(discord_js_1.Constants.WSEvents.VOICE_STATE_UPDATE, function (payload) {
        var _a, _b;
        if (payload.guild_id && payload.session_id && payload.user_id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)) {
            (_b = adapters.get(payload.guild_id)) === null || _b === void 0 ? void 0 : _b.onVoiceStateUpdate(payload);
        }
    });
}
var trackedGuilds = new Map();
function cleanupGuilds(shard) {
    var _a;
    var guilds = trackedGuilds.get(shard);
    if (guilds) {
        for (var _i = 0, _b = guilds.values(); _i < _b.length; _i++) {
            var guildID = _b[_i];
            (_a = adapters.get(guildID)) === null || _a === void 0 ? void 0 : _a.destroy();
        }
    }
}
function trackGuild(guild) {
    var guilds = trackedGuilds.get(guild.shard);
    if (!guilds) {
        var cleanup = function () { return cleanupGuilds(guild.shard); };
        guild.shard.on('close', cleanup);
        guild.shard.on('destroyed', cleanup);
        guilds = new Set();
        trackedGuilds.set(guild.shard, guilds);
    }
    guilds.add(guild.id);
}
/**
 * Creates an adapter for a Voice Channel
 * @param channel - The channel to create the adapter for
 */
function createDiscordJSAdapter(channel) {
    return function (methods) {
        adapters.set(channel.guild.id, methods);
        trackClient(channel.client);
        trackGuild(channel.guild);
        return {
            sendPayload: function (data) {
                if (channel.guild.shard.status === discord_js_1.Constants.Status.READY) {
                    channel.guild.shard.send(data);
                    return true;
                }
                return false;
            },
            destroy: function () {
                return adapters.delete(channel.guild.id);
            },
        };
    };
}
exports.createDiscordJSAdapter = createDiscordJSAdapter;