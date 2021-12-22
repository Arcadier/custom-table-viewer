(function() {
    var scriptSrc = document.currentScript.src;
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1]; //the plug-in ID of this Custom Table Viewer Plug-In
    var hostname = window.location.hostname;

    $(document).ready(function(){
        //fetch All the content of a custom table
        $(".select-plugin").click(function(){
            //fetching table name and plugin ID input from the user
            var plugin_id = $("input[name='plug_in_id']").val();
            var table_name = $("input[name='table_name']").val();

            //send user's input to backend to be processed - "get_custom_tables.php"
            var body = {
                "plugin_id": plugin_id,
                "table_name": table_name
            };
            var settings = {
                "url": "https://" + hostname + "/admin/plugins/" + packageId + "/get_custom_tables.php",
                "method": "POST",
                "data": JSON.stringify(body)
            };

            //receive response from the backend and render the front end
            $.ajax(settings).done(function(response){
                response = JSON.parse(response);

                //create columns
                var processed_response = order_rows(response.Records) //this process is necessary because the custom table API does not return the table's row values in the same order for each row. This prevents values from different rows to appear in different columns
                createColumns(processed_response);

                //create rows
                var processed_response = order_rows(response.Records) //this process is necessary because the custom table API does not return the table's row values in the same order for each row. This prevents values from different rows to appear in different columns
                createRows(processed_response);
            });

        })

        //searching a table
        $(".query-table").click(function(){
            
            //fetch table and plugin details
            var i = 0;
            var plugin_id = $("input[name='plug_in_id']").val();
            var table_name = $("input[name='table_name']").val();

            //fetch column choice in "In Column" dropdown
            var column_filter = $("select[name='select-column']");
            var options = column_filter[0].children;
            var search_column;

            for(var i=0; i< options.length; i++){
                if(options[i].selected == true){
                    search_column = options[i].innerHTML;
                }
            }

            //fetch search precision from "Precision" dropdown
            var operator_select = $("select[name='select-operator']");
            var operator = operator_select[0].children;
            var operator_choice;

            for(var i=0; i< operator.length; i++){
                if(operator[i].selected == true){
                    operator_choice = operator[i].innerHTML;
                }
            }

            if(operator_choice == "Exact Match"){  //convert the choice of "Precision" to strings our API accepts https://apiv2.arcadier.com/#daff720a-c78e-4eb9-8cf2-98cca3eb4816
                operator_choice = "equal"; 
            }
            else{
                operator_choice = "like";
            }
        
            //fetch text from search bar
            var search_value = $("#query-keywords").val();

            //send all the above inputs to the backend "query_custom_tables.php"
            var body = {
                "Name": search_column,
                "Operator": operator_choice,
                "Value": search_value,
                "plugin_id": plugin_id,
                "table_name": table_name

            };
            var settings = {
                "url": "https://" + hostname + "/admin/plugins/" + packageId + "/query_custom_tables.php",
                "method": "POST",
                "data": JSON.stringify(body)
            }

            //receive response from the backend and render the front end
            $.ajax(settings).done(function(response){
                response = JSON.parse(response);

                //create columns
                var processed_response = order_rows(response.Records) //this process is necessary because the custom table API does not return the table's row values in the same order for each row. This prevents values from different rows to appear in different columns
                createColumns(processed_response);

                //create rows
                var processed_response = order_rows(response.Records) //this process is necessary because the custom table API does not return the table's row values in the same order for each row. This prevents values from different rows to appear in different columns
                createRows(processed_response);
            })
        });

        function createColumns(array){
            if(array.length){
                var table_columns  = document.querySelector(".table > thead > tr")
                removeAllChildNodes(table_columns); //refresh table columns

                var column_filter = $("select[name='select-column']")[0];
                removeAllChildNodes(column_filter); //refresh column names in filter

                //iterate through the column names of the table
                var obj = array[0];
                for(var key in obj){
                    var table_columns  = document.querySelector(".table > thead > tr")
                    var th = document.createElement("th");
                    th.innerHTML = key;

                    //create the columns in the table
                    table_columns.appendChild(th);

                    //create column options in filter
                    var option = document.createElement("option");
                    option.innerHTML = key;
                    column_filter.appendChild(option)
                }
            }
        }

        function createRows(entries){
            var rows = entries;
            var table_rows  = document.querySelector(".table > tbody");
            removeAllChildNodes(table_rows); //refresh table rows

            //iterate through the value of each field of every row in the table
            rows.forEach(row => {
                var table_rows  = document.querySelector(".table > tbody");
                var tr = document.createElement("tr");
                tr.setAttribute("class", "border-hover");
                var obj = row;
                for(var key in obj){
                    var td = document.createElement("td");
                    td.innerHTML = obj[key];
                    tr.appendChild(td);
                }
                table_rows.append(tr)
            });
        }

        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }

        function order_rows(entries){
            var array = [];
            entries.forEach((element, index) => {
                //create a new object (row)
                //keep these columns in the same order (at the beginning of the object)
                var obj = {
                    "Id": element.Id,
                    "CreatedDateTime" : element.CreatedDateTime,
                    "ModifiedDateTime": element.ModifiedDateTime
                };

                //sort the rest of the columns alphabetically
                var ordered = Object.keys(element).sort().reduce(
                    (obj, key) => { 
                        obj[key] = element[key];
                        
                        return obj;
                    }, 
                    {}
                );
                
                //add the sorted columns to the new object
                var new_obj = Object.keys(ordered);
                for(var i=0; i< new_obj.length;i++){
                    obj[new_obj[i]] = ordered[new_obj[i]];
                }

                //add the new object to the rest of the rows
                array.push(obj)
                
            })

            //return the new array of rows with sorted columns
            return array;
        }
    });
})();