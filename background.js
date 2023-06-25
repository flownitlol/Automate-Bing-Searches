importScripts('ExtPay.js');

// var extpay = ExtPay('automate-your-bing-searches'); 
const extpay = ExtPay('automate-your-bing-searches-lifetime-access');
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension
// extpay2.startBackground();

var tabId, count, mobile, minDelay, maxDelay, amazonLink, sentToAmazon, closeTab, startActivitiesAfter, port;
var quizTab;

chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1000] });

// let salt1 = generateRandomString();
// let salt2 = generateRandomString();
// let salt3 = generateRandomString();
// let salt4 = generateRandomString();

let useragent = generateUserAgent();

const words = [
    'Demi Lovato', 'Elf film', 'Minneapolis', 'Presidential system', 'Leonard Cohen', 'Fashion design', 'Microsoft SQL Server', 'Gabriel García Márquez', 'Odyssey', 'List of colors: A-F', 'Board of directors', 'Lava', 'Sahrawi Arab Democratic Republic', 'United States Department of Defense', 'Church of England', 'Morgan Wallen', 'ITV (TV network)', 'West Bromwich Albion F.C.', 'Quantum entanglement', 'USB', 'Alphabet Inc.', 'Renault', 'ACF Fiorentina', 'Diane Lane', 'Royal Air Force', 'Medicare (United States)', 'Free agent', 'Random-access memory', 'Los Angeles Times', 'United States Soccer Federation', 'Linkin Park', 'Superman', 'Dream Theater', 'Köppen climate classification', 'Southampton F.C.', 'Intel', 'Conspiracy theory', 'Phoenix, Arizona', 'American Samoa', 'University of California, Los Angeles', 'San Diego', 'A cappella', 'World',
    'FIFA World Cup records and statistics', 'Houston', 'The Twelve Days of Christmas (song)', 'Kendrick Lamar', '2023 AFC Asian Cup', 'A. J. Brown', 'Aerosmith', 'Pixar', 'Function (mathematics)', 'Spider-Man: Into the Spider-Verse', 'Meta Platforms', 'Patent', 'Football pitch', 'The Magic Flute', 'Shin Ultraman', 'AM broadcasting', 'Al Gore', 'Suits (American TV series)', 'Work (physics)', 'Cleveland', 'Boeing 777', 'Reading', 'Giannis Antetokounmpo', 'The Elf on the Shelf', 'Value-added tax', 'Oldham Athletic A.F.C.', 'What a Wonderful World', "The Last of Us",
    'Lionel Messi', 'Festivus', 'The Specials', 'The Sound of Music (film)', "Newell's Old Boys", 'Reborn Rich', 'Christopher Plummer', 'Steve Cohen (businessman)', 'Index of Windows games (A)', 'Aliens (film)', 'Helen Mirren', 'S.S.C. Napoli', 'Club Atlético River Plate', 'Boca Juniors', 'Die Hard (film series)', 'A Charlie Brown Christmas', 'Aldous Huxley', 'Imran Khan', 'Pope Benedict XVI', 'To Kill a Mockingbird', 'Pokémon Ultimate Journeys: The Series', 'Siniša Mihajlović', 'Mickey Rooney', 'Characters of the DC Extended Universe', '2023 Africa Cup of Nations', "Catherine O'Hara", 'Richard Harris', 'Paulo Dybala', 'Martin McDonagh', "You're a Mean One, Mr. Grinch", 'John Lithgow', 'FA Trophy', 'White Christmas (song)', 'A Visit from St. Nicholas', 'The Year Without a Santa Claus', 'Joker: Folie à Deux', 'Leo Varadkar', 'Pinocchio', 'A Star Is Born (2018 film)', 'Hamza Yassin', 'A Christmas Carol (2009 film)', 'Warner Bros.', 'Succession to the British throne', 'M. Night Shyamalan', 'Ebenezer Scrooge', 'Ahmedabad', 'Bryan Cranston', 'Pope', 'A. R. Rahman', 'Leandro Paredes', 'Herbert Hoover', 'Debbie Reynolds', 'Julianne Moore', 'Betty White', 'Paolo Maldini', 'Edie Falco', 'Central African Republic', 'Baronet', 'Kiefer Sutherland', 'Microsoft Azure', 'NCAA Division I', 'A Bad Moms Christmas', 'Genus', 'Gerard Way', 'The Muppet Christmas Carol', 'The Dark Knight', 'AJ Styles', 'Frozen (2013 film)', 'Bardo, False Chronicle of a Handful of Truths', 'Prakash Raj', 'Robbie Coltrane', 'Sidney Poitier', 'Chuck Berry', 'Los Angeles Dodgers', 'Oakland Athletics', 'Watford F.C.', 'Skyfall', 'Sheffield United F.C.', 'Glossary of chess', 'Professional wrestling match types', 'Nigella Lawson', 'A Man Called Otto', 'Scrooge (1951 film)',
    'Alexandria Ocasio-Cortez', 'George R. R. Martin', 'Mathematical model', 'Richard Rodgers', "Groucho Marx", "December 2022 North American winter storm", "Indianapolis", "Atal Bihari Vajpayee", "Metropolitan statistical area", "Alfred North Whitehead", "Star Wars: The Force Awakens", "John Elway", "Buddy Holly", "2023 World Junior Ice Hockey Championships", "Paul Anka", "Grease (film)", "E.T. the Extra-Terrestrial", "Niagara Falls", "Die Hard with a Vengeance", "Bette Davis", "Forrest Gump", "The Home Depot", "Thomas Becket", "Requiem for a Dream", "Martha Stewart", "Isaac Asimov", "Michelle Williams (actress)", "Rupert Grint", "Axolotl", "Gillian Anderson", "Halle Berry", "Savannah, Georgia", "Variance", "The Football Association", "Board game", "Straw man", "Delta Air Lines", "Rastafari", "Fantastic Beasts (film series)", "Bradford City A.F.C.", "A Midsummer Night's Dream", "Todd Rundgren", "Marlo Thomas",
    "Beck", "Flower", "Jeff Beck", "College football national championships in NCAA Division I FBS", "President of India", "Charlton Athletic F.C.", "Georgia Bulldogs football", "SoFi Stadium", "Metro-Goldwyn-Mayer", "The Raven", "Claire Danes", "Abbott Elementary", "The Walking Dead (season 11)", "Kliff Kingsbury", "Graham Potter", "A Quiet Place", "Ronnie Wood", "Ultraman (1966 TV series)", "Federal Aviation Administration", "Han dynasty", "Alfred Russel Wallace", "Mac operating systems", "Pomerania", "I Have a Dream", "A24", "Primetime Emmy Awards", "The A.V. Club", "Evan Peters", "Christina Aguilera", "List of EGOT winners", "A. C. Bhaktivedanta Swami Prabhupada", "Alan Cumming", "Phineas and Ferb", "Boy George", "Belgian Pro League", "Jessica Simpson", "LL Cool J", "Toyota Supra", "James Herriot", "Lulu (singer)", "Academy Award for Best Actor", "Compass", "Community (TV series)", "Miguel A. Núñez Jr.", "Australian Broadcasting Corporation", "Phoebe Waller-Bridge", "The Flash (2014 TV series)",
    "The Last of Us (HBO)", "Panic! at the Disco", "Berkshire Hathaway", "Burns supper", "Stephen A. Smith", "Paul Ince", "John Abraham", "Forest Green Rovers F.C.", "Lolita", "Cyndi Lauper", "Super Bowl LII", "Abdel Fattah el-Sisi", "Tommy Chong", "Rabbit", "Parks and Recreation", "Academy Award for Best Actress", "The Dark Side of the Moon", "Saraswati", "Sequoyah", "Virginia Woolf", "Ron Klain", "Thandiwe Newton", "Canberra", "Circumference", "List of Game of Thrones characters", "Prime number", "Alexander Skarsgård", "KL Rahul", "Rainbow", "Alfred the Great", "J. Cole", "Hexagon", "ESPN", "Jennifer Garner", "Zac Taylor", "The Kid Laroi", "Carlo Ancelotti", "Julia Louis-Dreyfus", "Paul Giamatti", "Harley-Davidson", "Cardiff City F.C.", "Death of a Salesman", "Los Angeles County, California",
    "Unicode subscripts and superscripts", "Enclosed Alphanumerics", "Blackboard bold", "Fraktur", "Ordinal indicator", "Enclosed Alphanumeric Supplement", "Los Angeles", "United States", "California", "Muhammad Ali", "ISBN", "U.S. state", "Singapore", "Bachelor of Arts", "Edgar Allan Poe", "Saudi Arabia", "Hong Kong", "Madonna", "Chicago", "Arnold Schwarzenegger", "Artificial intelligence", "Abraham Lincoln", "Steven Spielberg", "George Washington", "Taylor Swift", "FC Barcelona", "Wolfgang Amadeus Mozart", "Elvis Presley", "United Arab Emirates", "Premier League", "Manchester City F.C.", "Philadelphia", "Marvel Cinematic Universe", "National Basketball Association", "Jennifer Lopez", "Martin Luther King Jr.", "Marilyn Monroe", "Albert Einstein", "Lady Gaga", "Tupac Shakur", "Atlanta", "John F. Kennedy", "George VI", "List of United States representatives from New York", "Dubai", "Egypt", "Ilhan Omar", "Nancy Pelosi", "Cloud computing", "Hawaii", "German language", "Frank Sinatra", "Henry Kissinger", "A.C. Milan", "Cricket", "Franklin D. Roosevelt", "Ronald Reagan", "Spotify", "Cher", "Once Upon a Time in Hollywood", "Los Angeles Rams", "Theodore Roosevelt", "Bill Clinton", "Anita Baker", "Zinedine Zidane", "Anne Boleyn", "Gene Hackman", "Fenerbahçe S.K. (football)", "Megan Mullally", "Mötley Crüe", "Lunch atop a Skyscraper", "2026 FIFA World Cup", "Harry Connick Jr.", "Charles Lindbergh", "ISO 216", "Jill Biden", "Tim Allen", "Millet", "FIFA", "Eddie Howe",
    "Serie A", "ASAP Rocky", "Katy Perry", "Gerald Ford", "Jimmy Carter", "Alexander Hamilton", "Richard Nixon", "Star Wars", "Black hole", "Lil Wayne", "WWE", "Willie Nelson", "HTML", "Lyndon B. Johnson", "Thomas Jefferson", "Naruto", "NASA", "Volodymyr Zelenskyy", "John Adams", "Rihanna", "Lana Del Rey", "Leeds United F.C.", "A. J. McCarron", "George Orwell", "Email client", "Olivia Newton-John", "50 Cent", "Detroit", "Chadwick Boseman", "Toyota", "Andrew Jackson", "Woodrow Wilson", "The Lord of the Rings", "List of sovereign states", "Game of Thrones", "Los Angeles Lakers", "Wicket", "Sigmund Freud", "Ulysses S. Grant", "Dwight D. Eisenhower", "Columbia Pictures", "Harry S. Truman", "Oscar Wilde", "A. P. J. Abdul Kalam", "Temperature", "Attention deficit hyperactivity disorder", "Marcus Rashford", "Benjamin Franklin", "Neil Armstrong", "Freddie Mercury", "Radiohead", "Catherine Zeta-Jones", "Freemasonry", "Jennifer Lawrence", "List of municipalities in Michigan", "Bernie Sanders", "Year", "Ernest Hemingway", "FA Cup", "Damian Lillard", "Atlético Madrid", "Tilde", "Robin Williams", "Ben Affleck", "Rabindranath Tagore", "ABBA", "Christopher Columbus", "Solar System", "The Big Bang Theory", "New Orleans", "SZA", "Bipolar disorder", "Stan Lee", "Kate Winslet", "Glass Onion: A Knives Out Mystery", "Binomial nomenclature", "Kevin Bacon", "William Shatner", "IBM", "Anno Domini", "Kelsea Ballerini", "Eastern Time Zone", "Socrates", "List of A Song of Ice and Fire characters", "Burt Bacharach", "Social media", "Carrie Fisher", "Hayden Panettiere", "Lupang Hinirang", "Banksy", "Rowan Atkinson", "Airbus A380", "Minnesota", "Mobile country code", "List of United States counties and county equivalents", "Minor League Baseball",
    "Grover Cleveland", "Pittsburgh", "A-side and B-side", "Jewel (singer)", "Blade Runner", "Alan Turing", "India women's national cricket team", "Segunda División", "Vanessa Hudgens", "Juventus F.C.", "Thomas Edison", "Lamborghini", "Adidas", "Noam Chomsky", "PinkPantheress", "Warren G. Harding", "RDFa", "Gwen Stefani", "Campeonato Brasileiro Série A", "Lion", "Flag of the United States", "Sarah Silverman", "Longitude", "Coffee", "The Silence of the Lambs (film)", "A Song of Ice and Fire", "William McKinley", "Andrew Johnson", "ISO 4217", "John Quincy Adams", "William Howard Taft", "S.L. Benfica", "Rita Ora", "Alan Alda", "Rugby union", "Columbia University", "Dallas", "Billy Crudup", "Geographic coordinate system", "Texas A&M University", "James Joyce", "Encyclopedia", "James A. Garfield", "Constitution of the United States", "Romelu Lukaku", "El Camino: A Breaking Bad Movie", "Evan Rachel Wood", "Ray Kroc", "ASEAN", "NPR", "Tomato", "DNA", "Real Betis", "Eugene Levy", "William Henry Harrison", "AS Monaco FC",

];


