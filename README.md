# tuubaa.server
Backend für den Discord Bot und der Webseite https://tuubaa.de
[tuubaa Discord Server](https://discord.gg/tuubaa).

# Features
- ticket
- temp voice
- custom welcome messages



# Todo
- youtube api / news
- ticket rewrite
  - permission
  - log in webseite
- music 
  - fix pleassseee
- moderation 
  - permission
    - Rollen Vergabe
    - Ban
    - timeout
    - kick
    - voicemute
    - warn 3
    - test wachhund
  - report
      - user 
        - by reaction
        - open model 
    - web integration
      - tutorial
      - timeout/ban/push to next instance/ ignore for reports
- filter
  - bilder wo - antwort
- commands 
  - false check system
  - isolation system/ permission
- level 
  - role by level 
  - events
  - (extra xp by tuubaa)
  - xp by voice channel
    - NO XP
      - solo
      - all mute
      - full mute
    - less XP
  - leaderbot channel 
  - website
    - leaderbot
    - person rank


# Contributation

bitte nutze dies:

- prettier formattor (default)
- indentation (2 Spaces)
- node package handler (npm)
- enviroment file `.env` (use `.env.template` for reference)


### Aufbau

Datenbank Schema werden in `prisma/schema.prisma` erstellt
Modele werden in `models/` erstellt
Allgmeine funktionen in `lib/`
Das Modulesystem ist in `modules/` angelegt
Modules Events kommen in `modules/{Name des Modules}/events/{event name}`
Modules Commands kommen in `modules/{Name des Commands}/commands/{command name}`
Datenbank Funktionen werden in `modules/{Name des Commands}/database.ts` (Achte drauf das du für jeden datenbank aufruf keine eigene funktion benutzen musst)

### Rollen/ Channels/ Membern

Wenn eine Rolle, Channel oder einen bestimmen Member brauchst kannst du dies durch z.b bei der Rolle Admin `snowflake.roles.admin` machen.
Bei neuen Rollen oder andere musst du sie in `lib/snowflake.ts` anlegen.

Mit `snowflake.updateRoles` (channels, Member) kannst du sie updaten (Das ist nur jetzt möglich weil die Webseite nicht für jeden Verfügbar ist)
Sie kann nach dem ersten durchlauf gelöscht werden da sich das dann in der Datenbank befindet.
