

var tbody = document.querySelector("tbody");
var dateInput = document.querySelector("#dateInput");
var searchBtn = document.querySelector("#search");

// console.log(tbody,dateInput,searchBtn);

var searchedevents = dataSet ;

var Numberofevent1 = 0;
var Numberofevent2 = searchedevents.length;

//show the table

function renderTable() {
    tbody.innerHTML = "";
    for (var i = Numberofevent1; i < Numberofevent2; i++) {
      var date = searchedevents[i];
      var fields = Object.keys(date);
      // Create a new row in the tbody, set the index to be i + startingIndex
      var $row = tbody.insertRow(i);
      for (var j = 0; j < fields.length; j++) {
        // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = date[field];
      }
    }
  }


renderTable();

// //search button
// searchBtn.addEventListener("click", handleSearchButtonClick);
// // searchBtn.onclick = handleSearchButtonClick();
// function handleSearchButtonClick() {
//   console.log("Click kard!");
//   // Format the user's search by removing leading and trailing whitespace, lowercase the string
//   var filterDate = dateInput.value.trim();//.toLowerCase();
//
//   // Set filteredAddresses to an array of all addresses whose "state" matches the filter
//   filteredSearchedEvents = searchedevents.filter(function(el) {
//     var datetime = el.datetime;
//
//     // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
//     return datetime === filterDate;
//   });
//   searchedevents = filteredSearchedEvents;
//   renderTable();
// }


//pagination


$(document).ready(function() {
    $('#myTable').DataTable( {
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    } );
} );








// "datetime": "1/1/2010",
// "city": "benton",
// "state": "ar",
// "country": "us",
// "shape": "circle",
// "durationMinutes": "5 mins.",
// "comments": "4 bright green circles high in the sky going in circles then one bright green light at my front door."