var cache = {
    "requestStop": false
}

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.message === "quizzes are done") {
        chrome.storage.sync.get("closeTab", function (result) {
            // console.log(result.closeTab);
            // console.log("quizzes are finished and we are checking if close tab is checked or not")
            if (result.closeTab) {
                // console.log("we are supposed to close the tab, which we will do in 5 seconds")
                setTimeout(function () {
                    chrome.tabs.remove(quizTab);
                }, 5000)
            }
        });
    }
});

function generateRandomString() {
    let result = "";
    if (Math.random() <= 0.5) {
        let ceiling = 7;
        let floor = 2;
        let saltLength = Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./";
        let charactersLength = characters.length;
        for (let i = 0; i < saltLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += " ";
    }

    return result;
}

function generateUserAgent() {
    const user_agents = [`${generateRandomString()}Mozilla/5.0 ${generateRandomString()}(iPhone; CPU iPhone OS 12_3_1 like Mac OS X) ${generateRandomString()}AppleWebKit/605.1.15 ${generateRandomString()}(KHTML, like Gecko) ${generateRandomString()}Version/12.1.1 ${generateRandomString()}EdgiOS/44.5.0.10 Mobile/15E148 ${generateRandomString()}Safari/604.1`, `${generateRandomString()}Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) ${generateRandomString()}AppleWebKit/605.1.15 (KHTML, like Gecko)  ${generateRandomString()}EdgiOS.108.0.1462.77 ${generateRandomString()}Version/16.0 ${generateRandomString()}Mobile/15E148 Safari/604.1 ${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (Linux; Android 8.1.0; Pixel Build/OPM4.171019.021.D1) ${generateRandomString()}AppleWebKit/537.36 (KHTML, like Gecko) ${generateRandomString()}Chrome/65.0.3325.109 ${generateRandomString()}Mobile Safari/537.36 ${generateRandomString()}EdgA/42.0.0.2057 ${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (Windows Mobile 10; Android 10.0; Microsoft; Lumia 950XL) ${generateRandomString()}AppleWebKit/537.36 (KHTML, like Gecko) ${generateRandomString()}Chrome/109.0.0.0 Mobile Safari/537.36 ${generateRandomString()}Edge/40.15254.603${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) ${generateRandomString()}AppleWebKit/605.1.15 ${generateRandomString()}(KHTML, like Gecko) ${generateRandomString()}Version/16.0 EdgiOS/108.1462.77 ${generateRandomString()}Mobile/15E148 Safari/605.1.15${generateRandomString()}`, `Mozilla/5.0 ${generateRandomString()}(Linux; Android 10; HD1913) AppleWebKit/537.36 ${generateRandomString()}(KHTML, like Gecko) ${generateRandomString()}Chrome/109.0.5414.117 Mobile Safari/537.36 ${generateRandomString()}EdgA/109.0.1518.53 ${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (Linux; Android 10; SM-G973F) ${generateRandomString()}AppleWebKit/537.36 (KHTML, like Gecko) ${generateRandomString()}Chrome/109.0.5414.117 ${generateRandomString()}Mobile Safari/537.36 ${generateRandomString()}EdgA/109.0.1518.53 ${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) ${generateRandomString()}AppleWebKit/537.36 (KHTML, like Gecko) ${generateRandomString()}Chrome/109.0.5414.117 Mobile Safari/537.36 ${generateRandomString()}EdgA/109.0.1518.53 ${generateRandomString()}`, `${generateRandomString()}Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) ${generateRandomString()}AppleWebKit/537.36 (KHTML, like Gecko) ${generateRandomString()}Chrome/109.0.5414.117 ${generateRandomString()}Mobile Safari/537.36 EdgA/109.0.1518.53${generateRandomString()}`];
    const randomIndex = Math.floor(Math.random() * user_agents.length);
    const randomElement = user_agents[randomIndex];
    const deviceTypes = [ // look into this more ----- the searches work but dont get mobile points for them, but you do get edge points
        'iPhone', 'iPad', 'iPod', 'Android', 'Windows Phone', 'BlackBerry'
    ];

    // // Define an array of possible Edge browser versions
    // const edgeVersions = [
    //     '12.0', '13.0', '14.0', '15.0', '16.0', '17.0', '18.0', '19.0', '20.0'
    // ];

    // // Define an array of possible Android and Windows versions
    // const androidVersions = ['4.0', '4.1', '4.2', '4.3', '4.4', '5.0', '5.1', '6.0', '7.0', '7.1', '8.0', '8.1', '9.0', '10.0', '11.0', '12.0'];
    // const windowsVersions = ['Windows NT 6.1', 'Windows NT 6.2', 'Windows NT 6.3', 'Windows NT 10.0'];

    // // Select a random device type, Edge version, Android version, and Windows version
    // const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    // const edgeVersion = edgeVersions[Math.floor(Math.random() * edgeVersions.length)];
    // const androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    // const windowsVersion = windowsVersions[Math.floor(Math.random() * windowsVersions.length)];

    // // Build the user agent string
    // const randomElement = `Mozilla/5.0 (${windowsVersion}; ${androidVersion}; Microsoft; ${deviceType} Edge/${edgeVersion}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36 Edg/${edgeVersion}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`;

    // Output the user agent string
    // console.log(randomElement);
    return randomElement;
}

function performMobileSearch() {
    // console.log("mobile search")
    chrome.declarativeNetRequest.updateDynamicRules(
        {
            addRules:
                [
                    {
                        "id": 1000,
                        "priority": 1,

                        "action": {
                            "type": "modifyHeaders",
                            "requestHeaders": [
                                {
                                    "header": "user-agent",
                                    "operation": "set",
                                    "value": useragent
                                }
                            ]
                        },
                        "condition": {
                            "urlFilter": "*://*/*",
                            "resourceTypes": [
                                "main_frame",
                                "sub_frame"
                            ]
                        }
                    }
                ],

            removeRuleIds: [1000],

        }, function () {
            if (chrome.runtime.lastError) {
                // console.log(chrome.runtime.lastError);
                chrome.storage.sync.set({ "failedMobile": true });
            }
        });

    // chrome.declarativeNetRequest.updateEnabledRulesets({
    //     "enableRulesetIds": ["ruleset_1"]
    // }, function () {
    //     if (chrome.runtime.lastError) {
    //         //   console.log(chrome.runtime.lastError);
    //         chrome.storage.sync.set({ "failedMobile": true });
    //         //   console.log("failed mobile search, will restart extension upon completion");
    //     }
    // });

    // set the timeout to allow for the rule to take effect before starting search
    setTimeout(function () {
        chrome.tabs.update(tabId, { "url": "https://www.bing.com/search?q=" + words[Math.floor(Math.random() * words.length - 1)] });
    }, 30);
}


function getCurrentTab(openNewTab) {
    if (!openNewTab) {
        chrome.storage.sync.get("performingQuizzes", function (result) {
            if (result.performingQuizzes) { // if the searches are running, open a new tab to do the quizzes
                // console.log("quizzes are running in the current tab, so let's open a new one");
                chrome.tabs.create({
                    url: "https://www.bing.com/",
                }, function (tab) {
                    tabId = tab.id
                });
            } else {
                // console.log(`checked to see if quizzes were running and received this: ${result.performingQuizzes}`);
                chrome.tabs.query({
                    active: true,
                    lastFocusedWindow: true
                }, function (arrayOfTabs) {
                    try {
                        tabId = arrayOfTabs[0].id;
                    }
                    catch (err) {
                        chrome.tabs.create({ url: "https://www.bing.com/", active: false }, function (tab) {
                            tabId = tab.id;
                        });
                    }
                });
            }
        });
        beginSearch(1);
    } else {
        chrome.tabs.create({ url: "https://www.bing.com/", active: false }, function (tab) {
            tabId = tab.id;
        });
        setTimeout(function () {
            beginSearch(1);
        }, 100);
    }

}
// chrome.runtime.onConnect.addListener(function(port) {
//     cache.requestStop = false;
//     port.onMessage.addListener(function(msg) {
//         if (msg.message === "start"){
//             console.log("starting search from background");
//             chrome.storage.sync.set({"failedMobile": false});
//             sentToAmazon = false;
//             count = parseInt(msg.count);
//             mobile = parseInt(msg.mobile) + 1;
//             minDelay = msg.minDelay;
//             maxDelay = msg.maxDelay;
//             words = msg.words;
//             amazonLink = msg.amazonLink;
//             closeTab = msg.closeTab;
//             getCurrentTab();
//         } else if (msg.message === "stop") {
//             chrome.storage.sync.set({"searchesLeft": 0});
//             // console.log("requesting stoppage");
//             // chrome.declarativeNetRequest.updateEnabledRulesets({"disableRulesetIds": ["ruleset_1"]});
//             chrome.declarativeNetRequest.updateEnabledRulesets({
//                 "disableRulesetIds": ["ruleset_1"]
//               }, function() {
//                 if (chrome.runtime.lastError) {
//                 //   console.log(chrome.runtime.lastError.message);
//                   chrome.storage.sync.set({"failedMobile": true});
//                 }
//               });
//             cache.requestStop = true;
//             var port = chrome.runtime.connect({name: "searchExtension"});
//             port.postMessage({message: "stop"});
//             chrome.action.setBadgeText({text: ""});
//             chrome.action.setIcon({path: "/images/icon16.png"});
//             restartMobile();
//         }
//   });
// });

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    cache.requestStop = false;
    chrome.storage.sync.set({ "quizzesPaused": false });
    if (msg.message === "start") {
        sendResponse({ farewell: "goodbye" });
        // console.log("starting search from background");
        chrome.storage.sync.set({ "failedMobile": false });
        sentToAmazon = true; // set this to false to make amazon searches happen again
        count = parseInt(msg.count);
        mobile = parseInt(msg.mobile) + 1;
        minDelay = msg.minDelay;
        maxDelay = msg.maxDelay;
        amazonLink = msg.amazonLink;
        closeTab = msg.closeTab;
        startActivitiesAfter = msg.startActivitiesAfter;
        getCurrentTab(false);
    } else if (msg.message === "stop") {
        chrome.storage.sync.set({ "searchesLeft": 0 });
        // console.log("requesting stoppage");
        // chrome.declarativeNetRequest.updateEnabledRulesets({"disableRulesetIds": ["ruleset_1"]});



        // chrome.declarativeNetRequest.updateEnabledRulesets({
        //     "disableRulesetIds": ["ruleset_1"]
        // }, function () {
        //     if (chrome.runtime.lastError) {
        //         //   console.log(chrome.runtime.lastError.message);
        //         chrome.storage.sync.set({ "failedMobile": true });
        //     }
        // });
        chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1000] });



        // chrome.declarativeNetRequest.updateEnabledRulesets({
        //     "disableRulesetIds": ["ruleset_3"]
        // }, function () {
        //     if (chrome.runtime.lastError) {
        //           console.log(chrome.runtime.lastError.message);
        //         chrome.storage.sync.set({ "failedMobile": true });
        //     }
        // });
        cache.requestStop = true;
        // var port = chrome.runtime.connect({name: "searchExtension"});
        // port.postMessage({message: "stop"});
        chrome.runtime.sendMessage({ message: "stop" });
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setIcon({ path: "/images/icon16.png" });
        restartMobile();
    } else if (msg.message === "start quizzes") {
        chrome.storage.sync.set({ "performingQuizzes": true });
        // console.log("setting performingQuizzes to true");
        chrome.storage.sync.get("searchRunning", function (result) {
            if (result.searchRunning) { // if the searches are running, open a new tab to do the quizzes
                // console.log("searches were already running in current tab, so let's open a new one");
                chrome.tabs.create({
                    url: "https://www.bing.com/search?q=",
                }, function (tab) {
                    quizTab = tab.id
                    chrome.tabs.sendMessage(quizTab, { message: "begin quizzes" });
                });
            } else {
                // console.log(`checked to see if searches were already running and received this ${result.searchRunning}`)
                chrome.tabs.query({
                    active: true,
                    lastFocusedWindow: true
                }, function (arrayOfTabs) {
                    quizTab = arrayOfTabs[0].id;
                    chrome.tabs.update(quizTab, { "url": "https://www.bing.com/search?q=" });
                });
                setTimeout(function () {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(quizTab, { message: "begin quizzes" });
                    });
                }, 2000);
            }
        });

    }
    // else if (msg.message === "referralTest") {
    //     chrome.declarativeNetRequest.updateEnabledRulesets({"enableRulesetIds": ["ruleset_2"]});

    //     chrome.tabs.update(tabId, { "url": "www.example.com" });

    //     setTimeout(function() {
    //         chrome.declarativeNetRequest.updateEnabledRulesets({
    //             "disableRulesetIds": ["ruleset_2"]
    //         }, function () {
    //             if (chrome.runtime.lastError) {
    //                   console.log(chrome.runtime.lastError.message);
    //                 chrome.storage.sync.set({ "failedMobile": true });
    //             }
    //         });
    //     }, 100); 
    // }
});

