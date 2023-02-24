const generateCredentialsButton = document.getElementById('generateCredentials');
const table = document.getElementById('table-list-credentials');
const loadUsersButton = document.getElementById('loadUsers');
const fileInput = document.getElementById('inputUsers');

function readCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => {
            const csvData = reader.result;
            const lines = csvData.split('\n');
            const result = [];
  
            for (let i = 1; i < lines.length; i++) {
                const [name, institution, country] = lines[i].split(',');
                result.push({
                    name: name.trim(),
                    institution: institution.trim(),
                    country: country.trim()
                });
            }
  
            resolve(result);
        };
    
        reader.onerror = () => { reject(new Error('Failed to read file')); };    
        reader.readAsText(file);
    });
}

function loadTable(data_list) { 
    // Create a table header
    const header = table.createTHead();

    // Create a row for the header
    const row = header.insertRow();

    // Insert cells into the row and set their text content
    const cell1 = row.insertCell();
    cell1.innerHTML = '<span id="titleTable">Name</span>';
    const cell2 = row.insertCell();
    cell2.innerHTML = '<span id="titleTable">Institution</span>';
    const cell3 = row.insertCell();
    cell3.innerHTML = '<span id="titleTable">Country</span>';
    
    for (const item of data_list) {
        const row = table.insertRow();
        
        const nameCell = row.insertCell();
        nameCell.textContent = item.name;
        
        const institutionCell = row.insertCell();
        institutionCell.textContent = item.institution;
        
        const countryCell = row.insertCell();
        countryCell.textContent = item.country;
    }    
    return table;
}

function divideString(str) {
    const middleIndex = Math.floor(str.length / 2);
    const firstHalf = str.substring(0, middleIndex);
    const secondHalf = str.substring(middleIndex);
    return [firstHalf, secondHalf];
}

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function generateImageWithText(imageUrl, name, institution, country) {
    return new Promise((resolve, reject) => {
        // Create a new image element
        const img = new Image();

        // size of the texts
        const nameSize = 65;
        const institutionSize = 50;
        const countrySize = 50;
        
        // Set the source to the provided URL
        img.src = imageUrl;
        
        // When the image is loaded, draw it onto a canvas along with the text
        img.onload = () => {
            // Create a new canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Get the canvas 2D context and draw the image onto it
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Set font and fill style for the text
            ctx.fillStyle = '#000';
            
            // Calculate the center point of the canvas
            const centerX = canvas.width / 2;
            const centerY = 1350;

            var spaceName = centerY;
            var spaceInstitution = spaceName + 120;
            var spaceCountry = spaceInstitution + 120;
            
            // Draw the name, institution, and country text onto the canvas at the center
            ctx.font = `bold ${nameSize}px Helvetica`;
            const nameWidth = ctx.measureText(name).width;
            ctx.fillText(name, centerX - (nameWidth / 2), spaceName);

            ctx.font = `${institutionSize}px Helvetica`;
            const instWidth = ctx.measureText(institution).width;

            if(instWidth > (centerX*2)- 100){
                ctx.font = `${institutionSize}px Helvetica`;
                const result = divideString(institution);

                const instPortionAWidth = ctx.measureText(result[0]).width;
                ctx.fillText(result[0], centerX - (instPortionAWidth / 2), spaceInstitution);

                const instPortionBWidth = ctx.measureText(result[1]).width;
                ctx.fillText(result[1], centerX - (instPortionBWidth / 2), spaceInstitution + 80);

                spaceCountry = spaceInstitution + 200;
        } else {            
            ctx.fillText(institution, centerX - (instWidth / 2), spaceInstitution);
        }
        
        ctx.font = `bold ${countrySize}px Helvetica`;
        const countryWidth = ctx.measureText(country).width;
        ctx.fillText(country, centerX - (countryWidth / 2), spaceCountry);
        
        // Create a new image element with the canvas as its source
        const newImg = new Image();
        newImg.src = canvas.toDataURL();
        
        // When the new image is loaded, resolve the Promise with it
        newImg.onload = () => resolve(newImg);
      };
      
      // If there's an error loading the image, reject the Promise
      img.onerror = () => reject(new Error('Failed to load image'));
    });
}

function downloadCanvasImagesAsZip(canvasArray) {
    // Create a new JSZip instance
    var zip = new JSZip();
    
    // Iterate through each canvas element in the array
    canvasArray.forEach((canvas, index) => {
      // Create a new filename for the canvas image
      const filename = `credential_${index}.png`;
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.src;
      
      // Add the canvas image to the zip file
      zip.file(filename, dataUrl.substr(dataUrl.indexOf(',') + 1), {base64: true});
    });
    
    // Generate the zip file asynchronously
    zip.generateAsync({type: 'blob'}).then(function(content) {
      // Create a new anchor element to download the zip file
      const link = document.createElement('a');
      link.download = 'credential_images.zip';
      
      // Create a URL for the zip file
      const url = window.URL.createObjectURL(content);
      link.href = url;
      
      // Add the anchor element to the DOM and trigger a click event to start the download
      document.body.appendChild(link);
      link.click();
      
      // Remove the anchor element and URL from the DOM
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
}  

loadUsersButton.addEventListener('click', () => {
    fileInput.click();
});

generateCredentialsButton.addEventListener('click', () => {
    openModal();
    const background = "background.png";
    const rows = table.rows;
    const promises = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i]; 

        var name = row.cells[0].textContent;
        var institution = row.cells[1].textContent;
        var country = row.cells[2].textContent;

        const promise = generateImageWithText(
            background, 
            name, 
            institution, 
            "("+country.toUpperCase()+")"
        )
            .then((img) => { 
                document.getElementById('modal-content').appendChild(img);
                return img;
            })
            .catch((err) => { console.error(err); });

        promises.push(promise);
    }

    Promise.all(promises)
        .then((canvasArray) => {
            console.log(canvasArray.length);
            console.log(rows.length);
            downloadCanvasImagesAsZip(canvasArray);
        });
});

fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    readCSV(selectedFile)
        .then((data) => { 
            loadTable(data);
            generateCredentialsButton.disabled = false;
        })
        .catch((error) => { console.log(error); });
});