


let mapDark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
/* Creating a map object and setting the view to a specific location. */
const map = L.map("map", {zoomControl: false ,
    layers: [mapDark]}).setView([14.184319676012597, 100.55857142487194], 5);

    var baseMaps = {
        "OpenStreetMapDark": mapDark,
        "OpenStreetMap": osm,
        "Mapbox Streets": streets
    };
    var layerControl = L.control.layers(baseMaps).addTo(map);


    const satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	layerControl.addBaseLayer(satellite, 'Satellite');

let zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);

function zoomPoint(lat,lon) {
    map.setView([lat, lon], 18);
    // map.flyTo([lat, lon], 18);
}

async function getData() {
    try {

        
        const res = await fetch('data.json');
        const data = await res.json();
        const dataTable = data.data;


   
        // console.log('dataTable =', dataTable);

        let rowContent = '';
        for (let index = 0; index < dataTable.length; index++) {
            const dataRow = dataTable[index];

            let imgIcon = L.icon({
                iconUrl: `/img/${dataRow.IMG}`,
                iconSize:     [60, 30], // size of the icon
                popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
            });

            

            L.marker([dataRow.LAT, dataRow.LON], {icon: imgIcon}).addTo(map)
    .bindPopup(`<center>${dataRow.texts} 🏖️ <br><br> <img class="myImages" id="myImg" src="/img/${dataRow.IMG}" style="height: 95%; max-width: 100%;"> </center>`);
    // .openPopup();
// 
        
        rowContent += `
        <tr>
        <td><span class="badge badge-warning">${index+1}</span></td>
        <td><button type="button" class="btn btn-info" onclick="zoomPoint(${dataRow.LAT},${dataRow.LON})">Zoom</button></td>
        <td><img class="myImages" id="myImg" src="/img/${dataRow.IMG}" alt="${dataRow.texts}" style="height: 35px;"></td>
        <td>${dataRow.texts}</td>
        <td>${dataRow.LON}</td>
        <td>${dataRow.LAT}</td>
       
        </tr>
    `;

        }
   
    
        //   console.log('rowContent =', rowContent);
        return rowContent;
    } catch (error) {
        console.error(error);
    }
}


function cerateTable() {
    
    getData().then((rowContent) => {

        $(document).ready(function () {

            let modal = document.getElementById('myModal');
            let images = document.getElementsByClassName('myImages');
            let modalImg = document.getElementById("img01");
            let captionText = document.getElementById("caption");

            for (let i = 0; i < images.length; i++) {
            let img = images[i];
            img.onclick = function(evt) {
                modal.style.display = "block";
                modalImg.src = this.src;
                captionText.innerHTML = this.alt;
            }
            }

            let span = document.getElementsByClassName("close")[0];

            span.onclick = function() {
            modal.style.display = "none";
            }

    
            $('#example').DataTable({
                // "lengthChange": true,
                // "searching": false,
                "pageLength" : 6,
                "lengthMenu": [[6, 12, -1], [6, 12, 'Todos']],
                "ordering": true,
                // "info": true,
                "autoWidth": true,
                "responsive": true,
            });
        });

        let dataTable = `
        <table id="example" class="table table-dark table-striped table-bordered nowrap" style="width:100%">
                      <thead>
                          <tr>
                                <th>ID</th>
                                <th>Manage</th>
                                <th>Image</th>
                              <th>Name</th>
                              <th>Latitude</th>
                              <th>Longitude</th>
                              
                          </tr>
                      </thead>
                      <tbody>
                      ${rowContent}
                      </tbody>
                  </table>
        `;
        $("#table").html(dataTable);
    });
}

cerateTable();