function beginSearch(iteration) {
    chrome.action.setBadgeText({ text: String(mobile + count - iteration) });
    // var port = chrome.runtime.connect({name: "searchExtension"});
    // port.postMessage({message: "keep going"});
    chrome.runtime.sendMessage({ message: "keep going" }, function () {
        if (chrome.runtime.lastError) {
            // console.log("tried to send a message to popup but it wasnt open");
        }
    });
    var delay = getDelay();
    // console.log(delay);
    if (iteration === 1) {
        if (!cache.requestStop) {
            const randomNumber = Math.floor(Math.random() * 4);
            if (randomNumber === 0 && amazonLink && !sentToAmazon && iteration != 0) {
                // console.log("sending to amazon");
                setTimeout(function () {
                    // chrome.tabs.update(tabId, { "url": "https://amzn.to/3F9kdyt" });
                    chrome.tabs.update(tabId, { "url": "https://flavourfwd.com/?extension=true" });
                    // chrome.tabs.update(tabId, {"url": "https://www.amazon.com?&linkCode=ll2&tag=cocor-20&linkId=0a868208e4d923b1126df1ab891004aa&language=en_US&ref_=as_li_ss_tl"});
                    sentToAmazon = true;
                    setTimeout(function () {
                        beginSearch(iteration);
                    }, delay * 1000);
                }, 1);

            } else {
                if (iteration > count) {
                    // console.log("performing mobile search");

                    performMobileSearch();
                } else {
                    // chrome.declarativeNetRequest.updateEnabledRulesets({
                    //     "enableRulesetIds": ["ruleset_3"]
                    // }, function () {
                    //     if (chrome.runtime.lastError) {
                    //           console.log(chrome.runtime.lastError);
                    //         chrome.storage.sync.set({ "failedMobile": true });
                    //         //   console.log("failed mobile search, will restart extension upon completion");
                    //     }
                    // });
                    chrome.tabs.update(tabId, { "url": "https://www.bing.com/search?q=" + words[Math.floor(Math.random() * words.length - 1)] });
                }
                setTimeout(function () {
                    if (iteration < mobile + count - 1) {
                        iteration++;
                        var searchesLeft = mobile + count - iteration;
                        chrome.storage.sync.set({ "searchesLeft": searchesLeft });
                        beginSearch(iteration)
                    } else {
                        chrome.storage.sync.set({ "searchesLeft": 0 });
                        chrome.storage.sync.get("searchesCompleted", function (result) {
                            let searchesCompleted = 1;
                            if (result.searchesCompleted != undefined) {
                                searchesCompleted = result.searchesCompleted + 1;
                            }
                            chrome.storage.sync.set({ "searchesCompleted": searchesCompleted })
                            // console.log(searchesCompleted);
                        });
                        if (!startActivitiesAfter) { // check to see if we are doing activities after the search before closing
                            if (closeTab) {
                                setTimeout(function () {
                                    chrome.tabs.remove(tabId);
                                }, 5000)
                            }
                        }
                        // chrome.declarativeNetRequest.updateEnabledRulesets({"disableRulesetIds": ["ruleset_1"]});



                        // chrome.declarativeNetRequest.updateEnabledRulesets({
                        //     "disableRulesetIds": ["ruleset_1"]
                        // }, function () {
                        //     if (chrome.runtime.lastError) {
                        //         //   console.log(chrome.runtime.lastError.message);
                        //         chrome.storage.sync.set({ "failedMobile": true });
                        //     }
                        // });
                        chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1000] });



                        // chrome.declarativeNetRequest.updateEnabledRulesets({
                        //     "disableRulesetIds": ["ruleset_3"]
                        // }, function () {
                        //     if (chrome.runtime.lastError) {
                        //           console.log(chrome.runtime.lastError.message);
                        //         chrome.storage.sync.set({ "failedMobile": true });
                        //     }
                        // });
                        chrome.action.setBadgeText({ text: "" });
                        chrome.action.setIcon({ path: "/images/icon16 - Copy.png" });
                        // var port = chrome.runtime.connect({name: "searchExtension"});
                        // port.postMessage({review: "show review"});
                        chrome.storage.sync.set({ "review": "show review" });
                        chrome.storage.sync.set({ "searchRunning": false });
                        // setTimeout( function(){chrome.action.setBadgeText({text: ""})}, 120000);
                        restartMobile();
                        console.log(startActivitiesAfter);
                        if (startActivitiesAfter) {
                            setTimeout(function() {
                                chrome.storage.sync.set({ "quizzesPaused": false });
                                chrome.storage.sync.set({ "removedActivities": [] });
                                chrome.storage.sync.set({ "lastActivity": "" });
                                chrome.storage.sync.set({ "performingQuizzes": true });
                                chrome.tabs.query({
                                    active: true,
                                    lastFocusedWindow: true
                                }, function (arrayOfTabs) {
                                    quizTab = arrayOfTabs[0].id;
                                    chrome.tabs.update(quizTab, { "url": "https://www.bing.com/search?q=" });
                                });
                                setTimeout(function () {
                                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                        chrome.tabs.sendMessage(quizTab, { message: "begin quizzes" });
                                    });
                                }, 2000);
                            }, 1000)
                        }
                        setTimeout(function () {
                            chrome.action.setIcon({ path: "/images/icon16.png" });
                            // var port = chrome.runtime.connect({name: "searchExtension"});
                            // port.postMessage({review: "do not show review"});
                            chrome.storage.sync.set({ "review": "do not show review" });
                        }, 60000);
                    }
                }, 1);
            }
        }
    } else {
        setTimeout(function () {
            if (!cache.requestStop) {
                const randomNumber = Math.floor(Math.random() * 4);
                if (randomNumber === 0 && amazonLink && !sentToAmazon) {
                    // console.log("sending to amazon");
                    setTimeout(function () {
                        // chrome.tabs.update(tabId, {"url": "https://www.amazon.com?&linkCode=ll2&tag=cocor-20&linkId=0a868208e4d923b1126df1ab891004aa&language=en_US&ref_=as_li_ss_tl"});
                        // chrome.tabs.update(tabId, { "url": "https://amzn.to/3F9kdyt" });
                        chrome.tabs.update(tabId, { "url": "https://flavourfwd.com/?extension=true" });
                        sentToAmazon = true;
                        setTimeout(function () {
                            beginSearch(iteration);
                        }, delay * 1000);
                    }, 1);
                } else {
                    if (iteration > count) {
                        // console.log("performing mobile search");
                        performMobileSearch();
                    } else {
                        // chrome.declarativeNetRequest.updateEnabledRulesets({
                        //     "enableRulesetIds": ["ruleset_3"]
                        // }, function () {
                        //     if (chrome.runtime.lastError) {
                        //           console.log(chrome.runtime.lastError);
                        //         chrome.storage.sync.set({ "failedMobile": true });
                        //         //   console.log("failed mobile search, will restart extension upon completion");
                        //     }
                        // });
                        chrome.tabs.update(tabId, { "url": "https://www.bing.com/search?q=" + words[Math.floor(Math.random() * words.length - 1)] });
                    }
                    setTimeout(function () {
                        if (iteration < mobile + count - 1) {
                            iteration++;
                            var searchesLeft = mobile + count - iteration;
                            chrome.storage.sync.set({ "searchesLeft": searchesLeft });
                            beginSearch(iteration)
                        } else {
                            // chrome.storage.sync.set({"searchesLeft": 0});
                            // chrome.declarativeNetRequest.updateEnabledRulesets({"disableRulesetIds": ["ruleset_1"]});
                            // chrome.action.setBadgeText({text: "✔"});
                            // setTimeout( function(){chrome.action.setBadgeText({text: ""})}, 120000)
                            chrome.storage.sync.set({ "searchesLeft": 0 });
                            chrome.storage.sync.get("searchesCompleted", function (result) {
                                let searchesCompleted = 1;
                                if (result.searchesCompleted != undefined) {
                                    searchesCompleted = result.searchesCompleted + 1;
                                }
                                chrome.storage.sync.set({ "searchesCompleted": searchesCompleted })
                                // console.log(searchesCompleted);
                            });


                            if (!startActivitiesAfter) { // check to see if we are doing activities after the search before closing
                                if (closeTab) {
                                    setTimeout(function () {
                                        chrome.tabs.remove(tabId);
                                    }, 5000)
                                }
                            }


                            // chrome.declarativeNetRequest.updateEnabledRulesets({"disableRulesetIds": ["ruleset_1"]});


                            // chrome.declarativeNetRequest.updateEnabledRulesets({
                            //     "disableRulesetIds": ["ruleset_1"]
                            // }, function () {
                            //     if (chrome.runtime.lastError) {
                            //         //   console.log(chrome.runtime.lastError.message);
                            //         chrome.storage.sync.set({ "failedMobile": true });
                            //     }
                            // });
                            chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1000] });



                            // chrome.declarativeNetRequest.updateEnabledRulesets({
                            //     "disableRulesetIds": ["ruleset_3"]
                            // }, function () {
                            //     if (chrome.runtime.lastError) {
                            //           console.log(chrome.runtime.lastError.message);
                            //         chrome.storage.sync.set({ "failedMobile": true });
                            //     }
                            // });
                            // chrome.action.setBadgeText({text: "✔"});
                            chrome.action.setBadgeText({ text: "" });
                            chrome.action.setIcon({ path: "/images/icon16 - Copy.png" });
                            // var port = chrome.runtime.connect({name: "searchExtension"});
                            // port.postMessage({review: "show review"});
                            chrome.storage.sync.set({ "review": "show review" });
                            chrome.storage.sync.set({ "searchRunning": false });
                            // console.log(startActivitiesAfter);
                            if (startActivitiesAfter) {
                                setTimeout(function() {
                                    chrome.storage.sync.set({ "quizzesPaused": false });
                                    chrome.storage.sync.set({ "removedActivities": [] });
                                    chrome.storage.sync.set({ "lastActivity": "" });
                                    chrome.storage.sync.set({ "performingQuizzes": true });
                                    chrome.tabs.query({
                                        active: true,
                                        lastFocusedWindow: true
                                    }, function (arrayOfTabs) {
                                        quizTab = arrayOfTabs[0].id;
                                        chrome.tabs.update(quizTab, { "url": "https://www.bing.com/search?q=" });
                                    });
                                    setTimeout(function () {
                                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                            chrome.tabs.sendMessage(quizTab, { message: "begin quizzes" });
                                        });
                                    }, 2000);
                                }, 1000)
                            }
                            // setTimeout( function(){chrome.action.setBadgeText({text: ""})}, 120000);
                            restartMobile();
                            setTimeout(function () {
                                chrome.action.setIcon({ path: "/images/icon16.png" });
                                // var port = chrome.runtime.connect({name: "searchExtension"});
                                // port.postMessage({review: "do not show review"});
                                chrome.storage.sync.set({ "review": "do not show review" });
                            }, 60000);
                        }
                    }, 1);
                }
            }
        }, delay * 1000);
    }
}

