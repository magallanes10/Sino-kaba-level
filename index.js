const express = require('express');
const request = require('request');
const parse = require('./parse.js');

const app = express();
const port = 3000;

// Define difficulty levels directly in the script
const LEVEL_DIFFICULTY = {
    'NA': 'NA',
    'Easy': 'Easy',
    'Normal': 'Normal',
    'Hard': 'Hard',
    'Harder': 'Harder',
    'Insane': 'Insane',
    'Auto': 'Auto',
    'EasyDemon': 'EasyDemon',
    'MediumDemon': 'MediumDemon',
    'InsaneDemon': 'InsaneDemon',
    'ExtremeDemon': 'ExtremeDemon',
    'HardDemon': 'HardDemon',
    'FeatureNA': 'FeatureNA',
    'FeatureEasy': 'FeatureEasy',
    'FeatureNormal': 'FeatureNormal',
    'FeatureHard': 'FeatureHard',
    'FeatureHarder': 'FeatureHarder',
    'FeatureInsane': 'FeatureInsane',
    'FeatureAuto': 'FeatureAuto',
    'FeatureEasyDemon': 'FeatureEasyDemon',
    'FeatureMediumDemon': 'FeatureMediumDemon',
    'FeatureInsaneDemon': 'FeatureInsaneDemon',
    'FeatureExtremeDemon': 'FeatureExtremeDemon',
    'FeatureHardDemon': 'FeatureHardDemon',
    'EpicNA': 'EpicNA',
    'EpicEasy': 'EpicEasy',
    'EpicNormal': 'EpicNormal',
    'EpicHard': 'EpicHard',
    'EpicHarder': 'EpicHarder',
    'EpicInsane': 'EpicInsane',
    'EpicAuto': 'EpicAuto',
    'EpicEasyDemon': 'EpicEasyDemon',
    'EpicMediumDemon': 'EpicMediumDemon',
    'EpicInsaneDemon': 'EpicInsaneDemon',
    'EpicExtremeDemon': 'EpicExtremeDemon',
    'EpicHardDemon': 'EpicHardDemon'
};

