var app = angular.module('console', []);

app.controller('ConsoleCtrl', function ($scope, $timeout) {
    "use strict";
    $scope.version = '0.4.5';
    $scope.debug = false;
    $scope.active = [];
    $scope.lines = [];
    $scope.tails = [];
    $scope.filtered = [];
    $scope.results = [];
    $scope.tree = [];
    $scope.selectedIndex = 0;
    $scope.commands = {
        'help': function () {
            $scope.lines.push({input: false, sections: [
                {'class': 'general', content: 'Welcome to the Help Section. Here is a list of available commands:'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'back'},
                {'class': 'general', content: 'moves up one directory'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'build'},
                {'class': 'general', content: '???'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'cd'},
                {'class': 'general', content: 'changes directory. used to explore'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'clear'},
                {'class': 'general', content: 'Clears the console'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'contact'},
                {'class': 'general', content: 'Send email to Ryan McDevitt'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'exit'},
                {'class': 'general', content: 'returns to home page'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'go'},
                {'class': 'general', content: 'opens a link in a new url'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'help'},
                {'class': 'general', content: 'You are looking at it'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'ls'},
                {'class': 'general', content: 'lists contents of current directory'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'pwd'},
                {'class': 'general', content: 'grabs the present working directory'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'reload'},
                {'class': 'general', content: 'reloads the console'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'search'},
                {'class': 'general', content: 'searches directory for piece of information'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'show'},
                {'class': 'general', content: 'prints out a piece of information'}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: 'tree'},
                {'class': 'general', content: 'prints out the directory tree of the current directory'}
            ]});
        },
        '?': function () {
            $scope.commands.help();
        },
        'clear': function () {
            $scope.lines = [];
        },
        'cls': function () {
            $scope.commands.clear();
        },
        'test': function (words) {
            alert(words);
        },
        'contact': function () {
            $scope.commands.go('mailto:mcdevitt.ryan@gmail.com');
        },
        'cd': function (dir) {
            if (dir === "..") {
                $scope.pwd.pop();
            } else {
                if (dir in $scope.current() && typeof $scope.current()[dir] === 'object') {
                    $scope.pwd.push(dir);
                } else {
                    $scope.lines.push({input: false, sections: [
                        {'class': 'error', content: dir + ' is not a valid directory. use ls to find valid directories'}
                    ]});
                }
            }
            $scope.debugLog($scope.getPwd());
        },
        'back': function () {
            $scope.pwd.pop();
        },
        'ls': function () {
            var keys = Object.keys($scope.current());
            angular.forEach(keys, function (key) {
                var type = 'general';
                if (typeof $scope.current()[key] === 'object') {
                    type = 'directory';
                }
                $scope.lines.push({input: false, sections: [
                    {'class': type, content: key}
                ]});
            });
            if ($scope.pwd.length > 0) {
                $scope.lines.push({input: false, sections: [
                    {'class': 'directory', content: ".."}
                ]});
            }
        },
        'dir': function () {
            $scope.commands.ls();
        },
        'list': function () {
            $scope.commands.ls();
        },
        'pwd': function () {
            $scope.lines.push({input: false, sections: [
                {'class': 'general', content: $scope.getPwd()}
            ]});
        },
        'return': function (string) {
            if ($scope.current().hasOwnProperty(string)) {
                string = $scope.current()[string];
            }
            $scope.lines.push({input: false, sections: [
                {'class': 'general', content: string}
            ]});
        },
        'reload': function () {
            window.location.reload();
        },
        'go': function (string) {
            var url;
            if (string in $scope.current()) {
                url = $scope.current()[string];
            } else {
                url = string;
            }
            window.open(url, '_blank');
        },
        'exit': function () {
            document.location.href = '/';
        },
        'show': function (key) {
            if (typeof $scope.current()[key] === 'string') {
                $scope.lines.push({input: false, sections: [
                    {'class': 'general', content: $scope.current()[key]}
                ]});
            } else if (key === 'all') {
                angular.forEach(Object.keys($scope.current()), function (k) {
                    if (typeof $scope.current()[k] === 'string') {
                        $scope.lines.push({input: false, sections: [
                            {'class': 'keyword', content: k},
                            {'class': 'general', content: $scope.current()[k]}
                        ]});
                    }
                });
            } else {
                $scope.lines.push({input: false, sections: [
                    {'class': 'error', content: key + ' is not a item to show'}
                ]});
            }
        },
        'print': function (key) {
            $scope.commands.show(key);
        },
        'tail': function (key) {
            $scope.commands.show(key);
        },
        'vi': function (key) {
            $scope.commands.show(key);
        },
        'vim': function (key) {
            $scope.commands.show(key);
        },
        'debug': function (key) {
            if (key) {
                $scope.debug = key;

            } else {
                $scope.debug = !$scope.debug;
            }
            if ($scope.debug) {
                $scope.lines.push({input: false, sections: [
                    {'class': 'general', content: "debugging enabled"}
                ]});
            } else {
                $scope.lines.push({input: false, sections: [
                    {'class': 'general', content: "debugging disabled"}
                ]});
            }
        },
        'search': function (term) {
            $scope.debugLog(term);
            $scope.results = [];
            $scope.buildSearch($scope.current(), term, $scope.getPwd());
            angular.forEach($scope.results, function (result) {
                $scope.lines.push({input: false, sections: [
                    {'class': 'keyword', content: result.key},
                    {'class': 'general', content: result.value}
                ]});
            });
        },
        'version': function () {
            $scope.lines.push({input: false, sections: [
                {'class': 'keyword', content: "version "},
                {'class': 'general', content: $scope.version}
            ]});
        },
        'build': function () {
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "   _____ ______   ________   ________  ________  ________ "}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "  |\\   _ \\  _   \\|\\   ____\\ |\\_____  \\|\\   __  \\|\\   ____\\ "}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "  \\ \\  \\\\\\__\\ \\  \\ \\  \\___|  \\|___/  /\\ \\  \\|\\  \\ \\  \\___|"}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "   \\ \\  \\\\|__| \\  \\ \\  \\         /  / /\\ \\  \\\\\\  \\ \\  \\____"}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "    \\ \\  \\    \\ \\  \\ \\  \\____   /  / /  \\ \\  \\\\\\  \\ \\  ___  \\"}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "     \\ \\__\\    \\ \\__\\ \\_______\\/__/ /    \\ \\_______\\ \\_______\\"}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'literal', content: "      \\|__|     \\|__|\\|_______||__|/      \\|_______|\\|_______|"}
            ]});
            $scope.lines.push({input: false, sections: [
                {'class': 'comment', content: "//have you tried the "},
                {'class': 'keyword', content: "matrix"},
                {'class': 'comment', content: " command?"}
            ]});
        },
        'tree': function () {
            $scope.tree = [];
            $scope.tree.push({input: false, sections: [
                {'class': 'literal', content: $scope.getPwd()}
            ]});
            $scope.buildTree($scope.current(), 0);
            $scope.debugLog($scope.tree);
            angular.forEach($scope.tree, function (line) {
                $scope.lines.push(line);
            });
        },
        'matrix': function (drops) {
            $scope.debugLog('matrix triggered');
            var i, t, e, width, sec = [], pos, len, height, drop, newsec, loop;
            $scope.matrix = [];
            drops = drops || 25;
            width = parseInt($(document).width() / 9, 10);
            height = parseInt($scope.limitRows() * -1, 10);
            $scope.debugLog('width:' + width + '| height: ' + height);
            for (i = 0; i < width; i += 1) {
                sec.push({'class': 'matrix', content: ' '});
            }
            $scope.commands.clear();
            for (i = 0; i < height; i += 1) {
                $scope.lines.push({input: false, sections: sec});
            }
            //field setup;
            //start loop
            //setup new drop
            $scope.debugLog('entering Matrix creation loop');
            for (i = 0; i < drops; i += 1) {
                pos = Math.floor((Math.random() * width) + 1);
                len = Math.floor((Math.random() * (height / 2)) + 1);
                $scope.matrix.push({pos: pos, len: len, cnt: 0});
            }
            $scope.debugLog($scope.matrix);
            //end loop
            t = 0;
            e = 0;
            loop = function () {
                newsec = angular.copy(sec);
                if ($scope.matrix.length > t) {
                    $scope.debugLog(sec);
                    try {
                        newsec[$scope.matrix[t].pos].content = $scope.randJapChar();
                        newsec[$scope.matrix[t].pos].class = 'matrix lead';
                        $scope.tails.push($scope.matrix[t]);
                    } catch (err) {
                        $scope.debugLog(err);
                    }
                }
                $scope.debugLog($scope.tails);
                angular.forEach($scope.tails, function (tail, n) {
                    if (tail) {
                        if (tail.cnt > 0) {
                            $scope.debugLog(tail);
                            try {
                                newsec[tail.pos].content = $scope.randJapChar();
                                newsec[tail.pos].class = 'matrix tail';
                            } catch (err) {
                                $scope.debugLog(err);
                            }
                        }
                        tail.cnt += 1;
                        if (tail.cnt > tail.len) {
                            $scope.tails.splice(n, 1);
                        }
                    }
                });
                $scope.lines.pop();
                $scope.lines.unshift({input: false, sections: newsec});
                t += 1;
                if ($scope.tails.length === 0) {
                    e += 1;
                }
                if (e < height + 1) {
                    $timeout(loop, 400);
                } else {
                    $scope.commands.clear();
                }
            };
            $timeout(loop, 400);
        }
    };
    $scope.directory = {
        welcome_message: 'Welcome to the console of mc706.com try using help or navigating using the cd, ls, and show commands',
        general: {
            name: 'Ryan McDevitt',
            birthday: '07/06/1991',
            home: '14 Hilltown Pike, Line Lexington PA, 18932',
            email: 'mcdevitt.ryan@gmail.com'
        },
        career: {
            cc1528: {
                title: 'Backend Engineer',
                description: "Worked as a backend developer for Design My Meals. Designed the database, " +
                    "wrote logic processing, and figured out ways to map user input into recipes.",
                responsibilities: "develop backend database structure, mine USDA database, maintenance scripts",
                dates: {
                    start: 'January 2010',
                    end: 'July 2011'
                },
                skills: "MySQL, PHP, Python, Kohana, Access, Advanced Excel",
                url: "http://www.designmymeals.com"
            },
            foxgroup: {
                title: 'Director of Research and Development',
                description: 'Led a small team to leaverage technology to expland the companies offerings and give it an ' +
                    'technical edge over its competitors. Designed, Developed, Implemented, and Maintained many different ' +
                    'solutions including a warehouse system and their business ERP',
                responsibilies: "gather business requirements, plan and propose projects, implement and train employees on systems",
                dates: {
                    start: 'July 2009',
                    end: 'November 2013'
                },
                skills: 'PHP, Python, Django, MySQL, SybaseSQL, Arduino, RFID, AngularJS, javascript, Jquery, Jquery Mobile',
                projects: {
                    onesite: {
                        description: "A site, written in django, that evolved into the business ERP. Handled billing, accounting, " +
                            "warehouse tracking, shipments, customer complaints, helpdesk, and maintenance requests.",
                        technology: 'Python, django, javascript, twitter bootstrap'
                    },
                    doors: {
                        description: "Both an arduino and flask project, this system was designed to use RFID badges to control " +
                            "the door locks. Logged access online and interfaced with onesite for access control",
                        technology: 'python, flask, arduino, RFID, javascript'
                    },
                    interbuilding_tracking_system: {
                        description: "A proposed project to use RFID tags and gates to track the location of physical materials " +
                            "throughout the different processes and facilities. Used websockets to update both job status and " +
                            "material location live on onesite",
                        technology: "django, websockets, rfid, arduino, git, javascript, asynchronous"
                    },
                    data_department: {
                        description: "Was responsbible for founding the companies data department. I setup processes, Quality" +
                            " checks, and trainned employees on the new process. This was a prerequisite in Fox processing their " +
                            "own data and becoming a bulk mail center",
                        technology: "BBC Mail Tech, excel"
                    }
                },
                url: 'http://www.foxgrp.net'
            },
            encompass_elements: {
                title: "Software Engineer",
                description: "A sister company of Fox group, focused more on Marketing and Mail, I came in to help rebuild" +
                    " many of their aging software systems. Worked as part of a team to redesign their Warehouse and Fulfillment " +
                    "system. Ended up identifiying a lack, and rebuilt Onesite from Fox for Encompass, greatly improving their " +
                    "process and project management",
                responsibilities: "write client facing web applicaitons to replace antiquated ones, maintain internal ERP",
                dates: {
                    start: 'October 2012',
                    end: 'November 2013,'
                },
                skills: 'project management, MSSQL, MySQL, CouchDB, AngularJS, Python, Django, Classic ASP, C#, javascript',
                projects: {
                    onesite: {
                        description: 'Complete rebuild of Fox Onesite to include notification systems and a full audit trail, ' +
                            'included more modules and more dynamic interactions. Designed specifically around project mangement and ' +
                            'project design. ',
                        technology: 'MySQL, Python, Django, AngularJS, javascript, html5, css3, git'
                    },
                    brc_tool: {
                        description: 'A web application written in AngularJS and CouchDB, to dynamically create form databases ' +
                            'for fulfilling Business Mail Reply Cards. The application allowed itself to spin new databases with dynamic ' +
                            'structures, allowing for an easy configuration for new input forms',
                        technology: 'AngularJS, CouchDB, javascript, NoSQL, git'
                    },
                    ems: {
                        title: 'Encompass Management System',
                        description: 'The redesigned Warehouse and Fulfillment Management system. Managed a 500,000sq/ft warehouse ' +
                            'and created pick orders from online order. ',
                        technology: 'HTML5, CSS3, C#, Classic ASP, MSSQL, javascript, git'
                    }
                }
            },
            nuix: {
                title: 'Javascript Engineer',
                description: 'Worked on a team in Backbone.JS to build user friendly web interfaces to Nuix\' powerful search and sorting backends',
                dates: {
                    start: 'December 2013',
                    end: 'May 2014'
                },
                skills: "backbone.js, HTML5, CSS3, javascript, git"
            },
            sungard: {
                title: "Senior Software Engineering Consultant",
                description: 'Subcontracted into Comcast Interactive Media',
                dates: {
                    start: 'May 2014',
                    end: 'Present'
                },
                skills: 'javascript, HTML5, CSS3, SASS, Ruby, Cucumber, Selenium, git'
            },
            independant: {
                enteragam: {
                    description: 'Rebuilt a failing wordpress site in angular and django, reducing subsequent page load ' +
                        'times from 800ms to 20ms',
                    technology: 'nginx, angularjs, django, REST APIs, javascript',
                    url: 'http://www.enteragam.com'

                },
                family_home_center: {
                    description: 'Replacing the companies paper records system with a web application to allow for easier data mining',
                    technology: 'AngularJS, Django, Python, REST, HTML5, CSS3, javascript'
                },
                willseye: {
                    description: 'Rebuilding their Rails Application to work in production',
                    technology: 'Ruby on Rails, ruby, javascript'
                }
            }
        },
        social: {
            linkedin: 'http://www.linkedin.com/in/mc706/',
            twitter: 'https://twitter.com/MC706',
            codeeval: 'http://www.codeeval.com/profile/mc706/',
            'codementor.io': 'https://www.codementor.io/mc706',
            github: 'http://github.com/mc706'
        },
        talents: {
            hardware: "arduino",
            software: "python, ruby, javascript, git, mercurial, mysql, mssql, ",
            random: "rubiks cube(45s) ",
            sports: "baseball, bowling (300), golf",
            home: "carpentry, electric wiring, plumbing"
        },
        accomplishments: {
            eagle_scout: "Eagle Scout in Troop 369 out of Trooper PA, Served as Senior patrol Leader",
            cca: "2005 Christopher Columbus Awards $25,000 Community Grant Winner"
        },
        projects: {
            'helm.io': {
                description: 'Project Management and Collaboration tool for contractors that allows the to ' +
                    'easily bill for multiple projects.',
                technology: 'angularjs, django, mysql, javascript',
                url: 'http://gethelm.io/'
            },
            'testit.io': {
                description: 'Plain English Testing Suite Creation. Allows users to create web based test suites ' +
                    'and execute them online',
                technology: 'HTML5, CSS3, django, celery, phantomjs, selenium, javascript'
            },
            'CONECT': {
                description: 'Multithreaded Project Management',
                technology: 'django, mysql, javascript',
                url: 'http://www.getconect.com'
            }
        }
    };
    $scope.pwd = [];
    $scope.getPwd = function () {
        return '/' + $scope.pwd.join('/');
    };
    $scope.current = function () {
        var tree = $scope.directory;
        angular.forEach($scope.pwd, function (dir) {
            tree = tree[dir];
        });
        return tree;
    };

    $scope.buildSearch = function (dir, term, key, prefix) {
        if (prefix) {
            prefix += '/' + key;
        } else {
            prefix = key;
        }
        angular.forEach(Object.keys(dir), function (key) {
            if (typeof dir[key] === "string") {
                if (dir[key].toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    $scope.results.push({key: prefix + '/' + key, value: dir[key]});
                }
            } else if (typeof dir[key] === "object") {
                $scope.buildSearch(dir[key], term, key, prefix);
            }
        });
    };

    $scope.buildTree = function (dir, layer) {
        angular.forEach(Object.keys(dir), function (key) {
            var line = '', i;
            for (i = 0; i < layer; i += 1) {
                line += "|  ";
            }
            line += "|--" + key;
            $scope.debugLog(line);
            $scope.tree.push({input: false, sections: [
                {'class': 'literal', 'content': line}
            ]});
            if (typeof dir[key] === "object") {
                $scope.buildTree(dir[key], layer + 1);
            }
        });
    };

    $scope.autocomplete = function (e) {
        if (e.keyCode === 9) {
            $scope.debugLog($scope.activeInput, $scope.active);
            if ($scope.filtered.length < 2) {
                var possibilities, event, lastword;
                if ($scope.active.length === 1) {
                    possibilities = Object.keys($scope.commands);
                    $scope.filtered = [];
                    angular.forEach(possibilities, function (pos) {
                        if (pos.substr(0, $scope.activeInput.length).toLowerCase() === $scope.activeInput.toLowerCase()) {
                            $scope.filtered.push(pos);
                        }
                    });
                    $scope.active[0].content = $scope.filtered[$scope.selectedIndex];
                    if ($scope.filtered.length === 1) {
                        event = $.Event('keyup');
                        event.which = 32;
                        event.keyCode = 32;
                        $('#inputline').trigger(event);
                        $scope.highlight(event);
                    }
                } else if ($scope.active.length > 1) {
                    possibilities = Object.keys($scope.current());
                    possibilities.push('all');
                    $scope.debugLog(possibilities);
                    angular.forEach(possibilities, function (pos) {
                        lastword = $scope.activeInput.split(' ').splice(-1)[0];
                        $scope.debugLog(lastword, pos, pos.substr(0, lastword.length));
                        if (pos.substr(0, lastword.length).toLowerCase() === lastword.toLowerCase()) {
                            $scope.filtered.push(pos);
                        }
                    });
                    $scope.active[$scope.active.length - 1].content = $scope.filtered[$scope.selectedIndex];
                    if ($scope.filtered.length === 1) {
                        event = $.Event('keyup');
                        event.which = 32;
                        event.keyCode = 32;
                        $('#inputline').trigger(event);
                        $scope.highlight(event);
                    }
                }
            } else {
                $scope.debugLog($scope.filtered);
                if ($scope.filtered.length === $scope.selectedIndex + 1) {
                    $scope.selectedIndex = 0;
                } else {
                    $scope.selectedIndex += 1;
                }
                $scope.active[$scope.active.length - 1].content = $scope.filtered[$scope.selectedIndex];
            }
            e.preventDefault();
        }
    };

    $scope.parseInput = function (e) {
        $scope.activeInput = $scope.activeInput.replace(/\s{2,}/g, ' ');
        var line;
        if (e.keyCode === 13) {
            line = {
                'input': true,
                'sections': $scope.active
            };
            $scope.lines.push(line);
            $scope.active = [];
            $scope.filtered = [];
            $scope.selectedIndex = 0;
            $scope.activeInput = "";
            angular.forEach(line.sections, function (section) {
                if (section.content in $scope.commands) {
                    if (line.sections.length > 1) {
                        $scope.commands[section.content](line.sections[1].content);
                    } else {
                        $scope.commands[section.content]();
                    }
                }
            });
        } else if (e.keyCode === 9) {
            e.preventDefault();
        } else {
            $scope.highlight(e);
        }
    };

    $scope.highlight = function (e) {
        var terms;
        $scope.debugLog('highlighting triggered');
        if (e.keyCode === 32) {
            $scope.debugLog('space event triggered');
            terms = [];
            angular.forEach($scope.active, function (term) {
                terms.push(term.content);
            });
            $scope.activeInput = terms.join(' ') + ' ';
            $scope.filtered = [];
        }
        terms = $scope.activeInput.split(' ');
        $scope.active = [];
        angular.forEach(terms, function (term) {
            var type = 'general';
            if (term in $scope.commands) {
                type = 'keyword';
            }
            $scope.active.push({'class': type, 'content': term});
        });
    };
    $scope.checkSpace = function () {
        return (/\s$/).test($scope.activeInput) ? 'space' : '';
    };
    $scope.limitRows = function () {
        return ($(document).height() / 20 - 3) * -1;
    };
    $scope.debugLog = function (message) {
        if ($scope.debug) {
            console.log(message);
        }
    };
    $scope.randJapChar = function () {
        return String.fromCharCode(Math.floor((Math.random() * 12538) + 12449));
    };
});