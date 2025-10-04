const uploadButton = document.getElementById("upload")
uploadButton.addEventListener("change", ()=> { 
    console.group("File Upload")
    console.log("Hi there")
    // Get the file list from the input element
    const files = uploadButton.files;
    console.log(files)
    if(files.length !== 1) {
        alert("Please upload exactly one file.");
        return;
    }

    const file = files[0];
    if (!validateFile(file)) {
        return;
    }

    const reader = unzipFile(file);
    console.log()

    drawGraph(ctx);
    
    console.groupEnd()
});

function validateFile(file) {
    const validTypes = ['application/zip'];
    if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a zip file.");
        return false;
    }
    return true;
}

function unzipFile(file) {
    //Unzip the file by writing our own unzipper
    const reader = new FileReader();
    reader.onload = (event) => {
        JSZip.loadAsync(event.target.result).then(function(zip) {
            Object.keys(zip.files).forEach(function(filename) {
                zip.files[filename].async('string').then(function(content) {
                    reader.result = content;
                    console.log(`File: ${filename}`);
                });
            });
        });
    }
    reader.readAsArrayBuffer(file);
    return reader;
}

const graph = document.getElementById("graph")
const ctx = document.getElementById('acquisitions').getContext('2d');

function drawGraph(ctx) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
            datasets: [{
                label: 'Number of Acquisitions',
                data: [10, 20, 15, 25, 30, 22, 28],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}