
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        action();
    }
}

whenDocumentLoaded(() => {
    // Search function
    const el_name = document.getElementById("name_button");
    const input_name = document.getElementById("student_name");
    el_name.addEventListener("click", () => {
        const name = input_name.value;
        setup(name);
    }, false);

    input_name.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) { // Enter pressed
            event.preventDefault();
            el_name.click();
        }
    });
    d3.json("student.json").then(function (json) {
        const athletes = Object.keys(json);
        // Source: https://goodies.pixabay.com/javascript/auto-complete/demo.html
        new autoComplete({
            selector: '#student_name',
            minChars: 1,
            source: function (term, suggest) {
                term = term.toLowerCase();
                var suggestions = [];
                for (i = 0; i < athletes.length; i++)
                    if (~(athletes[i]).toLowerCase().indexOf(term)) {
                        suggestions.push(athletes[i]);
                    }
                suggest(suggestions);
            },
        });
    });
});







function setup(name_sciper) {

    var sciper = name_sciper.split("(")[1].split(")")[0];

    var file = "student_courses_2019.csv";

    $('#race-table').html('');


    var header_name = ["Hours", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

    // use es6 string templates to populate rows
    const rowTemplate = (d) => {
        return " <td>"+ d.join("</td><td>") +"</td>";
    };

    function hours_to_array(hours){
        var hours = hours.split("-");
        var start = parseInt(hours[0].split(":")[0]);
        var end = parseInt(hours[1].split(":")[0]);
        var ans = [];
        for (let i = start; i < end; i++) {
            ans.push(i);
        }
        return ans;
    }


    const string_hours = ["8-9", "9-10", "10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19"];
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const days = ["HOUR", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"];

    
    d3.select("#name").text(name_sciper);

    // read data from the url
    d3.csv(file).then(function (data) {
        var filtered = data.filter(d => d.sciper === sciper);

        var schedule = new Array(hours.length).fill("");

        for (var i in schedule) {
            schedule[i] = new Array(days.length).fill("-");
            schedule[i][0] = string_hours[i];
        }

        for (var i in filtered){
            var course_hours = hours_to_array(filtered[i].hours);
            var day = days.indexOf(filtered[i].day);
            for (var j in course_hours){
                var hour = hours.indexOf(course_hours[j]);      
                var course_name = filtered[i].course + " (" + filtered[i].hour_type + ")";//+ ", " + filtered[i].classroom + ")";
                if (schedule[hour][day] === "-") {
                    schedule[hour][day] = course_name
                } else {
                    schedule[hour][day] = schedule[hour][day] + "/" + course_name
                }

            }
        }

        const table = d3.select("#race-table").append("table").attr('class', 'table table-striped table-hover mt-2');

        // append headers
        const header = table.append("thead").attr('class', 'thead-dark')
            .selectAll('th')
            .data(header_name)
            .enter()
            .append('th')
            .text(d => d);

        // append rows with rowTemplate
        const rows = table.append("tbody")
            .selectAll("tr")
            .data(schedule)
            .enter()
            .append("tr")
            .html(rowTemplate)

    });
}