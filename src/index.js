const readline = require("readline");
const btreejs = require("btreejs");

function createDateTime(dateStr, timeStr) {
    return new Date(dateStr + "T" + timeStr + "Z");
}

function main() {
    // Skapa b-träd för skift, med starttid som nyckel
    const ShiftsTree = btreejs.create(2, (dateA, dateB) => {
        if (dateA.getTime() < dateB.getTime())
            return -1;
        else if (dateA.getTime() > dateB.getTime())
            return 1;
        else
            return 0;
    });
    const shiftsTree = new ShiftsTree();

    // Lista med tillgänglighet
    const availability = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', line => {
        const arr = line.split(" ");
        const typeIdentifier = arr[0];
        const rowId = arr[1].substr(0, arr[1].length - 1);
        const startDateTime = createDateTime(arr[2], arr[3]);
        const endDateTime = createDateTime(arr[5], arr[6]);

        if (typeIdentifier == "Shift") {
            // Kolla om det redan finns skift för den här starttiden
            const shiftList = shiftsTree.get(startDateTime);
            if (shiftList === undefined) {
                // Finns inte, skapa ny lista
                shiftsTree.put(startDateTime, [{
                    rowId: rowId,
                    endDateTime: endDateTime,
                    textLine: line
                }]);
            } else {
                // Finns, lägg till skift till listan
                shiftList.push({
                    rowId: rowId,
                    endDateTime: endDateTime,
                    textLine: line
                })
                shiftsTree.put(startDateTime, shiftList);
            }
        } else if (typeIdentifier == "Availability") {
            availability.push({
                rowId: rowId,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                textLine: line
            });
        }
    });

    rl.on('close', () => {
        // Allt är inläst, stega igenom tillgängligheter
        availability.forEach(val => {
            process.stdout.write(val.textLine + "\n\n");
            // Hämta alla skift som startar mellan start- och sluttid för tillgängligheten
            shiftsTree.walk(val.startDateTime, val.endDateTime, (key, shiftList) => {
                shiftList.forEach(shift => {
                    // Kontrollera sluttiden för skift
                    if (shift.endDateTime.getTime() <= val.endDateTime.getTime())
                        process.stdout.write("    " + shift.rowId + "\n");
                });
            });
            process.stdout.write("\n");
        });
    });
}

if (require.main === module) {
    main();
}