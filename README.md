# Custom Table Viewer

The plugin does the following things:
* Display all the contents of 1 custom table at a time. You can change the custom table displayed by specifying the table name and click on "Fetch Table Contents" again
* Search for an exact value in your table. You need to specify the column you are searching in and the precision of your matching ("Exact Match").
* Search for a keyword in your table. You need to specify the column you are searching in and the precision of your matching ("Similar To"). This will search for values that are similar to your keyword.
Fetching all the contents of a table:

![](https://bootstrap.arcadier.com/github/download.png)

**Searching for an Exact Value:**

![](https://bootstrap.arcadier.com/github/download%20%281%29.png)

**Searching for a keyword:**

![](https://bootstrap.arcadier.com/github/image.png)

**The code:**

You will find that the code for this plugin is pretty straightforward:
* An HTML file to render the static content of the page (index.html)
* A JS script to handle taking inputs from the page and sending them to the backend, receiving responses and generating the table as you see in the screenshots (scripts.js)
* 2 PHP scripts:
  * One receives the inputs Plugin ID and Table Name to fetch all of the custom table's contents, calls the [Get All Custom Table Contents API](https://apiv2.arcadier.com/#6f7116b6-bf6a-4a59-b1a2-832f31254148), and sends back the response to the JS script for rendering. (get_custom_tables.php)
  * One receives the filter parameters necessary to do searches, calls the [Search Table API](https://apiv2.arcadier.com/#daff720a-c78e-4eb9-8cf2-98cca3eb4816), and sends back the response to the JS script for rendering. (query_custom_table.php)
The scripts are commented and structured in a way to help you understand the flow of logic across the whole plugin.


![](https://bootstrap.arcadier.com/github/download%20%282%29.png)

**Questions you might have:**

* *The HTML file does not have the script linked to it using the ```<script>``` tag. Why?*
  * On our marketplaces, its a nice thing we have that if your JS script is called "scripts.js" it will automatically run on any page of the admin portal (if its in the admin folder). If you want your script to run only on 1 specific page, then you can give it another name like "item.js" and now you make sure you include your ```<script>``` tag in your index.html.
  <br>

* *The PHP scripts include an "admin_token.php" but there's no such file in the ZIP file.*
  * The functions in the screenshot below need that file to work properly. "admin_token.php" is an auto-generated file that gets included in your plugin and allows your plugin to automatically fetch the marketplace domain and the administrator token without you having to hardcode your client ID and client secret in your own file. So, all you have to do is the following: (line 8 and line14)

  ![](https://bootstrap.arcadier.com/github/thumbnail_PHP%20script.png)

  * "getAdminToken()" on line 8 is simply calling the [Log In/Get Admin Token API](https://apiv2.arcadier.com/#af2783ba-c16c-4ff4-a815-5d45f99aaf1a) with the marketplace's credentials and receives the same response as in our documentation. Hence, the reason why  $admin_token['access_token'] ​is present on line 14 to extract the "access_token".

* *How do I use the callAPI() function?*
* It takes 4 different parameters:
  * Method - "GET", "POST", "PUT", "DELETE" (strings)
  * Authentication token - can be just ```$admin_token['access_token']​```, ​if you included the "admin_token.php" in your PHP script
  * Endpoint URL - string
  * Request data - PHP JSON objects. You can see an example in the "query_custom_tables.php" file. Set to false if a request body is not required.
* When in doubt, you can open the "callAPI.php" file itself and see the function definition.
