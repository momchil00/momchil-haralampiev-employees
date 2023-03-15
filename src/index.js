const FileForm = document.getElementById("FileForm");
const csvFile = document.getElementById("csvFile");

function HandlingEmployeeWorkTime(str, delimiter = ";") {
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const empl = rows.map(function (row) {
        let values = row.split(delimiter);
        values[3] = values[3].replace('\r', '');
        values[2] = values[2].replace('\r', '');
        return values;
    });

    let pairs = {};
    let daysTogether = {};

    if (empl)

        empl.forEach((el1) => {
            empl.slice(empl.indexOf(el1) + 1, empl.length).forEach((el2) => {
                if (el1[0] !== el2[0]) {

                    const startDate1 = new Date(el1[2]);
                    const endDate1 = el1[3] === "NULL" ? new Date() : new Date(el1[3]);
                    const startDate2 = new Date(el2[2]);
                    const endDate2 = el2[3] === "NULL" ? new Date() : new Date(el2[3]);
                    if (el1[1] === el2[1]) {
                        if (startDate1 <= endDate2 && startDate2 <= endDate1) {
                            const start = startDate1 <= startDate2 ? startDate2 : startDate1;
                            const end = endDate1 <= endDate2 ? endDate1 : endDate2;
                            if (end >= startDate2) {
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const x = `${el1[0]}${el2[0]}`;
                                if (!daysTogether[x]) Object.assign(daysTogether, { [x]: 0 });
                                daysTogether[x] = 1 * daysTogether[x] + diffDays;
                                if (!pairs[x]) Object.assign(pairs, { [x]: [] });
                                pairs[x] = [...pairs[x], [el1[0], el2[0], el1[1], diffDays]];
                            }
                        }
                    }
                }
            });
        });

    console.log(daysTogether);

    if (Object.keys(daysTogether).length === 0) {
        return 'No results'
    } else {

        return pairs[
            Object.keys(daysTogether).reduce((a, b) =>
                daysTogether[a] > daysTogether[b] ? a : b
            )
        ];
    }

}

FileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = HandlingEmployeeWorkTime(text);
        document.getElementById("result").innerHTML =
            `<h3>The result is: </br> ${JSON.stringify(data)}</h3>`;
    };
    reader.readAsText(input);
});
