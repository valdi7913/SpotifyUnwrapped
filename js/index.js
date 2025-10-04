import { createBarChart, removeChart } from './chart.js';

const db = new Dexie("SpotifyGraphsDB");

db.version(1).stores({
    test: 'id,key,value', // Primary key and indexed props

    // Dimension tables
    albums: '++id, album_key, album_uri, album_name, album_release_date, album_total_tracks, album_image_url',
    artists: '++id, artist_key, artist_uri, artist_name, artist_followers, artist_popularity',
    songs: '++id, song_key, track_uri, track_name, duration_ms, popularity, is_explicit',
    dates: '++id, date_key, full_date, year, month, day, day_of_week',

    // Fact table
    listens: '++id, the_timestamp, the_date_key, song_key, album_key, ms_played, timestamp_utc, timestamp_utc_string',

    // Bridge table for many-to-many relationship
    listenArtistBridge: '++id, listen_id, artist_key'
});

const uploadButton = document.getElementById("upload")
const clearButton = document.getElementById("clear")

const options = {
    artist: [],
    album: [],
    song: [],
    date: []
}

function update(options) {
    console.log("Updating UI")
    console.log(db)
    db.test.count().then(count => {
        if (count > 0) {
            uploadButton.style.display = "none";
            clearButton.style.display = "";
            drawBasicGraph('graph', db);
        }
        else {
            uploadButton.style.display = "";
            clearButton.style.display = "none";
            console.log("No data in DB");
            removeChart('graph');
        }
    }).catch((error) => {
        console.error("Error counting records in IndexedDB:", error);
    });
}

clearButton.addEventListener("click", async () => {
    await db.test.clear();
    uploadButton.style.display = "";
    update();
});

uploadButton.addEventListener("change", async ()=> { 
    const start = Date.now();
    console.group("File Upload")
    console.log("Hi there")
    // Get the file list from the input element
    const files = uploadButton.files;
    if(files.length !== 1) {
        alert("Please upload exactly one file.");
        return;
    }

    const file = files[0];
    if (!validateFile(file)) {
        return;
    }

    const rawFiles = await unzipFile(file);

    for(const file of rawFiles) {
        if(file.filename.endsWith('.json')) {
            var json = await JSON.parse(file.content);
            console.log("json", json)
        }
    }
    
    db.test.bulkPut(json.data);
    console.log(`Parsed JSON in ${Date.now() - start} ms`);

    update();

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

async function unzipFile(file) {
    // Unzip the file and return a Promise resolving to [{ filename, content }, ...]
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            JSZip.loadAsync(event.target.result)
                .then((zip) => {
                    const filePromises = Object.keys(zip.files).map((filename) => {
                        return zip.files[filename].async('string').then((content) => ({ filename, content }));
                    });
                    Promise.all(filePromises).then(resolve).catch(reject);
                })
                .catch(reject);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function drawBasicGraph(id, db) {
    const labels = []
    const values = []
    console.log("Fetching data from IndexedDB for graph")
    db.test.toArray().then((data) => {
        console.log("all data", data);
        data.map(item => {
            labels.push(item.key)
            values.push(item.value)
        })

        console.log("labels", labels)
        console.log("values", values)

        createBarChart(id, labels, values);

    })
}

window.onload = () => {
    update();
}