app.get('/level', (req, res) => {
    const { name, url } = req.query;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Missing or empty level name/ID parameter' });
    }

    const isID = !isNaN(name);
    const apiUrl = isID ? `${url}/downloadGJLevel22.php` : `${url}/getGJLevels21.php`;

    const form = isID
        ? {
            gameVersion: 21,
            levelID: name,
            secret: "Wmdf2893gb7"
        }
        : {
            gameVersion: 21,
            binaryVersion: 35,
            str: name.replace(/ /g, '_'),
            secret: "Wmdf2893gb7"
        };

    request.post(apiUrl, { form }, (err, httpResponse, body) => {
        if (err) {
            return res.status(500).json({ error: 'Error making request', details: err });
        }
        if (body === '-1') {
            return res.status(404).json({ error: `Level '${name}' not found` });
        }

        if (isID) {
            const levelInfo = body.split('#');
            const levelData = parse.parseResponse(levelInfo[0]);
            const level = {
                levelID: levelData[1],
                levelName: levelData[2],
                description: levelData[3],
                version: levelData[5],
                playerID: levelData[6],
                difficulty: levelData[9],
                download: levelData[10],
                officialSong: levelData[12],
                gameVersion: levelData[13],
                likes: levelData[14],
                length: levelData[15],
                demon: levelData[17],
                stars: levelData[18],
                featured: levelData[19],
                auto: levelData[25],
                uploadDate: levelData[27],
                updateDate: levelData[29],
                copied: levelData[30],
                twoPlayer: levelData[31],
                customSong: levelData[35],
                coins: levelData[37],
                verifiedCoins: levelData[38],
                timelyID: levelData[41],
                epic: levelData[42],
                demondiff: levelData[43],
                objects: levelData[45],
            };

            let colour;
            let difficulty;
            switch (level['difficulty']) { // difficulty faces
                case '0':
                    difficulty = LEVEL_DIFFICULTY['NA'];
                    colour = 0xa9a9a9;
                    break;
                case '10':
                    difficulty = LEVEL_DIFFICULTY['Easy'];
                    colour = 0x00e0ff;
                    break;
                case '20':
                    difficulty = LEVEL_DIFFICULTY['Normal'];
                    colour = 0x00ff3a;
                    break;
                case '30':
                    difficulty = LEVEL_DIFFICULTY['Hard'];
                    colour = 0xffb438;
                    break;
                case '40':
                    difficulty = LEVEL_DIFFICULTY['Harder'];
                    colour = 0xfc1f1f;
                    break;
                case '50':
                    difficulty = LEVEL_DIFFICULTY['Insane'];
                    colour = 0xf91ffc;
                    break;
                default:
                    difficulty = LEVEL_DIFFICULTY['NA'];
                    colour = 0xa9a9a9;
                    break;
            }

            if (level['auto'] == 1) {
                difficulty = LEVEL_DIFFICULTY['Auto'];
                colour = 0xf5c96b;
            } else if (level['demon'] == 1) {
                switch (level['demondiff']) {
                    case '3':
                        difficulty = LEVEL_DIFFICULTY['EasyDemon'];
                        colour = 0xaa6bf5;
                        break;
                    case '4':
                        difficulty = LEVEL_DIFFICULTY['MediumDemon'];
                        colour = 0xac2974;
                        break;
                    case '5':
                        difficulty = LEVEL_DIFFICULTY['InsaneDemon'];
                        colour = 0xb31548;
                        break;
                    case '6':
                        difficulty = LEVEL_DIFFICULTY['ExtremeDemon'];
                        colour = 0x8e0505;
                        break;
                    default:
                        difficulty = LEVEL_DIFFICULTY['HardDemon'];
                        colour = 0xff0000;
                        break;
                }
            }

            if (level['featured'] > 0) {
                switch (level['difficulty']) {
                    case '0':
                        difficulty = LEVEL_DIFFICULTY['FeatureNA'];
                        break;
                    case '10':
                        difficulty = LEVEL_DIFFICULTY['FeatureEasy'];
                        break;
                    case '20':
                        difficulty = LEVEL_DIFFICULTY['FeatureNormal'];
                        break;
                    case '30':
                        difficulty = LEVEL_DIFFICULTY['FeatureHard'];
                        break;
                    case '40':
                        difficulty = LEVEL_DIFFICULTY['FeatureHarder'];
                        break;
                    case '50':
                        difficulty = LEVEL_DIFFICULTY['FeatureInsane'];
                        break;
                    default:
                        difficulty = LEVEL_DIFFICULTY['FeatureNA'];
                        break;
                }
                if (level['auto'] == 1) {
                    difficulty = LEVEL_DIFFICULTY['FeatureAuto'];
                } else if (level['demon'] == 1) {
                    switch (level['demondiff']) {
                        case '3':
                            difficulty = LEVEL_DIFFICULTY['FeatureEasyDemon'];
                            break;
                        case '4':
                            difficulty = LEVEL_DIFFICULTY['FeatureMediumDemon'];
                            break;
                        case '5':
                            difficulty = LEVEL_DIFFICULTY['FeatureInsaneDemon'];
                            break;
                        case '6':
                            difficulty = LEVEL_DIFFICULTY['FeatureExtremeDemon'];
                            break;
                        default:
                            difficulty = LEVEL_DIFFICULTY['FeatureHardDemon'];
                            break;
                    }
                }
            }

            if (level['epic'] > 0) {
                switch (level['difficulty']) {
                    case '0':
                        difficulty = LEVEL_DIFFICULTY['EpicNA'];
                        break;
                    case '10':
                        difficulty = LEVEL_DIFFICULTY['EpicEasy'];
                        break;
                    case '20':
                        difficulty = LEVEL_DIFFICULTY['EpicNormal'];
                        break;
                    case '30':
                        difficulty = LEVEL_DIFFICULTY['EpicHard'];
                        break;
                    case '40':
                        difficulty = LEVEL_DIFFICULTY['EpicHarder'];
                        break;
                    case '50':
                        difficulty = LEVEL_DIFFICULTY['EpicInsane'];
                        break;
                    default:
                        difficulty = LEVEL_DIFFICULTY['EpicNA'];
                        break;
                }
                if (level['auto'] == 1) {
                    difficulty = LEVEL_DIFFICULTY['EpicAuto'];
                } else if (level['demon'] == 1) {
                    switch (level['demondiff']) {
                        case '3':
                            difficulty = LEVEL_DIFFICULTY['EpicEasyDemon'];
                            break;
                        case '4':
                            difficulty = LEVEL_DIFFICULTY['EpicMediumDemon'];
                            break;
                        case '5':
                            difficulty = LEVEL_DIFFICULTY['EpicInsaneDemon'];
                            break;
                        case '6':
                            difficulty = LEVEL_DIFFICULTY['EpicExtremeDemon'];
                            break;
                        default:
                            difficulty = LEVEL_DIFFICULTY['EpicHardDemon'];
                            break;
                    }
                }
            }

            let length;
            switch (level['length']) {
                case '0':
                    length = "Tiny";
                    break;
                case '1':
                    length = "Short";
                    break;
                case '2':
                    length = "Medium";
                    break;
                case '3':
                    length = "Long";
                    break;
                case '4':
                    length = "XL";
                    break;
            }

            let coins;
            let coinsString = '';
            if (level['verifiedCoins'] == 1) {
                coins = level['coins'];
            } else {
                coins = 0;
            }
            for (let i = 0; i < coins; i++) {
                coinsString += ':coin:';
            }

            res.json({
                ...level,
                difficulty,
                length,
                coins: coinsString,
                colour
            });
        } else {
            const data = body.split('#');
            const levelArr = data[0].includes('|') ? data[0].split('|') : [data[0]];
            const creators = data[1].split('|');
            const metaData = data[3].split(':');

            if (metaData[0] == 0) {
                return res.status(404).json({ error: 'No levels could be found' });
            }

            const levels = levelArr.map((lvl, i) => {
                const levelData = parse.parseResponse(lvl);
                return {
                    levelID: levelData[1],
                    levelName: levelData[2],
                    description: levelData[3],
                    version: levelData[5],
                    playerID: levelData[6],
                    difficulty: levelData[9],
                    download: levelData[10],
                    officialSong: levelData[12],
                    gameVersion: levelData[13],
                    likes: levelData[14],
                    length: levelData[15],
                    demon: levelData[17],
                    stars: levelData[18],
                    featured: levelData[19],
                    auto: levelData[25],
                    uploadDate: levelData[27],
                    updateDate: levelData[29],
                    copied: levelData[30],
                    twoPlayer: levelData[31],
                    customSong: levelData[35],
                    coins: levelData[37],
                    verifiedCoins: levelData[38],
                    timelyID: levelData[41],
                    epic: levelData[42],
                    demondiff: levelData[43],
                    objects: levelData[45],
                    creator: creators[i].split(':')[1]
                };
            });

            res.json({ levels, totalResults: metaData[0] });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
