function updateClock(){

    const now =
        new Date();

    const tanggal =
        now.toLocaleDateString(
            'id-ID',
            {
                weekday:'long',
                year:'numeric',
                month:'long',
                day:'numeric'
            }
        );

    const jam =
        now.toLocaleTimeString(
            'id-ID'
        );

    document.getElementById(
        'clock'
    ).innerHTML =
        '📅 ' + tanggal +
        ' | 🕒 ' + jam +
        ' WIB';

}

updateClock();

setInterval(
    updateClock,
    1000
);

$(document).ready(function(){
    if ($.fn.DataTable.isDataTable('#tabelTiket')) {
        $('#tabelTiket').DataTable().destroy();
    }

    const table =
        $('#tabelTiket').DataTable({
            pageLength: 10,
            ordering: false,
            lengthMenu: [10,25,50,100],

            displayStart:
                localStorage.getItem('page')
                ? localStorage.getItem('page') * 10
                : 0,

            language:{
                search:"🔍 Cari:",
                lengthMenu:"Tampilkan _MENU_ tiket",
                info:"Menampilkan _START_ sampai _END_ dari _TOTAL_ tiket",
                paginate:{
                    previous:"←",
                    next:"→"
                }
            }
        });

    table.on('page.dt', function () {

        localStorage.setItem(
            'page',
            table.page()
        );

    });

    setInterval(function(){

        location.reload();

    }, 30000);

});