function getDelay() {
    var min = parseFloat(minDelay);
    var max = parseFloat(maxDelay);
    // console.log(minDelay, maxDelay);
    var decimals = 3
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimals);
    var delay = Math.floor(rand * power) / power
    // console.log(delay)
    return delay;
}

function restartMobile() {
    chrome.storage.sync.get("failedMobile", function (result) {
        if (result.failedMobile != undefined) {
            // result.failedMobile = true;
            if (result.failedMobile) {
                // console.log("reloading now to fix mobile searches")
                chrome.runtime.reload();
            }
        }
    });
}





chrome.windows.onCreated.addListener(function () {
    chrome.storage.sync.get("alarmType", function (result) {
        if (result.alarmType === "minutes") {
            const today = new Date();
            chrome.storage.sync.get("dateLastSearched", function (result) {
                if (result.dateLastSearched != today.toDateString()) {
                    chrome.storage.sync.get("minutes", function (result) {
                        createAlarm(parseFloat(result.minutes), "minutes");
                        const date = new Date();
                        chrome.storage.sync.set({ "dateLastSearched": date.toDateString() });
                    });
                }
            });

        }
    });

});

// chrome.alarms.getAll(function (alarms) {
//     for (const alarm of alarms) {
//         const date = new Date(alarm.scheduledTime);
//         console.log(date.toString());
//     }
// });






