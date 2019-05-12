$(document).ready(function () {
 window.alert('Working!')
    // When the user loads up the page
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 3600000;
    var replaceKey = {};
    var combosTook = 0;
    var startTime = 0;
    var endTime = 0;

    // Note: all of this below is just declearing the functions and they are not being run

    function factorial(max, num, state) {
        // Max is # of items per combo, num is length of array and state is repeating chars or not.
        startTime = new Date().getTime();
        // Gets the date so we can compare later to see how long this took
        let fact = 1;
        // Factorials start 1 once cause of Mutipliplying
        if (state === "no-repeat" && max === num) {
            for (let i = 1; i <= max; i++) {
                // I will start at 1 and do 1*2*3*4*5
                fact *= i;
                // This looks like:
                // 1 * 1 = 1
                // 1 * 2 = 2
                // 2 * 3 = 6
                // 6 * 4 = 24
            }
        } else if (state === "no-repeat" && max < num) {
            // If my max is less then my num
            for (let i = num; i > num - max; i--) {
                // Will go from top to bottom like 5*4*3...
                fact *= i;
                // This looks like:
                // 1 * 4 = 4
                // 4 * 3 = 12
                // 12 * 2 = 24
                // Stops before 1
            }
        } else if (state === "repeat") {
            fact = Math.pow(num, max);
            // Now if i want to repeat its just expoents
        }
        return fact;
        // return this #
    }

    function replaceChar(string) {
        string = string.split("");
        // Creates a array of the string
        for (let i = 0; i < string.length; i++) {
            // Goes through array
            replaceKey[i] = string[i];
            // It will store each chacaters index in a object, called replaceKey
            // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
            string[i] = i;
            // This code will turn a string like "hello" into [0,1,2,3,4].
        }
        return string;
    }

    function combinationGen(
        string,
        fact,
        state,
        max,
        roundPercent,
    ) {
        combosTook = 0;
        let percentage = 0;
        let unit = 0;
        let currentTime = 0;
        let backup = [...string];
        // Creates a backup of my new chipered string
        let combination = [];
        // each combination
        let combinations = [];
        // List of my total combinations
        let percentBackup = 0;
        // So i can compare percentage
        while (combinations.length < fact) {
            // While my desired combinations is less then the amount i have now
            while (combination.length < max) {
                // This loop is for each combination
                let randomIndex = Math.floor(Math.random() * string.length);
                // Picks a random number from 0 to the length of my string
                combination.push(string[randomIndex]);
                // pushes this new random character to my cobination
                if (state === "no-repeat") {
                    string.splice(randomIndex, 1);
                    // if i do not want to repeat chacaters then i remove that item from the string.
                }
            }
            combosTook += 1;
            for (let j of combinations) {
                // Goes through my combinations list
                if (j.join("") === combination.join("")) {
                    // If my new combination matches any combinations in my list
                    combination = [];
                    // Then i reset the combination
                }
            }
            if (combination.length > 0) {
                // reseting the combination makes it length 0
                combinations.push(combination);
                // So if it isn't 0 then i know it isn't a repeat and can now push it to my total list
                combination = [];
            }
            percentage = Math.round(combinations.length / fact * 100 * roundPercent) / roundPercent;
            percentage = Number(percentage)
            unit = "ms";
            currentTime = new Date().getTime() - startTime;
            if (currentTime >= 50000 && unit === "ms") {
                currentTime = Math.round(currentTime /= 1000);
                unit = "sec";
                // turns time into seconds after 50000 milliseconds
            } else if (currentTime >= 600 && unit === "sec") {
                currentTime = Math.round(currentTime /= 60);
                unit = "min";
                // turns time into minutes after 600 seconds
            }
            if (Math.floor(percentBackup) < Math.floor(percentage)) {
                $("#combos_tried").html(combosTook)
                $("#combos_passed").html(`${combinations.length}/${fact}`)
                $("#gap").html(combosTook -
                    combinations.length)
                $("#current_time").html(`${currentTime} ${unit}`)
                $("#percent").html(percentage + "%")
            }
            percentBackup = percentage
            string = [...backup];
            // reverts my string to the backup just encase i removed anything from it
        }
        $("#combos_tried").html(combosTook)
        $("#combos_passed").html(`${combinations.length}/${fact}`)
        $("#gap").html(combosTook - combinations.length)
        $("#current_time").html(`${currentTime} ${unit}`)
        $("#percent").html(percentage + "%")
        return combinations.sort();
        // returns sorted combinations (looks cool)
    }

    function decodeCombinations(combinations) {
        // Now i need to decod emy combinations from a list of numbers to letters
        for (let i = 0; i < combinations.length; i++) {
            // Go through my combinations list
            combinations[i] = combinations[i].map(x => (x = replaceKey[x]));
            /* 
            I map each combination and say each number (x) in a combination, 
             is now equal to its value in my key (replaceKey). Eahc number has a value, which is a chacater, determined by the user input.
            */
            combinations[i] = combinations[i].join("");
            // Join each combination in te array
        }
        combinations = combinations.sort();
        // Then sort again.
        let strCombinations = "";
        for (let i = 0; i < combinations.length; i++) {
            if (i === 0) {
                strCombinations += "" + combinations[i];
            } else {
                strCombinations += ", " + combinations[i];
            }
            /* 
            All these if statements above does is format my combinations. Adds a comma inbetween each one or does not if it       is the first combo so it doesn't look like ,1234, 1324 instead of 1234, 1324
            */
        }
        return strCombinations;
    }
    $("#run").click(function () {
        // WHen the user click on the run button...
        function runInput(max, string, state, roundPercent) {
            // Note: This is the master function to control all of the functions above. Keep in mind you need to declare ..click() functions when you load up the page
            if (state === "no-repeat" && max > string.length) {
                window.alert("Error: Impossible Parameters");
                // It is impossible to make a combination that has more cahcaters thenmy string without repeating characters.
                return;
            } else {
                // Now i will show this since i can do the calcualtions error free
                let possibleCombos = factorial(max, string.length, state);
                // Now i can run all of the functions. Here is me getting my factorial
                $("#factorial").html("Possible Combinations: " + possibleCombos);
                // Showing that factorial on HTML
                string = replaceChar(string);
                // Running the Chipher function
                $("#replaceKey").html(JSON.stringify(replaceKey));
                // Showing the replaceKey on html with JSON formatiing
                let combinations = combinationGen(string, possibleCombos, state, max, roundPercent);
                // Now i get my list of combinations.
                combinations = decodeCombinations(combinations);
                // Now i decode and format the combinations
                endTime = new Date().getTime();
                // Now i grab my end time of the program
                let time = endTime - startTime;
                // Now i can tell how many milliseconds it took to run the program.
                $("#combinations").html(combinations);
                // Shows my combinations
                time = 0;
                combosTook = 0;
                endTime = 0;
                startTime = 0;
                // Resets all my varabiles
            }
        }
        let state = $("#state").val();
        let string = $("#input_string").val();
        let max = Number($("#max").val());
        let roundPercent = $("#round_selection").val();
        runInput(max, string, state, roundPercent);
        // Runs the runInput function which is the master function
    });
});

// speacial thanks to lasjorg
