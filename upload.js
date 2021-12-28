// A reference to the input element that will contain the file
const inputFile = document.getElementById("file-to-upload");
const results = document.getElementById("results");

// The function that is invoked when a user selects the file
async function sendFile() {
  // Capture the first file from input element
  const [theFile] = inputFile.files;

  // The mutation that will be used to upload the file
  const query = `
    mutation upload($file: Upload!) {
        uploadCloudinary(file: $file) {
            url
        }
    }
  `;

  // The operation contains the mutation itself as "query"
  // and the variables that are associated with the arguments
  // The file variable is null because we can only pass text
  // in operation variables
  const operation = {
    query,
    variables: {
      file: null,
    },
  };

  // This map is used to associate the file saved in the body
  // of the request under "0" with the operation variable "variables.file"
  const map = { 0: ["variables.file"] };

  // This is the body of the request
  // the FormData constructor builds a multipart/form-data request body
  // Here we add the operation, map, and file to upload
  const body = new FormData();
  body.append("operations", JSON.stringify(operation));
  body.append("map", JSON.stringify(map));
  body.append(0, theFile);

  // Create the options of our POST request
  const opts = {
    method: "POST",
    body,
  };

  // Send the fetch request to the API
  // Parse the response as json and obtain the resulting data
  const { data } = await fetch("http://localhost:3000/graphql", opts).then(
    (res) => res.json()
  );

  // Render the results of the uploadFile mutation
  // With plane old JavaScript
  showStats(data.uploadCloudinary);
}

// A function to reset the form so users can add another file
function reset() {
  inputFile.style = " display: block; ";
  results.innerHTML = "";
}

// A function that displays the results on the page
function showStats({ url }) {
  inputFile.style = " display: none; ";
  results.innerHTML = `
    <p>
      <b>url</b>: ${url}
    </p>
    <button onclick="reset()">upload another file</button>
  `;
}