// Listen for the alarm to be triggered
chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.runtime.sendMessage({ message: "keep going" }, function () {
        if (chrome.runtime.lastError) {
            // console.log("tried to send a message to popup but it wasnt open");
        }
    });
    // Do something when the alarm is triggered
    // console.log("The alarm was triggered!");
    // Create the alarm for the next day
    // chrome.runtime.sendMessage({message: "an alarm triggered"});
    chrome.storage.sync.get("specificTime", function (result) {
        if (result.specificTime != undefined) {
            createAlarm(result.specificTime, "specific time");
            // chrome.runtime.sendMessage({message: "start from alarm"});
            // launch new search from here without using popup
            cache.requestStop = false;
            chrome.storage.sync.set({ "failedMobile": false });
            sentToAmazon = true; // set this to false to make amazon searches happen again
            // count = parseInt(msg.count);
            chrome.storage.sync.get("count", function (result) {
                count = parseInt(result.count);
            });
            // mobile = parseInt(msg.mobile) + 1;
            chrome.storage.sync.get("mobile", function (result) {
                mobile = parseInt(result.mobile) + 1;
                // mobile = 0;
            });
            // minDelay = msg.minDelay;
            chrome.storage.sync.get("minDelay", function (result) {
                minDelay = result.minDelay;
            });
            // maxDelay = msg.maxDelay;
            chrome.storage.sync.get("maxDelay", function (result) {
                maxDelay = result.maxDelay;
            });

            // amazonLink = msg.amazonLink;
            chrome.storage.sync.get("amazonLink", function (result) {
                amazonLink = result.amazonLink;
            });
            // closeTab = msg.closeTab;
            chrome.storage.sync.get("closeTab", function (result) {
                closeTab = result.closeTab;
            });
            chrome.storage.sync.set({ "searchRunning": true });
            getCurrentTab(true);

        }
    });

});


function createAlarm(alarmTime, alarmType) {
    if (alarmType === "specific time") {
        // // Get the current time
        // const { hours, minutes } = convertTime(alarmTime);
        // const now = new Date();
        // // Set the alarm time to what the user set it to
        // const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        // // If it's past the time the user set, make the alarm for tomorrow
        // if (alarmDate <= now) {
        //     alarmDate.setDate(alarmDate.getDate() + 1);
        // }
        // // Create the alarm
        // chrome.alarms.create("alarm", {
        //     when: alarmDate.getTime(),
        //     periodInMinutes: 1440 // Alarm will repeat every 1440 minutes, which is 24 hours
        // });
    } else if (alarmType === "minutes") {
        chrome.alarms.create("alarm", { delayInMinutes: alarmTime });
    }

    // chrome.alarms.getAll(function (alarms) {
    //     for (const alarm of alarms) {
    //         const date = new Date(alarm.scheduledTime);
    //         console.log(date.toString());
    //     }
    // });
}

function convertTime(time) {
    const parts = time.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return { hours, minutes };
}