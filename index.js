/* Creating a map object and setting the view to a specific location. */
const map = L.map("map").setView([14.184319676012597, 100.55857142487194], 5);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* Creating a marker on the map. */
// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

function zoomPoint(lat,lon) {
    // map.setView([lat, lon], 5);
    map.flyTo([lat, lon], 18);
}
// zoomPoint(13.184319676012597,100.55857142487194);

async function getData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        const dataTable = data.data;


   
        // console.log('dataTable =', dataTable);

        let rowContent = '';
        for (let index = 0; index < dataTable.length; index++) {
            const dataRow = dataTable[index];

            L.marker([dataRow.LAT, dataRow.LON]).addTo(map)
    .bindPopup(`${dataRow.texts} 🏖️`);
    // .openPopup();
// 
        
        rowContent += `
        <tr>
        <td><span class="badge badge-warning">${index+1}</span></td>
        <td>${dataRow.texts}</td>
        <td>${dataRow.LON}</td>
        <td>${dataRow.LAT}</td>
        <td><button type="button" class="btn btn-info" onclick="zoomPoint(${dataRow.LAT},${dataRow.LON})">Zoom</button></td>
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
            // $("#example").DataTable({
            //     "responsive": true,
            //     // "lengthChange": false,
            //     // "autoWidth": true,
            // });
            $('#example').DataTable({
                // "lengthChange": true,
                // "searching": false,
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
                              <th>Name TH</th>
                              <th>Latitude</th>
                              <th>Longitude</th>
                              <th>Manage</th>
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



