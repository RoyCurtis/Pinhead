/*
 * Pinhead, the pinning bot
 * Roy Curtis, 2017, MIT license
 */

/**
 * Checks if a given user has the given role in the given guild
 *
 * @param {User} user
 * @param {Guild} guild
 * @param {string} roleSearch
 */
exports.hasRole = function(user, guild, roleSearch)
{
    // If given role is empty, assume it's a match-all
    if (!roleSearch || roleSearch.trim() === "")
        return true;

    /** @type {Role} */
    let role   = null;
    /** @type {GuildMember} */
    let member = null;

    for ( role of guild.roles.values() )
    {
        // Skip non-matching roles
        if (role.name.toLowerCase() !== roleSearch)
            continue;

        for ( member of role.members.values() )
            if (member.user === user)
                return true;
    }

    // No match found
    return false;
};