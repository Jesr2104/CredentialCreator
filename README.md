# Credential Creator

This is a simple web app for generating credentials using an HTML canvas. The application allows the user to enter a list of people who will be the participants of the event, and then generates the personalized credentials that will be downloaded in a compressed file.

## How it works

The application consists of an HTML page that contains a button to load the list in a table on the web. When the user loads the list, the app is ready to generate the credentials, so all that remains is to press the button to generate certificates, the application uses JavaScript to create a canvas element and draw the custom credential on it.

The canvas element is then converted to an image file using the toDataURL() method, which returns a base64-encoded string representing the image data. Then, the application creates a link element with the href attribute set to the base64-encoded string, once all the credentials are ready, all that remains is to generate a Zip file with all of them and send them to download.

Regarding the format in that, this app receives the list of data, these will be accepted in CSV format, which is nothing more than a file separated by commas "," and will have the following structure.

| Name           | Institution                                 | Country         |
|----------------|---------------------------------------------|----------------|
| Alice Johnson  | University of Oxford                        | United Kingdom |
| Bob Smith      | Massachusetts Institute of Technology (MIT) | United States   |
| Carla Rodriguez| University of Buenos Aires                  | Argentina       |
| David Lee      | Seoul National University                   | South Korea     |
| Emma Thompson  | University of Cambridge                     | United Kingdom |

The CSV file can be generated very easily from an Excel file, just by exporting the Excel file in CSV format.

## Credits
The application was created by Jorge Soto Ramos as a sample project for to solve the problem of generating a large number of credentials for an event, and thus automate the task of generating credentials.

The application uses the following third-party libraries:

- HTML
- CSS
- Javascript

- JSZip - for creating ZIP files in JavaScript
- Bulma - for styling the application and buttons

## License
This project is licensed under the MIT License - see the LICENSE file for details.
