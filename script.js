$(document).ready(function() {
    // Function to display selected values for each category
    function displaySelectedValues() {
        // Get selected direction
        var direction = $("#direction option:selected").text();
        $("#selectedDirection").text(direction);

        // Get selected cities
        var cities = $("#cityFilter option:selected").map(function() {
            return $(this).text();
        }).get();
        $("#selectedCities").text(cities.join(", "));

        // Get entered PIN code
        var pinCode = $("#inputField").val();
        $("#selectedPinCode").text(pinCode);

        // Get selected age ranges
        var ageRanges = $("#ageFilter option:selected").map(function() {
            return $(this).text();
        }).get();
        $("#selectedAgeRanges").text(ageRanges.join(", "));

        // Get selected genders
        var genders = $("#genderFilter option:selected").map(function() {
            return $(this).text();
        }).get();
        $("#selectedGenders").text(genders.join(", "));
    }

    // Event listener for form elements
    $("select, input").change(displaySelectedValues);

    // Initial display of selected values
    displaySelectedValues();
});
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.996.0.min.js"></script>
	
        function increaseLimit() {
    var limitField = document.getElementById('limit');
    limitField.value = parseInt(limitField.value) + 1;
}

function decreaseLimit() {
    var limitField = document.getElementById('limit');
    limitField.value = parseInt(limitField.value) - 1;
    if (limitField.value < 1) {
        limitField.value = 1;
    }
}

		// Set up AWS credentials
		AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.Credentials('AKIAQ6FXL22LTJRLMI4C', 'T2luxgWfcGvnHB/EizBGFBeRlgJIUQU3tCluwVew');
		function runQuery() {
    var queryType = document.querySelector('input[name="queryType"]:checked').value;
    var selectedFilters = [];
    if (queryType == 'single') {
        var limit = document.getElementById('limit').value;
        var query = 'SELECT ';
        var filters = document.getElementsByName('filter');
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].checked) {
                selectedFilters.push(filters[i].value);
            }
        }
        if (selectedFilters.length > 0) {
            query += selectedFilters.join(', ');
        } else {
            query += '*';
        }
        query += ' FROM "website"."connectweb"';

        // Retrieve user input for WHERE, ADD, and LIKE values
        var whereValue = document.getElementById('where').value;
        var andValue = document.getElementById('and').value;
        var likeValue = document.getElementById('like').value;
        var andsValue = document.getElementById('ands').value;

        // Add WHERE, ADD, and LIKE clauses to the query string if user input is provided
        if (whereValue) {
            query += ' WHERE ' + whereValue;
        }
        if (andValue) {
            query += ' AND ' + andValue;
        }
        if (andsValue) {
            query += ' AND ' + andsValue;
        }
        if (likeValue) {
            query += ' LIKE ' + "'" +'%' + likeValue + '%' + "'";
        }

        query += ' LIMIT ' + limit + ';';
    } else if (queryType == 'multiple') {
        selectedFilters = document.getElementById('query').value.split(',').map(function(item) {
            return item.trim();
        });
        query = 'SELECT ' + selectedFilters.join(', ') + ' FROM "website"."connectweb" LIMIT 10;';
    } else {
        query = 'SELECT * FROM "website"."connectweb" LIMIT 10;';
    }

    document.getElementById('query').value = query;
    var params = {
        QueryString: query,
        ResultConfiguration: {
            OutputLocation: 's3://consumer-athena/query-output/'
        }
    };

            var athena = new AWS.Athena();

            athena.startQueryExecution(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    checkQueryStatus(data.QueryExecutionId);
                }
            });
        }

        function checkQueryStatus(queryId) {
            var athena = new AWS.Athena();

            athena.getQueryExecution({ QueryExecutionId: queryId }, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    var status = data.QueryExecution.Status.State;
                    if (status == 'QUEUED' || status == 'RUNNING') {
                        setTimeout(function() { checkQueryStatus(queryId); }, 5000);
                    } else if (status == 'SUCCEEDED') {
                        getQueryResults(queryId);
                    } else {
                        window.alert('Query failed: ' + data.QueryExecution.Status.StateChangeReason);
                    }
                }
            });
        }

        function getQueryResults(queryId) {
    var athena = new AWS.Athena();

    athena.getQueryResults({ QueryExecutionId: queryId }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            var results = document.getElementById('results');
            results.innerHTML = '';

            if (data.ResultSet.Rows.length == 0) {
                results.innerHTML = '<p>No results found.</p>';
                return;
            }

            var table = document.createElement('table');

            // Create table header row
            var headerRow = document.createElement('tr');
            data.ResultSet.ResultSetMetadata.ColumnInfo.forEach(function(column) {
                var headerCell = document.createElement('th');
                headerCell.appendChild(document.createTextNode(column.Name));
                headerRow.appendChild(headerCell);
            });
            table.appendChild(headerRow);

            // Create table data rows
            data.ResultSet.Rows.forEach(function(row) {
                var dataRow = document.createElement('tr');
                row.Data.forEach(function(cell) {
                    var dataCell = document.createElement('td');
                    dataCell.appendChild(document.createTextNode(cell.VarCharValue));
                    dataRow.appendChild(dataCell);
                });
                table.appendChild(dataRow);
            });

            results.appendChild(table);
        }
    });
}
