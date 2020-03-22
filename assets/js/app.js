$(document).ready(function() {
    // var asu = {lat: -23.30066, lng: -57.63591}
    var asu = {lat: -25.29066, lng: -57.50591},
        map = new google.maps.Map(
        document.getElementById('map'),
        // {zoom: 6.2, center: asu}
        { zoom: 12, center: asu }),
        markers = []

    var markerSzW = 30,
        markerSzH = 30;
    var inactiveMarkerIcon = {
        url: "/assets/img/pin_inactivo.png",
        scaledSize: new google.maps.Size(markerSzW, markerSzH),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };
    var activeMarkerIcon = {
        url: "/assets/img/pin_activo.png",
        scaledSize: new google.maps.Size(markerSzW, markerSzH),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    function resetMarkerIcons() {
        for(i in markers) {
            var m = markers[i]
            m.setIcon(inactiveMarkerIcon)
        }
    }

    function markerFocus(marker) {
        var datos = marker.get('datos')
        resetMarkerIcons()
        $('.detalle_denuncia #tipo_denuncia').text(datos['tipo_denuncia'])
        $('.detalle_denuncia #denunciante').text(datos['denunciante'])
        $('.detalle_denuncia textarea').text(datos['observaciones'])
        $('.detalle_denuncia #fecha').text(datos['creado'].format('DD/MM/YY HH:mm'))
        marker.setIcon(activeMarkerIcon)
    }

    var baseCol = $('.base_col')
    function newCol(marker) {
        var col = baseCol.clone(),
            datos = marker.get('datos')
        col.removeClass('base_col')
        fechaElem = col.find(".fecha")
        fechaElem.text(datos['creado'].format('DD/MM/YY HH:mm'))
        tipoElem = col.find('.tipo')
        tipoElem.text(datos['tipo_denuncia'])
        dptoElem = col.find('.departamento')
        dptoElem.text(datos['departamento'])
        ciudadElem = col.find('.ciudad')
        ciudadElem.text(datos['ciudad'])
        ubicarElem = col.find('a')
        ubicarElem.on('click', function() {
            markerFocus(marker)
        })
        $('#tabla_denuncias').append(col)
    }

    $.get("/reporte/denuncias", function(data) {
        for(i in data) {
            var d = data[i]
            d['creado'] = moment(d['creado'] * 1000)
            var marker = new google.maps.Marker({
                position: d['coordenadas'],
                map: map,
                icon: inactiveMarkerIcon
            })
            markers.push(marker)
            marker.set('datos', d)
            newCol(marker)
            marker.addListener("click", function() {
                markerFocus($(this)[0])
            })
        }
    })
})