$(document).ready(function () {
    // var asu = {lat: -23.30066, lng: -57.63591}
    var asu = { lat: -25.29066, lng: -57.50591 },
        map = new google.maps.Map(
            document.getElementById('map'),
            // {zoom: 6.2, center: asu}
            { zoom: 12, center: asu }),
        markers = {}
    // window.map = map
    var markerSzW = 30,
        markerSzH = 30;
    currentMarker = null;

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
        for (id in markers) {
            var m = markers[id]
            m.setIcon(inactiveMarkerIcon)
        }
    }

    function markerFocus(marker) {
        currentMarker = marker
        var datos = marker.get('datos')
        resetMarkerIcons()
        $('.detalle_denuncia #tipo_denuncia').text(datos['tipo_denuncia'])
        $('.detalle_denuncia #denunciante').text(datos['denunciante'])
        $('.detalle_denuncia textarea').text(datos['observaciones'])
        $('.detalle_denuncia #fecha').text(datos['creado'].format('DD/MM/YY HH:mm'))
        marker.setIcon(activeMarkerIcon)
        map.setCenter(marker.getPosition())
        map.setZoom(15)
    }

    var baseCol = $('.base_col')
    function newCol(marker) {
        var col = baseCol.clone(),
            datos = marker.get('datos')
        col.removeClass('base_col')
        col.addClass('denuncia_col')
        col.data('id', datos['_id'])

        fechaElem = col.find(".fecha")
        fechaElem.text(datos['creado'].format('DD/MM/YY HH:mm'))
        tipoElem = col.find('.tipo')
        tipoElem.text(datos['tipo_denuncia'])
        dptoElem = col.find('.departamento')
        dptoElem.text(datos['departamento'])
        ciudadElem = col.find('.ciudad')
        ciudadElem.text(datos['ciudad'])
        ubicarElem = col.find('a')
        ubicarElem.on('click', function () {
            markerFocus(marker)
        })
        $('#tabla_denuncias').prepend(col)
    }

    function removeCol(marker) {
        var datos = marker.get('datos')
        $('.denuncia_col').each(function (index, e) {
            var id = $(e).data('id')
            if (id == datos['_id']) {
                $(e).remove()
            }
        })
    }

    function getBounds() {
        boundaries = map.getBounds()
        query = [
            [ boundaries["Za"]["i"], boundaries["Ua"]["i"] ],
            [ boundaries["Za"]["j"], boundaries["Ua"]["j"] ]
        ]
        return query
    }

    function syncMarkers() {
        var boundaries = getBounds()
        $.ajax({
            url: '/reporte/denuncias',
            type: 'POST',
            data: JSON.stringify(boundaries),
            dataType: 'json',
            contentType: 'application/json'
        }).done(function(data) {
            ids = [];
            for (i in data) {
                var d = data[i],
                    id = d['_id']
                ids.push(id)
                // Agregar markers nuevos:
                if (markers[id] == null) {
                    d['creado'] = moment(d['creado'] * 1000)
                    point = new google.maps.LatLng(d['coordenadas'][0], d['coordenadas'][1])
                    var marker = new google.maps.Marker({
                        position: point,
                        map: map,
                        icon: inactiveMarkerIcon
                    })
                    markers[id] = marker
                    marker.set('datos', d)
                    newCol(marker)
                    marker.addListener("click", function () {
                        markerFocus($(this)[0])
                    })
                }
            }
            // Eliminar markers inexistentes o markers que cambiaron de estado:
            for (id in markers) {
                var m = markers[id]
                if (ids.indexOf(id) == -1) {
                    m.setMap(null)
                    removeCol(m)
                    delete(markers[id])
                }
            }
        })
    }

    $('.atendido').on('click', function () {
        var datos = currentMarker.get('datos'),
            id = datos['_id']
        var url = '/reporte/denuncias/' + id + '/atendida'
        $.get(url, function () {
        })
    })

    // syncMarkers()
    setInterval(syncMarkers, 2000)

})